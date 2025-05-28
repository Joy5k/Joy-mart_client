
 

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    document.cookie = `authToken=${token}; path=/; max-age=31536000`; // 1 year
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return (document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1] || '')
  }
  return null;
};

export const removeToken =() => {
  if (typeof window !== 'undefined') {
    document.cookie = 'authToken=; Max-Age=0; path=/';
    };
  
};