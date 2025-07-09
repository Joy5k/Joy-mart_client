import Cookies from 'js-cookie';

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    // Using js-cookie for consistency (instead of document.cookie)
    Cookies.set('authToken', token, { 
      expires: 365, // days
      path: '/',
      secure: process.env.NODE_ENV === 'production', // secure in production
      sameSite: 'strict'
    });
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    // First check cookies
    const tokenFromCookies = document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1] || Cookies.get('authToken');
    if (tokenFromCookies) {
      return tokenFromCookies;
    }
     
  } 
  return null;
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    document.cookie= "authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Strict";
    }
};