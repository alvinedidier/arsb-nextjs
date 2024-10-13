import React, { useEffect, useState } from 'react';
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
        const method = table === 'campaign' ? 'campaign' : 'otherMethod'; // Ajustez selon les méthodes disponibles
        const response = await axios.get(`/api/equativ/manage?method=${method}&campaign_id=${id}`);
        const fetchedData = response.data;
        console.log(fetchedData);

        // Vérifiez si les données existent déjà dans la base de données
        const existingData = await checkIfDataExists(id); // Vérifiez avec l'ID donné

        // Enregistrez ou mettez à jour les données
        if (!existingData) {
          console.error('Enregistrement des données...');
          await saveData(fetchedData);
        } else {
          console.error('Mise à jour des données...');
          await updateData(fetchedData);
        }

        setData(fetchedData);
      } catch (err) {
        console.error('Erreur lors de la récupération des données :', err);
        setError(`Une erreur est survenue lors de la récupération des données : ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, table]);

  const checkIfDataExists = async (campaignId: number) => {
    const queryParams = new URLSearchParams({
      campaign_id: campaignId.toString(),
    }).toString();

    const response = await fetch(`/api/db/campaigns?${queryParams}`);
    const result = await response.json();
    console.log('Nombre d\'occurrences : ', result.count);

    // Supposons que vous vérifiez si la campagne existe et combien d'occurrence 
    return result.count; // Assurez-vous que la réponse a une propriété 'exists'
  };

  const saveData = async (data: any) => {
    try {
      // Générer le campaign_crypt en utilisant bcrypt
      const campaign_id = data.id;
      const campaign_crypt = await Crypto.createHash('md5').update(campaign_id.toString()).digest("hex");

      // Mapper les données de l'API aux champs de votre base de données
      const campaignToSave = {
        campaign_id: campaign_id,
        campaign_name: data.name,
        campaign_crypt: campaign_crypt, // Utilisation du campaign_crypt généré
        advertiser_id: data.advertiserId,
        agency_id: data.agencyId,
        campaign_start_date: data.startDate, // Formatez si nécessaire
        campaign_end_date: data.endDate, // Formatez si nécessaire
        campaign_status_id: data.campaignStatusId,
        campaign_archived: data.isArchived,
        created_at: new Date().toISOString(), // Date actuelle pour created_at
        updated_at: new Date().toISOString(), // Date actuelle pour updated_at
      };

      return await axios.post('/api/db/campaigns', campaignToSave);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des données :", error);
      throw new Error("Échec de l'enregistrement des données.");
    }
  };

  const updateData = async (data: any) => {
    try {
      console.log("Update");
    //  await axios.put(`/api/updateCampaign/${data.campaign_id}`, data);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données :", error);
      throw new Error("Échec de la mise à jour des données.");
    }
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
