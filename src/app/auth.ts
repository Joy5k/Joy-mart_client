import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization:{
        params:{
        prompt:"consent",
        access_type:"offline",
        response_type:"code",
        scope: "openid email profile",

        }
      }
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
       authorization:{
        params:{
        prompt:"consent",
        access_type:"offline",
        response_type:"code",
        scope:"openid email publick_profile "
        
        }
      }
    }),
  ],

})