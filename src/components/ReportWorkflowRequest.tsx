import React, { useState, useEffect } from 'react';
import { useApiRequest } from '@/hooks/useApiRequest';
import { buildApiUrl } from '@/utils/apiUrlBuilder';

interface ReportingWorkflowProps {
  startDate: string;
  endDate: string;
  campaignId: string;
}

const ReportingWorkflow: React.FC<ReportingWorkflowProps> = ({ startDate, endDate, campaignId }) => {
  const [reportId, setReportId] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [csvData, setCsvData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper function to check if reportId is still valid (within 1 hour)
  const isReportIdValid = (timestamp: number) => {
    const currentTime = new Date().getTime();
    const oneHour = 60 * 60 * 1000; // 1 heure en millisecondes
    return currentTime - timestamp < oneHour;
  };

  // Step 1: Check if we already have a saved reportId in localStorage
  useEffect(() => {
    const savedReportData = localStorage.getItem('reportData');
    if (savedReportData) {
      const { reportId, timestamp } = JSON.parse(savedReportData);
      if (isReportIdValid(timestamp)) {
        setReportId(reportId);
        setLoadingMessage('ReportId récupéré depuis le cache');
      } else {
        localStorage.removeItem('reportData');
      }
    }
  }, []);

  // Step 2: Fetch the reportId from API if not available or expired in localStorage
  useEffect(() => {
    if (!reportId) {
      const reportApiUrl = buildApiUrl('report', { campaignId });

      const { data: reportData, loading: reportLoading, error: reportError } = useApiRequest(reportApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${process.env.NEXT_PUBLIC_SMARTADSERVER_LOGIN}:${process.env.NEXT_PUBLIC_SMARTADSERVER_PASSWORD}`)}`,
        },
        body: JSON.stringify({
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
          reportName: `Report ${new Date().toISOString()}`,
        }),
      });

      if (reportLoading) {
        setLoadingMessage('Création du reporting en cours...');
      } else if (reportError) {
        setError('Erreur lors de la création du reporting');
      } else if (reportData) {
        console.log('ReportData : ' + reportData.id);
        const newReportId = reportData.id;
        setReportId(newReportId);
        setLoadingMessage('Reporting créé, récupération du fichier en cours...');

        // Save the new reportId with a timestamp in localStorage
        const timestamp = new Date().getTime();
        localStorage.setItem('reportData', JSON.stringify({ reportId: newReportId, timestamp }));
      }
    }
  }, [reportId, startDate, endDate, campaignId]);

  // Step 3: Fetch report details using the report ID
  useEffect(() => {
    if (reportId) {
      const fetchReportDetails = async () => {
        try {
          const response = await fetch(`https://supply-api.eqtv.io/insights/report-async/${reportId}`, {
            method: 'GET',
            headers: {
              Authorization: `Basic ${btoa(`${process.env.NEXT_PUBLIC_SMARTADSERVER_LOGIN}:${process.env.NEXT_PUBLIC_SMARTADSERVER_PASSWORD}`)}`,
            },
          });

          const reportDetails = await response.json();
          const instanceId = reportDetails.instanceId;
          setLoadingMessage('Récupération du fichier CSV...');
          fetchCsvData(instanceId);
        } catch (error) {
          setError('Erreur lors de la récupération des détails du reporting');
        }
      };
      fetchReportDetails();
    }
  }, [reportId]);

  // Step 4: Fetch CSV data using the instance ID
  const fetchCsvData = async (instanceId: string) => {
    try {
      const response = await fetch(instanceId);
      const csvText = await response.text();
      setCsvData(csvText);
      localStorage.setItem('reportCsvData', csvText);
      setLoadingMessage('Fichier CSV récupéré avec succès');
    } catch (error) {
      setError('Erreur lors de la récupération du fichier CSV');
    }
  };

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
