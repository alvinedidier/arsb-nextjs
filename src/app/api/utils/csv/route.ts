import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { getCurrentDateComponents } from '@/utils/date';
import { Readable } from 'stream';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Extraire le body de la requête
    const campaignId = body.campaignId; // Récupérer le campagne ID
    const csvData = body.csv; // Utilise directement le champ 'csv'
    const useVU = body.useVU; 

    if (!csvData) {
      return NextResponse.json({ error: 'Missing csvData parameter in request body' }, { status: 400 });
    } 

    if (!campaignId) {
      return NextResponse.json({ error: 'Missing campaignId parameter in request body' }, { status: 400 });
    }

    if (!useVU) {
      return NextResponse.json({ error: 'Missing useVU parameter in request body' }, { status: 400 });
    }

    // Parse the CSV data using csv-parser
    const results = [];
    const stream = Readable.from(csvData);
    await new Promise((resolve, reject) => {
      stream
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    // Obtenir les composants de la date actuelle
    const { year, month, day } = getCurrentDateComponents();

    // Crée un fichier dynamique
    const fileName = `campaignId-${campaignId}-${useVU ? 'VU' : 'ALL'}.json`;
    const filePath = path.join(process.cwd(), 'data/reporting/', year.toString(), month, day, fileName);

    // S'assure que le dossier 'data' existe et gère les erreurs d'écriture de fichier
    try {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
    } catch (fileError) {
      return NextResponse.json({ error: 'Erreur lors de la création du fichier' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Fichier créé avec succès', fileName });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors du traitement de la requête POST' }, { status: 500 });
  }
}