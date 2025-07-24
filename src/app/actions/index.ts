// src/app/actions/index.ts
'use server'

import { signIn } from "../auth"
import { AuthError } from "next-auth"

export const handleSocialLogin = async (formData: FormData, redirectTo: string = '/') => {
  const action = formData.get('action');
  
  if (typeof action !== 'string') {
    return { success: false, error: "Invalid provider id" }
  }

  try {
    await signIn(action, { 
      redirectTo,
      redirect: false ,
      callbackUrl: redirectTo,
      provider:action
    });
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { 
        success: false, 
        error: error.cause?.err?.message || error.message 
      }
    }
    return { success: false, error: "Unknown error occurred" }
  }
}