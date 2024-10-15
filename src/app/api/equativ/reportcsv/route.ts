// app/api/equativ/reportcsv/route.ts

import type { NextApiRequest, NextApiResponse } from 'next';

// API handler pour récupérer les données CSV
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const csvUrl = "https://storage.googleapis.com/bkt-dwh-read-reporting-prod-eu-reporting_output/2024/10/14/result_a9febd37-9f07-4605-82e5-09e03300112f.csv?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=webapi%40fs-async-reporting-prod.iam.gserviceaccount.com%2F20241014%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20241014T073827Z&X-Goog-Expires=172800&X-Goog-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3D%22Report%202024-10-14T07%3A37%3A52.789Z.csv%22&response-content-type=text%2Fcsv&X-Goog-Signature=00f877b59ff1987493cf3226f6cf95182fbf73d3c65d879ccf636475dbafb32040b1f5d22322e78ddd7148ee39f5202e536ba5593b6bcdfb9a0b9181e02a9fcf4bac1aee61c91515a5575a850e175b08f3a14a76f69434a6e7de3b10dda216dbac3772d1583d27c80642a37ed902d4871fe31b018c11c552cd8ee87a44518325097388e508c4fe22a122b614b31f66f0e625f43e31134ec115904d58e69498c4bfcfdfce6ab27b392784f3f625647d6d418257d3b2983c87a58512a040ffaa60ac3754d7dc0f3156a670a3dfc5bd117e931e4d4494608622d168600333287b95007614edfc8ac1b90cb047ebfa65915471992cf62c2026020be6c4bc55138e2f";

  try {
    // Récupérer les données CSV
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }

    const csvData = await response.text();

    // Renvoyer les données CSV au format JSON
    res.status(200).json({ csvData });
  } catch (error) {
    console.error('Erreur lors de la récupération des données CSV:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données CSV' });
  }
}
