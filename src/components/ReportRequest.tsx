import { useEffect, useState } from 'react';

interface ReportRequestProps {
  startDate: string;
  endDate: string;
  campaignId: string;
  method: 'manage' | 'report' | 'forecast';
}

const ReportRequest: React.FC<ReportRequestProps> = ({ startDate, endDate, campaignId, method }) => {
  const [cachedData, setCachedData] = useState<any>(null); // Pour gérer les données en cache
  const [loading, setLoading] = useState<boolean>(true); // État de chargement
  const [error, setError] = useState<string | null>(null); // État des erreurs

  // Construire l'URL pour appeler l'API
  const apiUrl = `/api/equativ/report?startDate=${startDate}&endDate=${endDate}&campaignId=${campaignId}&method=${method}`;
  console.log(apiUrl);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch report data');
        }

        const result = await response.json();
        setCachedData(result.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [apiUrl]);

  /*
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div>
      <h3>Report Data:</h3>
      {cachedData ? (
        <pre>{JSON.stringify(cachedData, null, 2)}</pre>
      ) : (
        <p>No report data available.</p>
      )}
    </div>
  );
  */

  console.log('CachedData : ', cachedData);
return cachedData;  
};

export default ReportRequest;
