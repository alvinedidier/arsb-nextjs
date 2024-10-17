'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { notFound } from 'next/navigation';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Eye, MousePointerClick, Percent, Play, Repeat, Users, Calendar, DollarSign, Store, Settings, Edit, ExternalLink, FileText, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

import CardCampaign from '@/components/ui/card-campaign';
import { formatDate, calculateDaysBetween, calculateDaysFromEndToToday, resetTimeToMidnight } from '@/utils/date';

import ReportRequest from '@/components/ReportRequest';
import ReportWorkflowRequest from '@/components/ReportWorkflowRequest';

interface PageProps {
  params: {
    crypt: string;
  };
}

// Définition de l'interface Campaign
interface Campaign {
  campaign_id: number;
  campaign_name: string;
  advertiser_name: string;
  advertiser_id: number;
  campaign_start_date: string;
  campaign_end_date: string;
}

export default function Page({ params }: PageProps) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [screenshots, setScreenshots] = useState<File[]>([]);

  const [formattedDateStart, setFormattedDateStart] = useState<string | null>(null);
  const [formattedDateEnd, setFormattedDateEnd] = useState<string | null>(null);
  const [daysBetween, setDaysBetween] = useState<number | null>(null);
  const [daysFromEndToToday, setDaysFromEndToToday] = useState<number | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!params.crypt) {
        setError("L'identifiant de la campagne est invalide.");
        setLoading(false);
        return;
      }

      try {
        const queryParams = new URLSearchParams({
          campaign_crypt: params.crypt
        }).toString();

        const response = await fetch(`/api/db/campaigns?${queryParams}`, { next: { revalidate: 3600 } });

        if (!response.ok) {
          setError(`Campagne non trouvée pour l'ID : ${params.crypt}`);
          setLoading(false);
          return;
        }

        const campaignData = await response.json();

        if (!campaignData.campaigns || !Array.isArray(campaignData.campaigns) || campaignData.campaigns.length === 0) {
          setError("Aucune campagne trouvée.");
          setLoading(false);
          return;
        }

        setCampaign(campaignData.campaigns[0]);

        const start = resetTimeToMidnight(campaignData.campaigns[0].campaign_start_date);
        const end = resetTimeToMidnight(campaignData.campaigns[0].campaign_end_date);

        const formattedStart = formatDate(start);
        const formattedEnd = formatDate(end);
        const daysBtwn = calculateDaysBetween(start, end);
        const daysFromEnd = calculateDaysFromEndToToday(end);

        setFormattedDateStart(formattedStart);
        setFormattedDateEnd(formattedEnd);
        setDaysBetween(daysBtwn);
        setDaysFromEndToToday(daysFromEnd);

      } catch (error) {
        setError(`Une erreur s'est produite lors de la récupération de la campagne : ${error}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [params.crypt]);

  const handleScreenshotUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setScreenshots(Array.from(event.target.files)); 
    }
  };

  if (loading) {
    return <Skeleton className="h-70 w-full mb-4" />;
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

  if (!campaign) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Aucune campagne trouvée.</strong>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Demande de Rapport</h1>
        <ReportWorkflowRequest 
          startDate={campaign.campaign_start_date}
          endDate={campaign.campaign_end_date}
          campaignId={campaign.campaign_id}
        />
      </div>

      <hr />

      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold mb-6">{campaign.campaign_name}</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-6">
          <CardCampaign
            title="Nom de l'annonceur"
            icon={Store}
            value={campaign.advertiser_name}
          />

          <CardCampaign
            title="Période de diffusion"
            icon={Calendar}
            value={`${formattedDateStart} - ${formattedDateEnd}`}
            description={`${daysBetween} jours`}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
          <CardCampaign title="Impressions" icon={Eye} value="1,000,000" description="+20.1% vs dernière campagne" />
          <CardCampaign title="Clics" icon={MousePointerClick} value="50,000" description="+15.5% vs dernière campagne" />
          <CardCampaign title="Taux de clics" icon={Percent} value="5%" description="-3.8% vs dernière campagne" />
          <CardCampaign title="Taux de complétion" icon={Play} value="75%" description="+5.2% vs dernière campagne" />
          <CardCampaign title="Visiteurs uniques" icon={Users} value="200,000" description="+10.3% vs dernière campagne" />
          <CardCampaign title="Répétition" icon={Repeat} value="3.5" description="-2.8% vs dernière campagne" />
        </div>

        <div className="grid gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Sites web</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site / Appli</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Impressions</TableHead>
                    <TableHead>Clics</TableHead>
                    <TableHead>Taux de clics</TableHead>
                    <TableHead>Taux de complétion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Linfo.re</TableCell>
                    <TableCell>Masthead</TableCell>
                    <TableCell>200 000 imps.</TableCell>
                    <TableCell>2 000</TableCell>
                    <TableCell>1%</TableCell>
                    <TableCell>95.5%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Créatives</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Taille</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Bannière 1</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>300x250</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Vidéo Produit</TableCell>
                    <TableCell>Vidéo</TableCell>
                    <TableCell>15s</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

      </div>
    </>
  );
}
