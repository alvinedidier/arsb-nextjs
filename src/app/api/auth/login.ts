// Fichier: pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'votre_cle_secrete';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Ici on vérifie l'utilisateur (pour l'exemple, on utilise un utilisateur en dur)
    if (email === 'admin@example.com' && password === 'password') {
      const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}