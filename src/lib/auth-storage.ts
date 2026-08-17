import Cookies from 'js-cookie';

const TOKEN_KEY = 'petal_cocoa_token';

export const authStorage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || null;
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    // Set cookie valid for 7 days
    Cookies.set(TOKEN_KEY, token, { expires: 7, path: '/', sameSite: 'lax' });
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    Cookies.remove(TOKEN_KEY, { path: '/' });
    localStorage.removeItem(TOKEN_KEY);
  },
};
