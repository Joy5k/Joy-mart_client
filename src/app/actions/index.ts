// src/app/actions/index.ts
'use server'

import { signIn } from "../auth"

export const handleSocialLogin = async (formData: FormData, redirectTo: string = '/') => {
  const action = formData.get('action');
  console.log(action, redirectTo, 'Action and redirect');
  
  if (typeof action !== 'string') {
    return { success: false, error: "Invalid provider id" }
  }

  await signIn(action, { 
         redirectTo:"/"
  });

  return { success: true };
}