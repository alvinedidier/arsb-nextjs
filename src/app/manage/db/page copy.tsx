"use client"

import * as React from "react"
import Link from "next/link";
import { NextResponse } from "next/server";
import mysql from 'mysql2/promise';

// Fonction pour générer les paramètres statiques
export async function generateStaticParams() {
    try {
        // Crée la connexion à la base de données
        const connection = await mysql.createConnection({
          host: process.env.MYSQL_HOST,
          user: process.env.MYSQL_USER,
          database: process.env.MYSQL_DATABASE,
          password: process.env.MYSQL_PASSWORD
        });

        // Exécute la requête SQL pour récupérer les données nécessaires
        const [results, fields] = await connection.execute(
          'SELECT campaign_crypt FROM `asb_campaigns` INNER JOIN `asb_advertisers` ON `asb_advertisers`.`advertiser_id` = `asb_campaigns`.`advertiser_id`'
        );

        // Ferme la connexion à la base de données
        await connection.end();

        // Retourne les paramètres pour la génération statique
        return results.map((row) => ({
          slug: row.campaign_crypt,
        }));

    } catch (err) {
        console.error(err);
        return [];
    }
}

// Fonction pour récupérer les détails d'une campagne par slug
export async function getCampaignBySlug(slug) {
    try {
        // Crée la connexion à la base de données
        const connection = await mysql.createConnection({
          host: process.env.MYSQL_HOST,
          user: process.env.MYSQL_USER,
          database: process.env.MYSQL_DATABASE,
          password: process.env.MYSQL_PASSWORD
        });

        // Exécute la requête SQL pour récupérer les détails de la campagne
        const [results, fields] = await connection.execute(
          'SELECT * FROM `asb_campaigns` INNER JOIN `asb_advertisers` ON `asb_advertisers`.`advertiser_id` = `asb_campaigns`.`advertiser_id` WHERE `campaign_crypt` = ?',
          [slug]
        );

        // Ferme la connexion à la base de données
        await connection.end();

        return results[0];
    } catch (err) {
        console.error(err);
        return null;
    }
}

// Composant de la page
export default function Page({ params }: { params: { slug: string } }) {
    const [campaign, setCampaign] = React.useState(null);

    React.useEffect(() => {
        async function fetchCampaign() {
            const campaignData = await getCampaignBySlug(params.slug);
            setCampaign(campaignData);
        }

        fetchCampaign();
    }, [params.slug]);

    if (!campaign) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Ma Campagne: {campaign.campaign_name}</h1>
            <p>Advertiser: {campaign.advertiser_name}</p>
            <p>Campaign ID: {campaign.campaign_id}</p>
            {/* Affichez d'autres informations de la campagne si nécessaire */}
        </div>
    );
}
