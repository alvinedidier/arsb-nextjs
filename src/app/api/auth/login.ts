// Fichier: pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// Utilisation d'une variable d'environnement pour la clé secrète
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'default_secret_key';

interface LoginRequestBody {
  email: string;
  password: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body as LoginRequestBody;

    // Validation des entrées
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Exemple basique de vérification d'utilisateur
    if (email === 'admin@example.com' && password === 'password') {
      try {
        // Génération du token JWT
        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({ token });
      } catch (error) {
        return res.status(500).json({ message: 'Error generating token' });
      }
    } else {
      // Erreur si les identifiants sont invalides
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    // Gestion des méthodes non autorisées
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
