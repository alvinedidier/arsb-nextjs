import { NextResponse } from 'next/server';
import NodeCache from 'node-cache';
import { useApiRequest } from '@/hooks/useApiRequest';
import { buildApiUrl } from '@/utils/apiUrlBuilder';
import { useEffect, useState } from 'react';
import { formatDate, calculateDaysBetween, calculateDaysFromEndToToday, resetTimeToMidnight, formatDateCache } from '@/utils/date';

interface ReportRequestProps {
  startDate: string;
  endDate: string;
  campaignId: string;
  method: 'manage' | 'report' | 'forecast';
}

// Initialiser le cache avec une durée de vie de 1 heure (3600 secondes)
const cache = new NodeCache({ stdTTL: 3600 });

// Fonction pour simuler l'appel à une API et générer un rapport
async function fetchReportData(startDate: string, endDate: string, campaignId: string, method: string) {
  console.log('Fetching');

  // Génération de l'URL avec buildApiUrl
  const apiUrl = buildApiUrl("report", { campaignId });
  console.log('ApiUrl : ', apiUrl);

  // Vérifier si `apiUrl` est null avant de faire l'appel à l'API
  if (!apiUrl) {
    throw new Error('API URL is null');
  }

  const reportData = method === 'campaign'
    ? createRequestCampaign(startDate, endDate, campaignId)
    : createRequestCampaignVU(startDate, endDate, campaignId);

  try {
    // Appel direct à l'API avec fetch
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${process.env.NEXT_PUBLIC_SMARTADSERVER_LOGIN}:${process.env.NEXT_PUBLIC_SMARTADSERVER_PASSWORD}`)}`,
      },
      body: JSON.stringify(reportData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reportDataValue = await response.json();
    return reportDataValue;

  } catch (error) {
    console.error('Error fetching report data:', error);
    throw error;
  }
}

// Handler pour la méthode GET (nouveau format pour App Router)
export async function GET(request: Request) {
  try {
    // Extraire les paramètres de la requête avec URLSearchParams
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const campaignId = searchParams.get('campaignId');
    const method = searchParams.get('method');

    // Vérifier la présence des paramètres requis
    if (!startDate || !endDate || !campaignId || !method) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Générer une clé unique pour le cache
    const cacheKey = `campaignID${campaignId}-start${startDate}-end${endDate}-method${method}`;

    // Vérifier si les données sont déjà en cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log('Returning cached data');
      return NextResponse.json({ data: cachedData });
    }

    // Si les données ne sont pas dans le cache, générer un nouveau rapport
    const reportData = await fetchReportData(startDate, endDate, campaignId, method);

    // Stocker le rapport généré dans le cache
    cache.set(cacheKey, reportData);

    // Retourner les nouvelles données de rapport
    return NextResponse.json({ data: reportData });

  } catch (error) {
    console.error('Error generating report:', error);

    // Vérifier si l'erreur est une instance d'Error et accéder à la propriété `message`
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to fetch report data', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to fetch report data' }, { status: 500 });
    }
  }
}

// Fonctions de création de requêtes pour la gestion des campagnes
const createRequestCampaign = (startDate: string, endDate: string, campaignId: string) => ({
  startDate,
  endDate,
  metrics: [
    { field: 'Impressions', outputName: 'Impressions', emptyValue: '0' },
    { field: 'Clicks', outputName: 'Clics', emptyValue: '0' },
    { field: 'ClickRate', outputName: 'Taux de clics', emptyValue: '0' },
    { field: 'VideoComplete', outputName: 'Taux de completion', emptyValue: '0' },
  ],
  dimensions: [
    { field: 'AdvertiserId', outputName: 'Annonceur ID', emptyValue: '0' },
    { field: 'AdvertiserName', outputName: 'Annonceur', emptyValue: '0' },
    { field: 'CampaignId', outputName: 'Campagne ID', emptyValue: '0' },
    { field: 'CampaignName', outputName: 'Campagne', emptyValue: '0' },
    { field: 'InsertionId', outputName: 'Insertion ID', emptyValue: '0' },
    { field: 'InsertionName', outputName: 'Insertion', emptyValue: '0' },
    { field: 'FormatId', outputName: 'Format ID', emptyValue: '0' },
    { field: 'FormatName', outputName: 'Format', emptyValue: '0' },
  ],
  filters: [[{ field: 'CampaignId', operator: 'IN', values: [campaignId] }]],
  useCaseId: 'AdServing',
  dateFormat: "yyyy-MM-dd'T'HH:mm:ss",
  timezone: 'UTC',
  reportName: `Report ${new Date().toISOString()}`,
});

// Fonctions de création de requêtes pour le reporting (VU)
const createRequestCampaignVU = (startDate: string, endDate: string, campaignId: string) => ({
  startDate,
  endDate,
  metrics: [
    { field: 'Impressions', outputName: 'Impressions', emptyValue: '0' },
    { field: 'Clicks', outputName: 'Clics', emptyValue: '0' },
    { field: 'ClickRate', outputName: 'Taux de clics', emptyValue: '0' },
    { field: 'UniqueVisitors', outputName: 'Visiteurs uniques', emptyValue: '0' },
  ],
  dimensions: [
    { field: 'AdvertiserId', outputName: 'Annonceur ID', emptyValue: '0' },
    { field: 'AdvertiserName', outputName: 'Annonceur', emptyValue: '0' },
    { field: 'CampaignId', outputName: 'Campagne ID', emptyValue: '0' },
    { field: 'CampaignName', outputName: 'Campagne', emptyValue: '0' },
  ],
  filters: [[{ field: 'CampaignId', operator: 'IN', values: [campaignId] }]],
  useCaseId: 'AdServing',
  dateFormat: "yyyy-MM-dd'T'HH:mm:ss",
  timezone: 'UTC',
  reportName: `Report Visitors Unique ${new Date().toISOString()}`,
});
