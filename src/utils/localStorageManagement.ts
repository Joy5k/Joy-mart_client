import Cookies from 'js-cookie';
import { verifyToken } from './jwt';

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    // Using js-cookie for consistency (instead of document.cookie)
    Cookies.set('authToken', token, { 
      expires: 365, 
      path: '/',
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict'
    });
  }
};

export const getToken = (): string | undefined => {
  if (typeof window !== 'undefined') {
    // First check cookies
    const tokenFromCookies = document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1] || Cookies.get('authToken');
    if (!tokenFromCookies) {
      return Cookies.get('authToken');
    }
    return tokenFromCookies
     
  } 
  ;
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    document.cookie= "authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Strict";
    }
};

export const getUserRole=()=>{
    const token = getToken();
    
    if (!token) {
    
      return null;
    }
  
    const { role } = verifyToken(token) as {role:'user'|'seller'|'admin'|'superAdmin'};
    return role
}