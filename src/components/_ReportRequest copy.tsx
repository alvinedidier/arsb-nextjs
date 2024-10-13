import React, { useState } from 'react';

interface ReportProps {
  startDate: string;
  endDate: string;
  campaignId: string;
}

const ReportComponent: React.FC<ReportProps> = ({ startDate, endDate, campaignId }) => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);

    const body = {
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
      filters: [
        [{ field: 'CampaignId', operator: 'IN', values: [campaignId] }],
      ],
      useCaseId: 'AdServing',
      dateFormat: "yyyy-MM-dd'T'HH:mm:ss",
      timezone: 'UTC',
      onFinishEmails: [],
      urlConfiguration: 'testBugfest',
      reportName: `Report ${new Date().toISOString()}`,
      onErrorEmails: [],
      simulate: false,
    };

    try {
      const response = await fetch('https://supply-api.eqtv.io/insights/report-async/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_SMARTADSERVER_LOGIN}:${process.env.NEXT_PUBLIC_SMARTADSERVER_PASSWORD}`)}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const data = await response.json();
      setResponseData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchReport} disabled={loading}>
        {loading ? 'Generating report...' : 'Generate Report'}
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {responseData && (
        <div>
          <h3>Report Data:</h3>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ReportComponent;