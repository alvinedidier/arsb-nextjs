// src\components\ReportWorkflowRequest.tsx
import React, { useState, useEffect } from 'react';

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
    reportName: `Report Campaign ${campaignId} - Date ${new Date().toISOString()}`,
  });

  const createRequestCampaignVU = (startDate: string, endDate: string, campaignId: string) => ({
    startDate,
    endDate,
    metrics: [
      { field: 'Impressions', outputName: 'Impressions', emptyValue: '0' },
      { field: 'Clicks', outputName: 'Clics', emptyValue: '0' },
      { field: 'ClickRate', outputName: 'Taux de clics', emptyValue: '0' },
      { field: 'VideoComplete', outputName: 'Taux de completion', emptyValue: '0' },
      { field: "UniqueVisitor", outputName: "Visiteurs uniques", emptyValue: "0" }
    ],
    dimensions: [
      { field: 'AdvertiserId', outputName: 'Annonceur ID', emptyValue: '0' },
      { field: 'AdvertiserName', outputName: 'Annonceur', emptyValue: '0' },
      { field: 'CampaignId', outputName: 'Campagne ID', emptyValue: '0' },
      { field: 'CampaignName', outputName: 'Campagne', emptyValue: '0' }
    ],
    filters: [[{ field: 'CampaignId', operator: 'IN', values: [campaignId] }]],
    useCaseId: 'AdServing',
    dateFormat: "yyyy-MM-dd'T'HH:mm:ss",
    timezone: 'UTC',
    reportName: `Report Campaign ${campaignId} VU - Date ${new Date().toISOString()}`,
  });

  const fetchReportId = async () => {
    try {
     // console.log(`ReportBody : ${JSON.stringify(createRequestCampaign(startDate, endDate, campaignId))}`)

      const responseCampaign = await fetch("https://supply-api.eqtv.io/insights/report-async/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${process.env.NEXT_PUBLIC_SMARTADSERVER_LOGIN}:${process.env.NEXT_PUBLIC_SMARTADSERVER_PASSWORD}`)}`,
        },
        body: JSON.stringify(createRequestCampaign(startDate, endDate, campaignId)),
      });

      const reportCampaignData = await responseCampaign.json();
     // console.log('reportData :' + JSON.stringify(reportCampaignData));

      if (reportCampaignData) {
        setReportId(reportCampaignData);
        setLoadingMessage('Préparation des données de la campagne en cours...');
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
        setLoadingMessage(`Téléchargement du fichier CSV pour l'instance ID : ${instanceId}...`);
        fetchCsvData(instanceId);
      } else {
        setLoadingMessage('Merci de votre patience. La récupération est en cours...');
        setTimeout(fetchReportDetails, 20000);
      }
    } catch (error) {
      console.error(error);
      setError('Erreur lors de la récupération des détails du reporting');
    }
  };

  const fetchCsvData = async (instanceId: string) => {
    try {
      const response = await fetch("/api/equativ/csv", {
        method: 'POST',
        body: JSON.stringify(instanceId),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du fichier CSV');
      }

      const csvText = await response.json();
      console.log("csvText: ",csvText.csvData);
      if (csvText) {
        setCsvData(csvText.csvData);
        setLoadingMessage('Le fichier CSV a été récupéré avec succès');
        fetchCsvDownload(csvText.csvData);
      } else {
        setLoadingMessage('Impossible de récupérer le fichier CSV');
      }

    } catch (error: any) {
      console.error(error);
      setError('Erreur lors de la récupération du fichier CSV');
    }
  };

  const fetchCsvDownload = async (csvData: string) => {
    try {
   
     // console.log('Loaded CSV :'+JSON.stringify({csvData, campaignId: campaignId}))
       const response = await fetch("/api/utils/csv", {
        method: 'POST',
        body: JSON.stringify({csv : csvData, campaignId: campaignId}),
        headers: {
          'Content-Type': 'application/json'
        }
      });
        console.log('Response :'+response)
        console.log('Response  ok:'+response.ok)

      // console.log('Loaded CSV :'+JSON.stringify({csv : csvData, campaignId: campaignId}))
     if (!response.ok) {
        throw new Error('Erreur lors de la récupération du fichier CSV data');
      }

      setLoadingMessage('CSV sauvegardé avec succès');
    } catch (error: any) {
      console.error(error);
      setError('Erreur lors de la sauvegarde du fichier CSV');
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
        </div>
      )}
    </div>
  );
};

export default ReportingWorkflow;