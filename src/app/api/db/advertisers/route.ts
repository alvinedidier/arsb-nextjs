import { NextResponse } from 'next/server';
const pool = require('@/lib/db');

export async function GET(request) {
  try {
    // Récupérer les paramètres de la requête
    const { searchParams } = new URL(request.url);
    const advertiserId = searchParams.get('advertiser_id');
    const advertiserName = searchParams.get('advertiser_name');
    const advertiserArchived = searchParams.get('advertiser_archived');
    const agencyId = searchParams.get('agency_id');
    const advertiserCreatedAt = searchParams.get('created_at');
    const advertiserUpdatedAt = searchParams.get('updated_at');

    // Ajouter une pagination pour limiter les résultats
    const limit = parseInt(searchParams.get('limit')) || 10; // Nombre de résultats par page
    const offset = parseInt(searchParams.get('offset')) || 0; // À ajuster selon la page demandée

    // Construire la requête SQL pour récupérer les annonceurs
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

    // Ajouter des filtres selon les paramètres fournis
    const queryParams = [];
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

    // Ajouter la pagination
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    // Exécuter la requête SQL avec des paramètres préparés pour éviter les injections SQL
    const [rows] = await pool.query(query, queryParams);

    // Vérifier le format des données avant de les renvoyer
    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: 'Aucun annonceur trouvé' }, { status: 404 });
    }

    // Retourner les résultats
    return NextResponse.json({ advertisers: rows });
  } catch (error) {
    console.error('Erreur lors de la récupération des annonceurs :', error);

    // Retourner une réponse d'erreur plus détaillée
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      return NextResponse.json({ error: 'Erreur de connexion à la base de données' }, { status: 500 });
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      return NextResponse.json({ error: 'Base de données introuvable' }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Erreur lors de la récupération des annonceurs' }, { status: 500 });
    }
  }
}