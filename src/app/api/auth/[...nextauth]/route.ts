import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { AuthOptions, Session } from "next-auth";

// Extend the Session type to include accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Send user data to your backend
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/auth/social-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provider: account?.provider,
            accessToken: account?.access_token,
            email: user.email,
            name: user.name,
            image: user.image,
          }),
        });

        if (!response.ok) {
          return false;
        }

        const data = await response.json();
        (user as any).accessToken = data.accessToken; // Your backend JWT token
        return true;
      } catch (error) {
        console.error('Backend authentication failed:', error);
        return false;
      }
    },
    async jwt({ token, user }) {
      // Attach accessToken from user to token on sign in
      if (user) {
        token.accessToken = (user as any)?.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach accessToken from token to session
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };