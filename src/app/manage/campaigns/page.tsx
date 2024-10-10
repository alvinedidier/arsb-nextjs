'use client';

import { useEffect, useState } from 'react';
import { DataTable, Campaign } from '../../../components/DataTableCampaigns';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer les données des campagnes via l'API
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/db/campaigns', { next: { revalidate: 3600 } });
        const data = await response.json();
        console.log('Campaigns : ', data);
        setCampaigns(data.campaigns);
      } catch (err) {
        setError('Erreur lors de la récupération des campagnes');
        console.error(err);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">Liste les campagnes</h1>

      {error && <div className="text-red-500">{error}</div>}

      {/* Utiliser le composant DataTable */
       console.log(campaigns)
      }
      <DataTable data={campaigns} />
    </div>
  );
}
