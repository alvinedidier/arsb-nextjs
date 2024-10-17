// app/api/equativ/csv/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    
    const body = await req.json(); // Extraire le body de la requête
    const csvUrl = body;
    if (!csvUrl) {
      return NextResponse.json({ error: 'Missing csvUrl parameter in request body' }, { status: 400 });
    }

    // Récupérer les données CSV via l'URL dynamique
    const response = await fetch(csvUrl);

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch CSV: ${response.statusText}` }, { status: 500 });
    }

    const csvData = await response.text();

    // Retourner les données CSV en réponse JSON
    return NextResponse.json({ csvData });
  } catch (error) {
    console.error('Erreur lors de la récupération des données CSV:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des données CSV' }, { status: 500 });
  }
}
