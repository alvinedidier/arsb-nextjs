import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    // Obtenir la date actuelle
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // mois commence à 0, donc +1
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');

    // Construire le chemin du dossier
    const folderPath = path.join(process.cwd(), 'data', year.toString(), month, day);

    // Vérifier si le dossier existe, sinon le créer
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        return NextResponse.json({ message: 'Dossier créé avec succès!', path: folderPath });
    }

    return NextResponse.json({ message: 'Le dossier existe déjà.', path: folderPath });
}
