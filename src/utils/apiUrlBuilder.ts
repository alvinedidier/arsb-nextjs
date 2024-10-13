// Utils/apiUrlBuilder.ts

// Les endpoints uniquement pour la partie "manage"
export const manageApiUrlMap: {
  [key: string]: string | ((params: any) => string)
} = {
  agencies: 'agencies/',
  advertisers: 'Advertisers',
  advertiser: (params: any) => `advertisers/${params?.advertiser_id}`,
  advertisersCampaigns: (params: any) => `Advertisers/${params?.advertiser_id}/campaigns`,
  campaigns: 'Campaigns/',
  campaign: (params: any) => `campaigns/${params?.campaign_id}`,
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

// Les URLs de base pour chaque type d'API
const apiBaseUrls = {
  manage: 'https://manage.smartadserverapis.com/2044/',
  reporting: 'https://supply-api.eqtv.io/insights/report-async/',
  forecast: 'https://forecast.smartadserverapis.com/2044/forecast',
};

// Fonction pour déterminer l'URL de base en fonction du type de méthode
const getBaseUrlForMethod = (method: string): string => {
  if (method === 'report') {
    return apiBaseUrls.reporting;
  } else if (method === 'forecast') {
    return apiBaseUrls.forecast;
  }
  return apiBaseUrls.manage;
};

// Fonction pour générer l'URL API complète
export const buildApiUrl = (method: string, params: Record<string, any>): string | null => {
  const baseUrl = getBaseUrlForMethod(method);

  // Gestion pour "manage"
  if (baseUrl === apiBaseUrls.manage) {
    const endpoint = manageApiUrlMap[method];
    if (typeof endpoint === 'function') {
      return `${baseUrl}${endpoint(params)}`;
    }
    return endpoint ? `${baseUrl}${endpoint}` : null;
  }

  // Gestion pour "reporting" et "forecast"
  if (baseUrl === apiBaseUrls.reporting || baseUrl === apiBaseUrls.forecast) {
    return baseUrl; // L'URL est déjà complète pour reporting ou forecast
  }

  return null;
};
