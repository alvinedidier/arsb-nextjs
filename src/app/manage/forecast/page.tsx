import Image from "next/image";
import Papa from 'papaparse';

/*
* Date de 7 derniers jours
*/
function getDateInSevenDays() {
  const today = new Date();
  const dateInSevenDays = new Date(today);
  dateInSevenDays.setDate(today.getDate() + 7);
  return dateInSevenDays.toISOString().split('T')[0]; // Format YYYY-MM-DD
}

async function getCampaignsData(url) {
  try { 
    
    fetch(url)
    .then((response) => response.text())
    .then((data) => console.log(data));

  } catch (error) {
    console.error('Error fetching getCampaignsData:', error);
    throw error;
  }
}

async function getCampaignsLocation(url) {
  try { 
    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Authorization': 'Basic YWx2aW5lLmRpZGllckBhbnRlbm5lX3JldW5pb246eUJMQ01hZXhXLjhqMGVyanZaWUktT09ueldsZ2Q5LDI=', // Remplacez par vos identifiants encodés en base64
        "Content-Type": "application/json"
      },
         next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch getCampaignsLocation');
    }

    const location = response.headers.get('location');
    console.log('Location CSV:', location);
     return location;
  } catch (error) {
    console.error('Error fetching getCampaignsLocation:', error);
    throw error;
  }
}

