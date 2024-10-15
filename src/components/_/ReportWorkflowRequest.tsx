import React, { useState, useEffect } from 'react';
import { buildApiUrl } from '@/utils/apiUrlBuilder';

interface ReportingWorkflowProps {
  startDate: string;
  endDate: string;
  campaignId: string;
}

const ReportingWorkflow: React.FC<ReportingWorkflowProps> = ({ startDate, endDate, campaignId }) => {
  const [reportId, setReportId] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('Chargement du rapport...');
  const [csvData, setCsvData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const fetchReportId = async () => {
    try {
      const reportApiUrl = buildApiUrl('report', { campaignId });

      const response = await fetch(reportApiUrl, {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${process.env.NEXT_PUBLIC_SMARTADSERVER_LOGIN}:${process.env.NEXT_PUBLIC_SMARTADSERVER_PASSWORD}`)}`,
        },
        body: JSON.stringify(createRequestCampaign(startDate, endDate, campaignId)),
      });

      const reportData = await response.json();
      console.log('reportData :' + JSON.stringify(reportData));

      if (reportData) {
        setReportId(reportData);
        setLoadingMessage('Reporting créé, récupération du fichier en cours...' + JSON.stringify(reportData));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error(error);
      setError('Erreur lors de la création du reporting');
    }
  };

  const fetchReportDetails = async () => {
    if (!reportId) return;

    try {
      const response = await fetch(`https://supply-api.eqtv.io/insights/report-async/${reportId}`, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(`${process.env.NEXT_PUBLIC_SMARTADSERVER_LOGIN}:${process.env.NEXT_PUBLIC_SMARTADSERVER_PASSWORD}`)}`,
        },
      });

      const reportDetails = await response.json();
      console.log('reportDetails:', reportDetails);

      const instanceId = reportDetails.instanceId;

      if (instanceId) {
        setLoadingMessage('Récupération du fichier CSV : ' + instanceId);
        fetchCsvData(instanceId);
      } else {
        setLoadingMessage('Récupération de l instance ID impossible pour le moment, nouvelle tentative dans 20 secondes...');
        setTimeout(fetchReportDetails, 20000);
      }
    } catch (error) {
      console.error(error);
      setError('Erreur lors de la récupération des détails du reporting');
    }
  };

  const fetchCsvData = async (instanceId: string) => {
    try {
      console.log('Fetch instanceId : ', instanceId);
      const response = await fetch(instanceId, {
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${process.env.NEXT_PUBLIC_SMARTADSERVER_LOGIN}:${process.env.NEXT_PUBLIC_SMARTADSERVER_PASSWORD}`)}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du fichier CSV');
      }

      const csvText = await response.text();
      setCsvData(csvText);
      setLoadingMessage('Fichier CSV récupéré avec succès : ' + instanceId);
    } catch (error) {
      console.error(error);
      setError('Erreur lors de la récupération du fichier CSV');
    }
  };

  useEffect(() => {
    if (!reportId) {
      fetchReportId();
    }
  }, [startDate, endDate, campaignId]);

  useEffect(() => {
    if (reportId) {
      fetchReportDetails();
    }
  }, [reportId]);

  return (
    <div>
      {loadingMessage && <p>{loadingMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {csvData && (
        <div>
          <h3>Report CSV Data:</h3>
          <pre>{csvData}</pre>
        </div>
      )}
    </div>
  );
};

export default ReportingWorkflow;