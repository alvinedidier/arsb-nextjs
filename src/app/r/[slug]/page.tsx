"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Page({ params }: { params: { slug: string } }) {
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { slug } = params;

    useEffect(() => {
        async function fetchCampaign() {
            try {
                const response = await fetch(`/api/campaign/${slug}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCampaign(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        fetchCampaign();
    }, [slug]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!campaign) {
        return <div>Aucune campagne trouvée.</div>;
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
