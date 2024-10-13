// src/api/equativ/manage/route.ts

import { NextRequest, NextResponse } from 'next/server';

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

const buildApiUrl = (method: string, params: Record<string, any>): string | null => {
  const apiBaseUrl = 'https://manage.smartadserverapis.com/2044/';
  const endpoint = apiUrlMap[method];

  if (typeof endpoint === 'function') {
    return `${apiBaseUrl}${endpoint(params)}`;
  }
  return endpoint ? `${apiBaseUrl}${endpoint}` : null;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const method = searchParams.get('method');
  const params: Record<string, any> = {};

  // Extracting search parameters, except the 'method' parameter
  searchParams.forEach((value, key) => {
    if (key !== 'method') {
      params[key] = value;
    }
  });

  try {
    // Validate that method is provided and is a string
    if (!method || typeof method !== 'string') {
      return NextResponse.json({ error: 'Invalid method provided.' }, { status: 400 });
    }

    const apiUrl = buildApiUrl(method, params);
    if (!apiUrl) {
      return NextResponse.json({ error: `Unknown method: ${method}` }, { status: 400 });
    }

    // Prepare fetch configuration
    const fetchConfig: RequestInit = {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${process.env.NEXT_PUBLIC_SMARTADSERVER_LOGIN || ''}:${process.env.NEXT_PUBLIC_SMARTADSERVER_PASSWORD || ''}`)}`,
      },
    };

    // Add query parameters to the API URL
    const urlWithParams = new URL(apiUrl);
    if (params.limit) urlWithParams.searchParams.append('limit', params.limit);
    if (params.offset) urlWithParams.searchParams.append('offset', params.offset);
    if (typeof params.isArchived === 'boolean') {
      urlWithParams.searchParams.append('isArchived', params.isArchived.toString());
    }

    // Make the request using fetch
    const response = await fetch(urlWithParams.toString(), fetchConfig);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des données:', error);
    return NextResponse.json(
      { error: `Une erreur s'est produite lors de la récupération des données : ${error.message}` },
      { status: 500 }
    );
  }
}