async function getCampaigns() {
  try {
    const response = await fetch('https://forecast.smartadserverapis.com/2044/forecast/', {
      method: "POST",
      headers: {
        'Authorization': 'Basic YWx2aW5lLmRpZGllckBhbnRlbm5lX3JldW5pb246eUJMQ01hZXhXLjhqMGVyanZaWUktT09ueldsZ2Q5LDI=', // Remplacez par vos identifiants encodés en base64
        "Content-Type": "application/json"
      },
      body:JSON.stringify(
        {
            "fields": ["PageId","TotalImpressions","OccupiedImpressions","AvailableImpressions"],
            "startDate": "2024-06-13T00:00:00",
            "endDate": "2024-06-13T23:59:59",
            "filter": [
              {
                "SiteID":[ "299244", "299245", "337707", "322433", "299248", "299249", "299263", "323124" ]
              },
              {
              "FormatID": [44149, 44152, 79633, 81599, 81943, 79409, 79421, 84652, 84653, 84654, 84655, 84656, 84966, 84967, 84968, 86087, 86088, 79637, 79638, 79642, 79643, 79644, 79645, 79646, 79647, 79648, 79649, 96472, 85016, 106522, 106951, 106959, 106960,79425, 79431, 84657, 84658, 84659, 84660, 84661, 79650, 79651, 79652, 79653, 79654, 79655, 79956, 106521, 106542, 106543, 106952]
              }
            ],
            "fields": ["TotalImpressions", "OccupiedImpressions", "SiteID", "SiteName", "FormatID", "FormatName", "AvailableImpressions"]
          }),
         next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch getCampaigns');
    }

    const location = response.headers.get('location');
   // console.log('Location header:', location);
    return getCampaignsLocation(location);

  } catch (error) {
    console.error('Error fetching getCampaigns:', error);
    throw error;
  }
}


async function getData(url) {
  try {
    const response = await fetch(url, {
          method: 'GET',
          headers: {
              'content-type': 'text/csv;charset=UTF-8',
          }
      });

    if (!response.ok) {
      throw new Error('Failed to fetch getCampaigns');
    }

    const data = response.text();
     return data;
  } catch (error) {
    console.error('Error fetching data:', error);
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



async function groupDataByFormat(data) {
  const parsedData = Papa.parse(data, { header: true, delimiter: ';' }).data;

  const groupedData = parsedData.reduce((acc, row) => {
    const format = row.FormatName.split('_')[1];
    if (!acc[format]) {
      acc[format] = [];
    }
    acc[format].push(row);
    return acc;
  }, {});

  return groupedData;
}

 
export default async function Page() {
  try {
    /*  const location = await getCampaigns();
   // const locationData = await getCampaignsLocation(location);

   const data = await getData(location);
   console.log('Data : ', data);

// Exemple d'utilisation
const groupedData = groupDataByFormat(data);
console.log(groupedData);
*/


const csvData = `
TotalImpressions;OccupiedImpressions;SiteID;SiteName;FormatID;FormatName;AvailableImpressions
18558;12955;299248;SM_LINFO-IOS;79633;APP_INTERSTITIEL;5603
19595;15956;299248;SM_LINFO-IOS;79637;APP_MBAN_ATF0;3639
8587;6745;299248;SM_LINFO-IOS;79638;APP_MBAN_ATF1;1842
3395;1793;299248;SM_LINFO-IOS;79642;APP_MBAN_ATF2;1602
1671;1289;299248;SM_LINFO-IOS;79643;APP_MBAN_ATF3;382
973;770;299248;SM_LINFO-IOS;79644;APP_MBAN_ATF4;203
571;566;299248;SM_LINFO-IOS;79645;APP_MBAN_ATF5;5
4070;2449;299248;SM_LINFO-IOS;79650;APP_MPAVE_ATF1;1621
2929;2257;299248;SM_LINFO-IOS;79651;APP_MPAVE_ATF2;672
1163;1096;299248;SM_LINFO-IOS;79652;APP_MPAVE_ATF3;67
849;587;299248;SM_LINFO-IOS;79653;APP_MPAVE_ATF4;262
959;557;299248;SM_LINFO-IOS;79654;APP_MPAVE_ATF5;402
24061;17793;299248;SM_LINFO-IOS;79956;APP_MPAVE_ATF0;6268
24800;18345;299249;SM_LINFO-ANDROID;79633;APP_INTERSTITIEL;6455
25280;21279;299249;SM_LINFO-ANDROID;79637;APP_MBAN_ATF0;4001
10252;8218;299249;SM_LINFO-ANDROID;79638;APP_MBAN_ATF1;2034
6115;4137;299249;SM_LINFO-ANDROID;79642;APP_MBAN_ATF2;1978
2417;1604;299249;SM_LINFO-ANDROID;79643;APP_MBAN_ATF3;813
2068;1600;299249;SM_LINFO-ANDROID;79644;APP_MBAN_ATF4;468
1566;1167;299249;SM_LINFO-ANDROID;79645;APP_MBAN_ATF5;399
6149;5591;299249;SM_LINFO-ANDROID;79650;APP_MPAVE_ATF1;558
5465;4664;299249;SM_LINFO-ANDROID;79651;APP_MPAVE_ATF2;801
2919;2349;299249;SM_LINFO-ANDROID;79652;APP_MPAVE_ATF3;570
855;704;299249;SM_LINFO-ANDROID;79653;APP_MPAVE_ATF4;151
1520;1054;299249;SM_LINFO-ANDROID;79654;APP_MPAVE_ATF5;466
23494;19075;299249;SM_LINFO-ANDROID;79956;APP_MPAVE_ATF0;4419
22417;2554;299263;SM_ANTENNEREUNION;44149;WEB_HABILLAGE;19863
29009;19483;299263;SM_ANTENNEREUNION;44152;WEB_INTERSTITIEL;9526
6281;3957;299263;SM_ANTENNEREUNION;79409;WEB_MBAN_ATF0;2324
152;0;299263;SM_ANTENNEREUNION;79421;WEB_MBAN_BTF;152
16531;11164;299263;SM_ANTENNEREUNION;79425;WEB_MPAVE_ATF0;5367
0;0;299263;SM_ANTENNEREUNION;79431;WEB_MPAVE_BTF;0
2506;1630;299263;SM_ANTENNEREUNION;84652;WEB_MBAN_ATF1;876
2491;1982;299263;SM_ANTENNEREUNION;84653;WEB_MBAN_ATF2;509
130;22;299263;SM_ANTENNEREUNION;84654;WEB_MBAN_ATF3;108
104;104;299263;SM_ANTENNEREUNION;84655;WEB_MBAN_ATF4;0
10233;7416;299263;SM_ANTENNEREUNION;84657;WEB_MPAVE_ATF1;2817
9357;6941;299263;SM_ANTENNEREUNION;84658;WEB_MPAVE_ATF2;2416
434;347;299263;SM_ANTENNEREUNION;84659;WEB_MPAVE_ATF3;87
61;61;299263;SM_ANTENNEREUNION;84660;WEB_MPAVE_ATF4;0
191;143;299263;SM_ANTENNEREUNION;84661;WEB_MPAVE_ATF5;48
120743;8125;322433;SM_LINFO.re;44149;WEB_HABILLAGE;112618
132224;64311;322433;SM_LINFO.re;44152;WEB_INTERSTITIEL;67913
87705;68717;322433;SM_LINFO.re;79409;WEB_MBAN_ATF0;18988
985;678;322433;SM_LINFO.re;79421;WEB_MBAN_BTF;307
77615;62722;322433;SM_LINFO.re;79425;WEB_MPAVE_ATF0;14893
11989;9408;322433;SM_LINFO.re;79431;WEB_MPAVE_BTF;2581
6466;5081;322433;SM_LINFO.re;84652;WEB_MBAN_ATF1;1385
2151;1799;322433;SM_LINFO.re;84653;WEB_MBAN_ATF2;352
7154;6087;322433;SM_LINFO.re;84654;WEB_MBAN_ATF3;1067
1230;1148;322433;SM_LINFO.re;84655;WEB_MBAN_ATF4;82
6776;4747;322433;SM_LINFO.re;84657;WEB_MPAVE_ATF1;2029
2208;1685;322433;SM_LINFO.re;84658;WEB_MPAVE_ATF2;523
652;364;322433;SM_LINFO.re;84659;WEB_MPAVE_ATF3;288
327;253;322433;SM_LINFO.re;84660;WEB_MPAVE_ATF4;74
478;338;322433;SM_LINFO.re;84966;WEB_MBAN_BTF1;140
702;544;322433;SM_LINFO.re;84967;WEB_MBAN_BTF2;158
764;449;322433;SM_LINFO.re;84968;WEB_MBAN_BTF3;315
8399;7387;322433;SM_LINFO.re;85016;WEB_NATIVE_MBAN_ATF;1012
767;767;322433;SM_LINFO.re;86087;WEB_MBAN_BTF4;0
342;342;322433;SM_LINFO.re;86088;WEB_MBAN_BTF5;0
10201;7188;322433;SM_LINFO.re;96472;WEB_NATIVE_MBAN_BTF;3013
3321;2459;322433;SM_LINFO.re;106521;WEB_MPAVE_ATF1A;862
3742;2885;322433;SM_LINFO.re;106522;WEB_MBAN_ATF1A;857
3674;2542;322433;SM_LINFO.re;106543;WEB_MPAVE_ATF3A;1132
4232;3475;322433;SM_LINFO.re;106951;WEB_MBAN_ATF2A;757
364;364;322433;SM_LINFO.re;106952;WEB_MPAVE_BTF1;0
1305;1305;322433;SM_LINFO.re;106959;WEB_MBAN_ATF3A;0
1227;984;322433;SM_LINFO.re;106960;WEB_MBAN_ATF4A;243
3138;437;323124;SM_DOMTOMJOB;44149;WEB_HABILLAGE;2701
2587;1217;323124;SM_DOMTOMJOB;44152;WEB_INTERSTITIEL;1370
1342;1027;323124;SM_DOMTOMJOB;79425;WEB_MPAVE_ATF0;315
`;

// Exemple d'utilisation
const groupedData = groupDataByFormat(csvData);
console.log(groupedData);

    const dayOfWeek = getEndOfWeekDate();
    const nextSevenDays = getDateInSevenDays();

    return (
      <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Grouped Data</h1>
      <pre>{JSON.stringify(groupedData, null, 2)}</pre>
      </main>
    );
  } catch (error) {
    console.error('Error in Page component:', error);
    return (
      <main className="p-4">
        <h1 className="text-2xl font-bold mb-4">Erreur</h1>
        <p>{error.message}</p>
      </main>
    );
  }
}