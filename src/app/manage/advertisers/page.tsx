'use client';

import { useEffect, useState } from 'react';
import { DataTable, Advertiser } from '../../../components/DataTableAdvertisers';

export default function AdvertisersPage() {
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer les données des annonceurs via l'API
    const fetchAdvertisers = async () => {
      try {
        const response = await fetch('/api/advertisers');
        const data = await response.json();
        setAdvertisers(data.advertisers);
      } catch (err) {
        setError('Erreur lors de la récupération des annonceurs');
        console.error(err);
      }
    };

    fetchAdvertisers();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">Liste les annonceurs</h1>

      {error && <div className="text-red-500">{error}</div>}

      {/* Utiliser le composant DataTable */}
      <DataTable data={advertisers} />
    </div>
  );
}
