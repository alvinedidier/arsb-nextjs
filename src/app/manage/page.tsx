import Image from "next/image";

/*
* Date de 7 derniers jours
*/
function getDateInSevenDays() {
  const today = new Date();
  const dateInSevenDays = new Date(today);
  dateInSevenDays.setDate(today.getDate() + 7);
  return dateInSevenDays.toISOString().split('T')[0]; // Format YYYY-MM-DD
}

async function getCampaigns() {
  try {   

    const response = await fetch('https://manage.smartadserverapis.com/Campaigns?CampaignDeliveryStatusIds=0', {
      headers: {
        'Authorization': 'Basic YWx2aW5lLmRpZGllckBhbnRlbm5lX3JldW5pb246eUJMQ01hZXhXLjhqMGVyanZaWUktT09ueldsZ2Q5LDI=' // Remplacez par vos identifiants encodés en base64
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch campaigns');
    }

    const data = await response.json();
   // console.log('Response : ', data);
    return data;

  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
}

/*
* Date de fin de semaine
*/
function getEndOfWeekDate() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const distanceToSunday = 7 - dayOfWeek;
  const endOfWeekDate = new Date(today);
  endOfWeekDate.setDate(today.getDate() + distanceToSunday);
  return endOfWeekDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
}


 
export default async function Page() {
  const data = await getCampaigns()
  const dayOfWeek = getEndOfWeekDate();
  const nextSevenDays = getDateInSevenDays();

  console.log(dayOfWeek,' - ', nextSevenDays)

  return ( 
    <main className="p-4">
    <h1 className="text-2xl font-bold mb-4">Liste des campagnes</h1>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b-2 border-gray-200">ID</th>
            <th className="py-2 px-4 border-b-2 border-gray-200">Nom</th>
            <th className="py-2 px-4 border-b-2 border-gray-200">Statut</th>
            <th className="py-2 px-4 border-b-2 border-gray-200">Date de début</th>
            <th className="py-2 px-4 border-b-2 border-gray-200">Date de fin</th>
          </tr>
        </thead>
        <tbody>
          {data.map(campaign => (
            <tr key={campaign.id}>
              <td className="py-2 px-4 border-b">{campaign.id}</td>
              <td className="py-2 px-4 border-b">{campaign.name}</td>
              <td className="py-2 px-4 border-b">{campaign.campaignStatusId}</td>
              <td className="py-2 px-4 border-b">{campaign.startDate}</td>
              <td className="py-2 px-4 border-b">{campaign.endDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </main>
  );
}


