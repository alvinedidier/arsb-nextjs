import { NextResponse } from 'next/server';
const pool = require('@/lib/db');

export async function GET(request) {
  try {
    // Récupérer les paramètres de la requête
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaign_id');
    const insertionId = searchParams.get('insertion_id');
    const insertionName = searchParams.get('insertion_name');
    const insertionDescription = searchParams.get('insertion_description');
    const insertionStatusId = searchParams.get('insertion_status_id');
    const insertionStartDate = searchParams.get('insertion_start_date');
    const insertionEndDate = searchParams.get('insertion_end_date');
    const packId = searchParams.get('pack_id');
    const deliveryRegulated = searchParams.get('delivery_regulated');
    const usedGuaranteedDeal = searchParams.get('used_guaranteed_deal');
    const usedNonGuaranteedDeal = searchParams.get('used_non_guaranteed_deal');
    const voiceShare = searchParams.get('voice_share');
    const eventId = searchParams.get('event_id');
    const personalizedAd = searchParams.get('personalized_ad');
    const insertionTypeId = searchParams.get('insertion_type_id');
    const deliveryTypeId = searchParams.get('delivery_type_id');
    const timezoneId = searchParams.get('timezone_id');
    const priorityId = searchParams.get('priority_id');
    const periodicCappingId = searchParams.get('periodic_capping_id');
    const groupCappingId = searchParams.get('group_capping_id');
    const maxImpression = searchParams.get('max_impression');
    const weight = searchParams.get('weight');
    const maxClick = searchParams.get('max_click');
    const maxImpressionPerday = searchParams.get('max_impression_perday');
    const maxClickPerday = searchParams.get('max_click_perday');
    const insertionGroupeVolume = searchParams.get('insertion_groupe_volume');
    const eventImpression = searchParams.get('event_impression');
    const holisticYieldEnabled = searchParams.get('holistic_yield_enabled');
    const deliverLeftVolumeAfterEndDate = searchParams.get('deliver_left_volume_after_end_date');
    const globalCapping = searchParams.get('global_capping');
    const cappingPerVisit = searchParams.get('capping_per_visit');
    const cappingPerClick = searchParams.get('capping_per_click');
    const autoCapping = searchParams.get('auto_capping');
    const periodicCappingImpression = searchParams.get('periodic_capping_impression');
    const periodicCappingPeriod = searchParams.get('periodic_capping_period');
    const obaIconEnabled = searchParams.get('oba_icon_enabled');
    const formatId = searchParams.get('format_id');
    const externalId = searchParams.get('external_id');
    const externalDescription = searchParams.get('external_description');
    const insertionUpdatedAt = searchParams.get('insertion_updated_at');
    const insertionCreatedAt = searchParams.get('insertion_created_at');
    const insertionArchived = searchParams.get('insertion_archived');
    const rateTypeId = searchParams.get('rate_type_id');
    const rateNet = searchParams.get('rate_net');
    const discount = searchParams.get('discount');
    const currencyId = searchParams.get('currency_id');
    const insertionLinkId = searchParams.get('insertion_link_id');
    const insertionExclusionId = searchParams.get('insertion_exclusion_id');
    const customizedScript = searchParams.get('customized_script');
    const saleChannelId = searchParams.get('sale_channel_id');

    // Ajouter une pagination pour limiter les résultats
    const limit = parseInt(searchParams.get('limit')) || 10; // Nombre de résultats par page
    const offset = parseInt(searchParams.get('offset')) || 0; // À ajuster selon la page demandée

    // Construire la requête SQL pour récupérer les campagnes, les insertions, et les informations associées
    let query = `
      SELECT
        c.*,
        i.*,
        a.advertiser_name
      FROM asb_campaigns c
      INNER JOIN asb_insertions i ON c.campaign_id = i.campaign_id
      INNER JOIN asb_advertisers a ON c.advertiser_id = a.advertiser_id
      WHERE 1=1
    `;

    // Ajouter des filtres selon les paramètres fournis
    const queryParams = [];
    if (campaignId) {
      query += ' AND c.campaign_id = ?';
      queryParams.push(campaignId);
    }
    if (insertionId) {
      query += ' AND i.insertion_id = ?';
      queryParams.push(insertionId);
    }
    if (insertionName) {
      query += ' AND i.insertion_name LIKE ?';
      queryParams.push(`%${insertionName}%`);
    }
    if (insertionDescription) {
      query += ' AND i.insertion_description LIKE ?';
      queryParams.push(`%${insertionDescription}%`);
    }
    if (insertionStatusId) {
      query += ' AND i.insertion_status_id = ?';
      queryParams.push(insertionStatusId);
    }
    if (insertionStartDate) {
      query += ' AND i.insertion_start_date >= ?';
      queryParams.push(insertionStartDate);
    }
    if (insertionEndDate) {
      query += ' AND i.insertion_end_date <= ?';
      queryParams.push(insertionEndDate);
    }
    if (packId) {
      query += ' AND i.pack_id = ?';
      queryParams.push(packId);
    }
    if (deliveryRegulated) {
      query += ' AND i.delivery_regulated = ?';
      queryParams.push(deliveryRegulated);
    }
    if (usedGuaranteedDeal) {
      query += ' AND i.used_guaranteed_deal = ?';
      queryParams.push(usedGuaranteedDeal);
    }
    if (usedNonGuaranteedDeal) {
      query += ' AND i.used_non_guaranteed_deal = ?';
      queryParams.push(usedNonGuaranteedDeal);
    }
    if (voiceShare) {
      query += ' AND i.voice_share = ?';
      queryParams.push(voiceShare);
    }
    if (eventId) {
      query += ' AND i.event_id = ?';
      queryParams.push(eventId);
    }
    if (personalizedAd) {
      query += ' AND i.personalized_ad = ?';
      queryParams.push(personalizedAd);
    }
    if (insertionTypeId) {
      query += ' AND i.insertion_type_id = ?';
      queryParams.push(insertionTypeId);
    }
    if (deliveryTypeId) {
      query += ' AND i.delivery_type_id = ?';
      queryParams.push(deliveryTypeId);
    }
    if (timezoneId) {
      query += ' AND i.timezone_id = ?';
      queryParams.push(timezoneId);
    }
    if (priorityId) {
      query += ' AND i.priority_id = ?';
      queryParams.push(priorityId);
    }
    if (periodicCappingId) {
      query += ' AND i.periodic_capping_id = ?';
      queryParams.push(periodicCappingId);
    }
    if (groupCappingId) {
      query += ' AND i.group_capping_id = ?';
      queryParams.push(groupCappingId);
    }
    if (maxImpression) {
      query += ' AND i.max_impression = ?';
      queryParams.push(maxImpression);
    }
    if (weight) {
      query += ' AND i.weight = ?';
      queryParams.push(weight);
    }
    if (maxClick) {
      query += ' AND i.max_click = ?';
      queryParams.push(maxClick);
    }
    if (maxImpressionPerday) {
      query += ' AND i.max_impression_perday = ?';
      queryParams.push(maxImpressionPerday);
    }
    if (maxClickPerday) {
      query += ' AND i.max_click_perday = ?';
      queryParams.push(maxClickPerday);
    }
    if (insertionGroupeVolume) {
      query += ' AND i.insertion_groupe_volume = ?';
      queryParams.push(insertionGroupeVolume);
    }
    if (eventImpression) {
      query += ' AND i.event_impression = ?';
      queryParams.push(eventImpression);
    }
    if (holisticYieldEnabled) {
      query += ' AND i.holistic_yield_enabled = ?';
      queryParams.push(holisticYieldEnabled);
    }
    if (deliverLeftVolumeAfterEndDate) {
      query += ' AND i.deliver_left_volume_after_end_date = ?';
      queryParams.push(deliverLeftVolumeAfterEndDate);
    }
    if (globalCapping) {
      query += ' AND i.global_capping = ?';
      queryParams.push(globalCapping);
    }
    if (cappingPerVisit) {
      query += ' AND i.capping_per_visit = ?';
      queryParams.push(cappingPerVisit);
    }
    if (cappingPerClick) {
      query += ' AND i.capping_per_click = ?';
      queryParams.push(cappingPerClick);
    }
    if (autoCapping) {
      query += ' AND i.auto_capping = ?';
      queryParams.push(autoCapping);
    }
    if (periodicCappingImpression) {
      query += ' AND i.periodic_capping_impression = ?';
      queryParams.push(periodicCappingImpression);
    }
    if (periodicCappingPeriod) {
      query += ' AND i.periodic_capping_period = ?';
      queryParams.push(periodicCappingPeriod);
    }
    if (obaIconEnabled) {
      query += ' AND i.oba_icon_enabled = ?';
      queryParams.push(obaIconEnabled);
    }
    if (formatId) {
      query += ' AND i.format_id = ?';
      queryParams.push(formatId);
    }
    if (externalId) {
      query += ' AND i.external_id = ?';
      queryParams.push(externalId);
    }
    if (externalDescription) {
      query += ' AND i.external_description LIKE ?';
      queryParams.push(`%${externalDescription}%`);
    }
    if (insertionUpdatedAt) {
      query += ' AND i.insertion_updated_at = ?';
      queryParams.push(insertionUpdatedAt);
    }
    if (insertionCreatedAt) {
      query += ' AND i.insertion_created_at = ?';
      queryParams.push(insertionCreatedAt);
    }
    if (insertionArchived) {
      query += ' AND i.insertion_archived = ?';
      queryParams.push(insertionArchived);
    }
    if (rateTypeId) {
      query += ' AND i.rate_type_id = ?';
      queryParams.push(rateTypeId);
    }
    if (rateNet) {
      query += ' AND i.rate_net = ?';
      queryParams.push(rateNet);
    }
    if (discount) {
      query += ' AND i.discount = ?';
      queryParams.push(discount);
    }
    if (currencyId) {
      query += ' AND i.currency_id = ?';
      queryParams.push(currencyId);
    }
    if (insertionLinkId) {
      query += ' AND i.insertion_link_id = ?';
      queryParams.push(insertionLinkId);
    }
    if (insertionExclusionId) {
      query += ' AND i.insertion_exclusion_id = ?';
      queryParams.push(insertionExclusionId);
    }
    if (customizedScript) {
      query += ' AND i.customized_script LIKE ?';
      queryParams.push(`%${customizedScript}%`);
    }
    if (saleChannelId) {
      query += ' AND i.sale_channel_id = ?';
      queryParams.push(saleChannelId);
    }

    // Ajouter la pagination
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    // Exécuter la requête SQL avec des paramètres préparés pour éviter les injections SQL
    const [rows] = await pool.query(query, queryParams);

    // Vérifier le format des données avant de les renvoyer
    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: 'Aucune insertion trouvée' }, { status: 404 });
    }

    // Retourner les résultats
    return NextResponse.json({ campaigns: rows });
  } catch (error) {
    console.error('Erreur lors de la récupération des insertions :', error);

    // Retourner une réponse d'erreur plus détaillée
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      return NextResponse.json({ error: 'Erreur de connexion à la base de données' }, { status: 500 });
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      return NextResponse.json({ error: 'Base de données introuvable' }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Erreur lors de la récupération des insertions' }, { status: 500 });
    }
  }
}