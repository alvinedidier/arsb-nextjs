// Fichier: middleware/auth.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'votre_cle_secrete';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    jwt.verify(token, SECRET_KEY);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/protected/:path*', '/manage/:path*', '/api/:path*'],
};

// Fichier: pages/protected/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const ProtectedPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return <div>Page protégée, accessible seulement aux utilisateurs authentifiés.</div>;
};

export default ProtectedPage;