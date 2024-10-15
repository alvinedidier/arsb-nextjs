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
    reportName: `Report ${new Date().toISOString()}`,
  });

  const fetchReportId = async () => {
    try {
      console.log(`ReporBody : ${JSON.stringify(createRequestCampaign(startDate, endDate, campaignId))}`)

      const response = await fetch("https://supply-api.eqtv.io/insights/report-async/", {
        method: 'POST',
        headers: {
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
      const response = await fetch("/api/equativ/csv", {
        method: 'POST',
        body: JSON.stringify(instanceId),
      });

     /* if (!response.ok) {
        throw new Error('Erreur lors de la récupération du fichier CSV data');
      }*/

      const csvText = await response.text();
      setCsvData(csvText);
      setLoadingMessage('Fichier CSV récupéré avec succès');
    } catch (error: any) {
      console.error(error);
      setError('Erreur lors de la récupération du fichier CSV');
    }
  };
  
  useEffect(() => {
    if (!reportId) {
     fetchReportId();

    //  const instanceId = "https://storage.googleapis.com/bkt-dwh-read-reporting-prod-eu-reporting_output/2024/10/14/result_04be46f7-d6b2-4f64-97b8-a67657caf058.csv?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=webapi%40fs-async-reporting-prod.iam.gserviceaccount.com%2F20241014%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241014T193105Z&X-Goog-Expires=172800&X-Goog-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3D%22Report%202024-10-14T19%3A30%3A36.548Z.csv%22&response-content-type=text%2Fcsv&X-Goog-Signature=81d00527b981244124205e478e34f190cb0e75daa826820dba8e8fdd4990497e2be8296376b3a93352341704f39bd2a59ab7f8b6aebd5b192eb98dcca66e26b45d38dd35ecaac8fe217133f3a120c6468ef4badef7a2005da18e2de59432db58058fb0f559a2c252b7b83245445562ba58eb477430318c83ee6d77d32cca5445b4ec3093b26008e7a43cf7f4707a34f67c58511bc88228520ab1cfb3a064cc6291e80093a8f76cd069d753a551885c8e71557696e9bbaf72b7adec18b26f9f5467f73721037aca17644434f3feeba4e6ea34c347ee90405c67fcd7cb7d10e1eb0a2f4e39064b5f1dde87073750d6497028cc610c0e468319a372f8cb0546ad49";
    //  fetchCsvData(instanceId);
    
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