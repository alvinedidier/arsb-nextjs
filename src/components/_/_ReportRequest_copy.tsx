import { useApiRequest } from '@/hooks/useApiRequest';
import { buildApiUrl } from '@/utils/apiUrlBuilder';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache TTL d'une heure

interface ReportRequestProps {
  startDate: string;
  endDate: string;
  campaignId: string;
  method: 'campaign' | 'report' | 'forecast';
}

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

const ReportRequest: React.FC<ReportRequestProps> = ({ startDate, endDate, campaignId, method }) => {
  // Génération de l'URL avec buildApiUrl
  const apiUrl = buildApiUrl("report", { campaignId });

  console.log('ApiUrl : ', apiUrl);

  // Choix du corps de la requête selon la méthode
  const body = method === 'campaign'
    ? createRequestCampaign(startDate, endDate, campaignId)
    : createRequestCampaignVU(startDate, endDate, campaignId); // Pour reporting (VU)

  // Utilisation de l'API request
  const { data: reportData, loading, error } = useApiRequest(apiUrl!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${process.env.NEXT_PUBLIC_SMARTADSERVER_LOGIN}:${process.env.NEXT_PUBLIC_SMARTADSERVER_PASSWORD}`)}`,
    },
    body: JSON.stringify(body),
  });

  console.log('Body : ', body);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {reportData && (
        <div>
          <h3>Report Data:</h3>
          <pre>{JSON.stringify(reportData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ReportRequest;
