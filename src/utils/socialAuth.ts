//src/utils/socialAuth.ts
'use server'

import { auth } from "../app/auth"

export const SocialSession=async()=>{
      const session=await auth()
        if(session?.user){
            return session.user ? session.user : null
        }
}