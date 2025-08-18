import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"

type TokenUser = {
  id?: string;
  name?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  image?: string;
  provider?: string;
};

declare module "next-auth/jwt" {
  interface JWT {
    user?: TokenUser;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile" 
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ,
          email: profile.email,
          image: profile.picture
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Persist provider data to token
      if (user) {
        token.user = {
          id: user.id,
          name: user.name ?? undefined,
          email: user.email ?? undefined,
          given_name: (user as any).given_name ?? (profile as any)?.given_name ?? undefined,
          family_name: (user as any).family_name ?? (profile as any)?.family_name ?? undefined,
          image: user.image ?? (profile as any)?.picture ?? undefined,
          provider: account?.provider
        }
      }
      return token
    },
    async session({ session, token }) {
      // Send provider data to client
      session.user = {
        ...session.user,
        ...(typeof token.user === 'object' && token.user !== null ? token.user : {})
      }
      // Attach provider to session object instead of session.user
      if (token.user?.provider) {
        (session as any).provider = token.user.provider;
      }
      return session
    }
  },
  session: {
    strategy: "jwt"
  }
})