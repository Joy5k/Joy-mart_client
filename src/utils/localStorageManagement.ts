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
    return Cookies.get('authToken') ?? null;
  } else if( typeof document !== 'undefined') {
    return localStorage.getItem('authToken') ?? null;
  }
  return null;
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    Cookies.remove('authToken', { path: '/' });
    localStorage.removeItem('authToken');
    // For thoroughness, also clear from document.cookie
    Cookies.remove('authToken', { path: '/' });
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};