// route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de la requête
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaign_id');
    const campaignName = searchParams.get('campaign_name');
    const campaignCrypt = searchParams.get('campaign_crypt');
    const advertiserId = searchParams.get('advertiser_id');
    const agencyId = searchParams.get('agency_id');
    const campaignStartDate = searchParams.get('campaign_start_date');
    const campaignEndDate = searchParams.get('campaign_end_date');
    const campaignStatusId = searchParams.get('campaign_status_id');
    const campaignArchived = searchParams.get('campaign_archived');
    const createdAt = searchParams.get('created_at');
    const updatedAt = searchParams.get('updated_at');

    // Récupérer les paramètres de tri (classement)
    const orderBy = searchParams.get('order_by') || 'c.campaign_id'; // Colonne par défaut : campaign_id
    const order = searchParams.get('order')?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'; // Ordre par défaut : ASC

    // Ajouter une pagination pour limiter les résultats (si nécessaire)
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    
    const limit = limitParam ? parseInt(limitParam, 10) : ''; // Valeur par défaut : 10
    const offset = offsetParam ? parseInt(offsetParam, 10) : ''; // Valeur par défaut : 0

    // Construire la requête SQL pour récupérer les campagnes et les informations des annonceurs associées
    let query = `
      SELECT
        c.*,
        a.advertiser_name
      FROM asb_campaigns c
      INNER JOIN asb_advertisers a ON c.advertiser_id = a.advertiser_id
      WHERE 1=1
    `;

    // Ajouter des filtres selon les paramètres fournis
    const queryParams: (string | number)[] = [];
    if (campaignId) {
      query += ' AND c.campaign_id = ?';
      queryParams.push(campaignId);
    }
    if (campaignName) {
      query += ' AND c.campaign_name LIKE ?';
      queryParams.push(`%${campaignName}%`);
    }
    if (campaignCrypt) {
      query += ' AND c.campaign_crypt = ?';
      queryParams.push(campaignCrypt);
    }
    if (advertiserId) {
      query += ' AND c.advertiser_id = ?';
      queryParams.push(advertiserId);
    }
    if (agencyId) {
      query += ' AND c.agency_id = ?';
      queryParams.push(agencyId);
    }
    if (campaignStartDate) {
      query += ' AND c.campaign_start_date >= ?';
      queryParams.push(campaignStartDate);
    }
    if (campaignEndDate) {
      query += ' AND c.campaign_end_date <= ?';
      queryParams.push(campaignEndDate);
    }
    if (campaignStatusId) {
      query += ' AND c.campaign_status_id = ?';
      queryParams.push(campaignStatusId);
    }
    if (campaignArchived) {
      query += ' AND c.campaign_archived = ?';
      queryParams.push(campaignArchived);
    }
    if (createdAt) {
      query += ' AND c.created_at >= ?';
      queryParams.push(createdAt);
    }
    if (updatedAt) {
      query += ' AND c.updated_at <= ?';
      queryParams.push(updatedAt);
    }

    query += ` ORDER BY ${orderBy} ${order}`;
    if (limit) {
      query += ` LIMIT ?`;
      queryParams.push(limit);
    }

    if (offset) {
      query += `  OFFSET ?`;
      queryParams.push(offset);
    }
   // queryParams.push(limit, offset);

    // Exécuter la requête SQL avec des paramètres préparés pour éviter les injections SQL
    const [rows] = await pool.query(query, queryParams);

    // Vérifier le format des données avant de les renvoyer
    if (!rows || rows.length === 0) {
      return NextResponse.json({ count: 0, message: 'Aucune campagne trouvée' }, { status: 200 });
    }

    // Retourner les résultats
    return NextResponse.json({ count: rows.length, campaigns: rows });
  } catch (error) {
    console.error('Erreur lors de la récupération des campagnes :', error);

    // Retourner une réponse d'erreur détaillée selon le code d'erreur SQL
    if (error instanceof Error && 'code' in error) {
      const sqlError = error as { code: string };

      if (sqlError.code === 'ER_ACCESS_DENIED_ERROR') {
        return NextResponse.json({ error: 'Erreur de connexion à la base de données' }, { status: 500 });
      } else if (sqlError.code === 'ER_BAD_DB_ERROR') {
        return NextResponse.json({ error: 'Base de données introuvable' }, { status: 500 });
      }
    }

    // Si l'erreur ne correspond pas aux cas ci-dessus
    return NextResponse.json({ error: 'Erreur lors de la récupération des campagnes' }, { status: 500 });
  }
}
