import fs from 'fs';
import path from 'path';

// Fonction utilitaire pour créer un dossier si nécessaire
export function ensureFolderExists(folderPath: string): boolean {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        return true; // Dossier créé
    }
    return false; // Dossier existant
}
