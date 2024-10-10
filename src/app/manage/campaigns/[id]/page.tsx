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

import { useToast } from "@/components/ui/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

import CardCampaign from '@/components/ui/card-campaign';
import { formatDate, calculateDaysBetween, calculateDaysFromEndToToday } from '@/components/utils/date';
import { DataTable, Campaign } from '@/components/DataTableCampaigns';

// Importer le composant à afficher lorsque la campagne n'existe pas
import DbCampaign from "@/components/db/DbCampaign"; // Assurez-vous d'importer votre composant

interface PageProps {
  params: {
    id: number;
  };
}

const dailyData = [
  { date: "2023-06-01", impressions: 50000, clicks: 2500, ctr: 5 },
  { date: "2023-06-02", impressions: 55000, clicks: 2750, ctr: 5 },
  { date: "2023-06-03", impressions: 60000, clicks: 3000, ctr: 5 },
  { date: "2023-06-04", impressions: 65000, clicks: 3250, ctr: 5 },
  { date: "2023-06-05", impressions: 70000, clicks: 3500, ctr: 5 },
  { date: "2023-06-06", impressions: 75000, clicks: 3750, ctr: 5 },
  { date: "2023-06-07", impressions: 80000, clicks: 4000, ctr: 5 },
]

const deviceData = [
  { device: "Desktop", impressions: 500000, clicks: 25000 },
  { device: "Mobile", impressions: 400000, clicks: 20000 },
  { device: "Tablet", impressions: 100000, clicks: 5000 },
]

export default function Page({ params }: PageProps) {
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Ajoutez un état pour gérer l'ouverture de l'AlertDialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const fetchCampaign = async () => {
      
      if (!params.id || isNaN(Number(params.id))) {
        setError("L'identifiant de la campagne est invalide.");
        setLoading(false);
        return;
      }

       try {
        const queryParams = new URLSearchParams({
          campaign_id: params.id.toString()
        }).toString();

        const response = await fetch(`/api/db/campaigns?${queryParams}`, { next: { revalidate: 3600 } });
      
        if (!response.ok) {
          setError(`Campagne non trouvée. - ${params.id}`);
        }

        const campaignData = await response.json(); 

        // Vérifiez si des campagnes ont été trouvées
        if (!campaignData.campaigns || !Array.isArray(campaignData.campaigns) || campaignData.campaigns.length === 0) {
          setError("Aucune campagne trouvée."); // Vous pouvez garder cette ligne si vous souhaitez gérer l'état d'erreur
         // return <NotFoundComponent />; // Retournez le composant NotFoundComponent
        }

        setCampaign(campaignData.campaigns[0]); // Assurez-vous de récupérer la première campagne
     } catch (error) {
        /*console.error('Erreur lors de la récupération de la campagne :', error);*/
        setError(`Une erreur s'est produite lors de la récupération de la campagne : ${error}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();

  }, [params.id]);

  const handleScreenshotUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setScreenshots(Array.from(event.target.files))
    }
  }

  if (loading) {
    return (
      <>
        <Skeleton className="h-70 w-full mb-4" />
      </>
    );
  }

  if (!campaign) {
    // Charge les données de la campagne si elle n'existe pas
    return <DbCampaign table="campaign" id={params.id}/>;
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

  // Utilisation des fonctions pour récupérer les dates
  const formattedDateStart = formatDate(campaign.campaign_start_date);
  const formattedDateEnd = formatDate(campaign.campaign_end_date);
  const daysBetween = calculateDaysBetween(campaign.campaign_start_date, campaign.campaign_end_date);
  const daysFromEndToToday = calculateDaysFromEndToToday(campaign.campaign_end_date);

  function handleDelete() {
    console.log('Function lol triggered');
    // Fermez le dialogue ici
    setIsDialogOpen(false);
    alert('lol')
    // Ajoutez votre logique de suppression ici
    toast({
      title: "Scheduled: Catch up ",
      description: "Friday, February 10, 2023 at 5:57 PM",
      action: (
        <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
      ),
    });
  }

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold mb-6">{campaign.campaign_name}</h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-slate-900 text-white">
                <Settings className="mr-2 h-4 w-4" /> Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                <span>Mettre à jour</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={`https://manage.smartadserver.com/n/campaign/${campaign.campaign_id}/insertion`} target="_blank" className="flex items-center">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>Aller sur SmartAdServer</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>
                <span>Rapport</span>
              </DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href={`/r/${campaign.campaign_crypt}`} className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Générer</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-black hover:text-white text-red-600 cursor-pointer"
                onClick={() => setIsDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Supprimer</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Déplacez l'AlertDialog en dehors du DropdownMenu */}
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer le rapport</AlertDialogTitle>
                <AlertDialogDescription>
                  Tu souhaites supprimer le rapport de campagne ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 text-white" onClick={() => handleDelete()}>Supprimer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          
          <CardCampaign
            title="Nom de l'annonceur"
            icon={Store}
            value={campaign.advertiser_name}
            link={`/manage/advertisers/${campaign.advertiser_id}`}
          />

          <CardCampaign
            title="Période de diffusion"
            icon={Calendar}
            value={`${formatDate(campaign.campaign_start_date)} - ${formatDate(campaign.campaign_end_date)}`}
            description={`${daysBetween} jours`}
          />
          <CardCampaign
            title="Budget"
            icon={DollarSign}
            value={campaign ? campaign.budget : 'Chargement...'}
            description="1,087 € / jour"
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

        <Tabs defaultValue="daily" className="mb-6">
          <TabsList>
            <TabsTrigger value="daily">Données quotidiennes</TabsTrigger>
            <TabsTrigger value="device">Par appareil</TabsTrigger>
          </TabsList>
          <TabsContent value="daily">
            <Card>
              <CardHeader>
                <CardTitle>Performance quotidienne</CardTitle>
                <CardDescription>Impressions et clics par jour</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    impressions: {
                      label: "Impressions",
                      color: "hsl(var(--chart-1))",
                    },
                    clicks: {
                      label: "Clics",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyData}>
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line yAxisId="left" type="monotone" dataKey="impressions" stroke="var(--color-impressions)" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="clicks" stroke="var(--color-clicks)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="device">
            <Card>
              <CardHeader>
                <CardTitle>Performance par appareil</CardTitle>
                <CardDescription>Impressions et clics par type d'appareil</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    impressions: {
                      label: "Impressions",
                      color: "hsl(var(--chart-1))",
                    },
                    clicks: {
                      label: "Clics",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deviceData}>
                      <XAxis dataKey="device" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar yAxisId="left" dataKey="impressions" fill="var(--color-impressions)" />
                      <Bar yAxisId="right" dataKey="clicks" fill="var(--color-clicks)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Insertions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Format</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Insertion 1</TableCell>
                    <TableCell>Display</TableCell>
                    <TableCell>300x250</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Insertion 2</TableCell>
                    <TableCell>Vidéo</TableCell>
                    <TableCell>Pre-roll</TableCell>
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

        <Card>
          <CardHeader>
            <CardTitle>Screenshots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Ajouter des screenshots</Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                multiple
                onChange={handleScreenshotUpload}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {screenshots.map((file, index) => (
                <div key={index} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">{file.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}