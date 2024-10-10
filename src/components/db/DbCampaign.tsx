import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Crypto from 'crypto';

interface NotFoundComponentProps {
  id: number;
  table: string;
}

const NotFoundComponent: React.FC<NotFoundComponentProps> = ({ id, table }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getDataFromAPI(id, table);
        const existingData = await checkIfDataExists(id);

        await saveOrUpdateData(fetchedData, existingData);

        setData(fetchedData);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, table]);

  const getDataFromAPI = async (id: number, table: string) => {
    const method = table === 'campaign' ? 'campaign' : 'otherMethod';
    const response = await axios.get(`/api/equativ/manage?method=${method}&campaign_id=${id}`);
    return response.data;
  };

  const checkIfDataExists = async (campaignId: number) => {
    const queryParams = new URLSearchParams({ campaign_id: campaignId.toString() }).toString();
    const response = await fetch(`/api/db/campaigns?${queryParams}`);
    const result = await response.json();
    console.log('Nombre d\'occurrences : ', result.count);
    return result.count;
  };

  const saveOrUpdateData = async (fetchedData: any, existingData: any) => {
    if (!existingData) {
      console.log('Enregistrement des données...');
      await saveData(fetchedData);
    } else {
      console.log('Mise à jour des données...');
      await updateData(fetchedData);
    }
  };

  const generateCampaignCrypt = (campaign_id: number) => {
    return Crypto.createHash('md5').update(campaign_id.toString()).digest("hex");
  };

  const saveData = async (data: any) => {
    try {
      const campaign_crypt = generateCampaignCrypt(data.id);
      const campaignToSave = mapDataForDB(data, campaign_crypt);
      // return await axios.post('/api/db/campaigns', campaignToSave);
      await axios.post('/api/db/campaigns', campaignToSave);
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des données :", error);
      throw new Error("Échec de l'enregistrement des données.");
    }
  };

  const updateData = async (data: any) => {
    try {
      console.log("Update");
      // await axios.put(`/api/updateCampaign/${data.campaign_id}`, data);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données :", error);
      throw new Error("Échec de la mise à jour des données.");
    }
  };

  const mapDataForDB = (data: any, campaign_crypt: string) => ({
    campaign_id: data.id,
    campaign_name: data.name,
    campaign_crypt,
    advertiser_id: data.advertiserId,
    agency_id: data.agencyId,
    campaign_start_date: data.startDate,
    campaign_end_date: data.endDate,
    campaign_status_id: data.campaignStatusId,
    campaign_archived: data.isArchived,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const handleError = (err: any) => {
    console.error('Erreur lors de la récupération des données :', err);
    setError(`Une erreur est survenue lors de la récupération des données : ${err.message}`);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur : </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Aucune donnée trouvée.</strong>
        <p className="mt-2">Les données de la table '{table}' (ID: {id}) ont été récupérées et traitées.</p>
      </div>
    </div>
  );
};

export default NotFoundComponent;
