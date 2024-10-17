// Fichier: middleware/auth.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'votre_cle_secrete';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value; // Utilisation de `.value` pour extraire la chaîne de caractères

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // Vérification du token avec jwt.verify
    jwt.verify(token, SECRET_KEY);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/protected/:path*', '/manage/:path*', '/api/:path*'],
};