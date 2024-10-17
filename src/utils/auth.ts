// Fichier: utils/auth.ts
export function getTokenFromCookies() {
    return document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  }