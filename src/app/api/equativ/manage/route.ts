// src/api/equativ/manage/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const apiUrlMap: { [key: string]: string | ((params: any) => string) } = {
  agencies: 'agencies/',
  advertisers: 'Advertisers',
  advertiser: (params: any) => `advertisers/${params?.advertiser_id}`,
  advertisersCampaigns: (params: any) => `Advertisers/${params?.advertiser_id}/campaigns`,
  campaigns: 'Campaigns/',
  campaign: (params: any) => `campaigns/${params?.campaign_id}`,
  campaignsInsertions: (params: any) => `campaigns/${params?.campaign_id}/insertions/`,
  formats: 'formats',
  sites: 'sites',
  packs: 'packs',
  templates: 'templates',
  platforms: 'platforms',
  deliverytypes: 'deliverytypes',
  countries: 'countries',
  insertions: 'insertions',
  insertion: (params: any) => `insertions/${params?.insertion_id}`,
  insertions_templates: (params: any) => `insertions/${params?.insertion_id}/insertiontemplates`,
  insertions_status: 'insertions_status',
  insertions_priorities: 'insertionpriorities',
  creatives: (params: any) => `insertions/${params?.insertion_id}/creatives`,
};

const buildApiUrl = (method: string, params: any) => {
  const apiBaseUrl = 'https://manage.smartadserverapis.com/2044/';
  const endpoint = apiUrlMap[method];

  if (typeof endpoint === 'function') {
    return `${apiBaseUrl}${endpoint(params)}`;
  }
  return endpoint ? `${apiBaseUrl}${endpoint}` : null;
};

// Fonction handler GET exportée spécifiquement
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const method = searchParams.get('method');
  const params: any = {};

  searchParams.forEach((value, key) => {
    if (key !== 'method') {
      params[key] = value;
    }
  });

  try {
    // Validate required parameter
    if (!method || typeof method !== 'string') {
      return NextResponse.json({ error: 'Invalid method provided.' }, { status: 400 });
    }

    const apiUrl = buildApiUrl(method, params);
    if (!apiUrl) {
      return NextResponse.json({ error: `Unknown method: ${method}` }, { status: 400 });
    }

    // Prepare Axios config
    const config = {
      method: 'GET',
      url: apiUrl,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      auth: {
        username: process.env.NEXT_PUBLIC_SMART_LOG || '',
        password: process.env.NEXT_PUBLIC_SMART_PASS || '',
      },
      params: {
        ...(params.limit && { limit: params.limit }),
        ...(params.offset && { offset: params.offset }),
        ...(typeof params.isArchived === 'boolean' && { isArchived: params.isArchived }),
      },
    };

    // Make request to external API
    const response = await axios(config);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return NextResponse.json({ error: `Une erreur s'est produite lors de la récupération des données : ${error}.` }, { status: 500 });
  }
}
