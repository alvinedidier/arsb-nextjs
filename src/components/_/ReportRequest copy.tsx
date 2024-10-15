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

const ReportRequest: React.FC<ReportRequestProps> = ({ startDate, endDate, campaignId, method }) => {
  const [cachedData, setCachedData] = useState<any>(null); // Pour gérer les données en cache
  const [shouldFetch, setShouldFetch] = useState<boolean>(true); // Contrôle de l'appel API

  // Génération de l'URL avec buildApiUrl
  const apiUrl = buildApiUrl("report", { campaignId });
  console.log('ApiUrl : ', apiUrl);

  // Utiliser une clé unique pour le cache basée sur l'URL et les paramètres de la requête
  // const cacheKey = `${apiUrl}-${startDate}-${endDate}-${campaignId}-${method}`;
  const cacheKey = `campaignID${campaignId}-DateCache${formatDateCache()}`;  

  // Utilisation de localStorage pour le cache côté client
  useEffect(() => {
    const cachedReportData = localStorage.getItem(cacheKey);

    if (cachedReportData) {
      console.log('Using cached data from localStorage');
      setCachedData(JSON.parse(cachedReportData));
      setShouldFetch(false); // Pas besoin de faire un appel API si les données sont en cache
    }
  }, [cacheKey]);

  // Choix du corps de la requête selon la méthode
  const body = method === 'campaign'
    ? createRequestCampaign(startDate, endDate, campaignId)
    : createRequestCampaignVU(startDate, endDate, campaignId); // Pour reporting (VU)

  // Utilisation de l'API request si le fetch est nécessaire (pas de cache)
  const { data: reportData, loading, error } = useApiRequest(
    shouldFetch ? apiUrl! : null, // Appeler l'API uniquement si shouldFetch est true
    shouldFetch ? {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${process.env.NEXT_PUBLIC_SMARTADSERVER_LOGIN}:${process.env.NEXT_PUBLIC_SMARTADSERVER_PASSWORD}`)}`,
      },
      body: JSON.stringify(body),
    } : null // Ne pas faire d'appel API si shouldFetch est false
  );

  // Mettre à jour le cache avec les nouvelles données
  useEffect(() => {
    if (reportData && shouldFetch) {
      console.log('Caching new data in localStorage');
      localStorage.setItem(cacheKey, JSON.stringify(reportData)); // Mise en cache des nouvelles données dans localStorage
      setCachedData(reportData); // Mise à jour des données affichées
    }
  }, [reportData, shouldFetch, cacheKey]);

  // Si les données sont en cache, on les utilise, sinon on affiche les données récupérées
  const displayData = cachedData || reportData;

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {displayData && (
        <div>
          <h3>Report Data:</h3>
          <pre>{JSON.stringify(displayData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

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
  onFinishEmails: [],
  urlConfiguration: 'testBugfest',
  reportName: `Report Visitors Unique ${new Date().toISOString()}`,
  onErrorEmails: [],
  simulate: false,
});

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
  onFinishEmails: [],
  urlConfiguration: 'testBugfest',
  reportName: `Report ${new Date().toISOString()}`,
  onErrorEmails: [],
  simulate: false,
});

export default ReportRequest;