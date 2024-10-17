import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // Importer le type NextRequest pour typer le paramètre
const pool = require('@/lib/db');

export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de la requête
    const { searchParams } = new URL(request.url);
    const advertiserId = searchParams.get('advertiser_id');
    const advertiserName = searchParams.get('advertiser_name');
    const advertiserArchived = searchParams.get('advertiser_archived');
    const agencyId = searchParams.get('agency_id');
    const advertiserCreatedAt = searchParams.get('created_at');
    const advertiserUpdatedAt = searchParams.get('updated_at');

     // Ajouter la pagination (si nécessaire)
     const limit = parseInt(searchParams.get('limit') ?? '10', 10);
     const offset = parseInt(searchParams.get('offset') ?? '0', 10);

    let query = `
      SELECT
        a.advertiser_id,
        a.advertiser_name,
        a.advertiser_archived,
        a.agency_id,
        a.created_at,
        a.updated_at
      FROM asb_advertisers a
      WHERE 1=1
    `;

    const queryParams: (string | number)[] = [];
    if (advertiserId) {
      query += ' AND a.advertiser_id = ?';
      queryParams.push(advertiserId);
    }
    if (advertiserName) {
      query += ' AND a.advertiser_name LIKE ?';
      queryParams.push(`%${advertiserName}%`);
    }
    if (advertiserArchived) {
      query += ' AND a.advertiser_archived = ?';
      queryParams.push(advertiserArchived);
    }
    if (agencyId) {
      query += ' AND a.agency_id = ?';
      queryParams.push(agencyId);
    }
    if (advertiserCreatedAt) {
      query += ' AND a.created_at = ?';
      queryParams.push(advertiserCreatedAt);
    }
    if (advertiserUpdatedAt) {
      query += ' AND a.updated_at = ?';
      queryParams.push(advertiserUpdatedAt);
    }

    query += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    const [rows] = await pool.query(query, queryParams);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: 'Aucun annonceur trouvé' }, { status: 404 });
    }

    return NextResponse.json({ advertisers: rows });
  } catch (error) {
    console.error('Erreur lors de la récupération des annonceurs :', error);

    // Vérification que l'erreur est bien un objet avec une propriété `code`
    if (error instanceof Error && 'code' in error) {
      const sqlError = error as { code: string };

      // Retourner une réponse d'erreur détaillée selon le code d'erreur SQL
      if (sqlError.code === 'ER_ACCESS_DENIED_ERROR') {
        return NextResponse.json({ error: 'Erreur de connexion à la base de données' }, { status: 500 });
      } else if (sqlError.code === 'ER_BAD_DB_ERROR') {
        return NextResponse.json({ error: 'Base de données introuvable' }, { status: 500 });
      }
    }

    // Si l'erreur ne correspond pas aux cas ci-dessus
    return NextResponse.json({ error: 'Erreur lors de la récupération des annonceurs' }, { status: 500 });
  }
}
