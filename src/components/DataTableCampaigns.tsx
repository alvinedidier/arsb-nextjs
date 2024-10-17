"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Eye, MousePointerClick, Percent, Play, Repeat, Users, Calendar, DollarSign, Store, Settings, Edit, ExternalLink, FileText, Trash2, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { formatDate } from '@/utils/date';

export interface Campaign {
  campaign_id: number;
  campaign_name: string;
  campaign_crypt: string;
  advertiser_id: number;
  advertiser_name: string;
  agency_id: number;
  campaign_start_date: string;
  campaign_end_date: string;
  campaign_status_id: number;
  campaign_archived: number;
  created_at: string;
  updated_at: string;
}

// Composant qui gère l'affichage d'une ligne de campagne avec les dates formatées
const CampaignRow = ({ row }: { row: any }) => {
  const [startDate, setStartDate] = React.useState<string | null>(null);
  const [endDate, setEndDate] = React.useState<string | null>(null);

  // Utilisation de useEffect pour formater les dates après le rendu
  React.useEffect(() => {
    const formattedStartDate = formatDate(row.original.campaign_start_date);
    const formattedEndDate = formatDate(row.original.campaign_end_date);

    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
  }, [row.original.campaign_start_date, row.original.campaign_end_date]); // Met à jour si les dates changent

  return (
    <div className="text-blue-600">
      <Link href={`/manage/campaigns/${row.getValue("campaign_id")}`} title={`${row.getValue("campaign_name")}`}>
        <span className="hover:underline">{row.getValue("campaign_name")}</span>
        <div className="text-xs text-gray-500">
          {/* Affiche les dates formatées */}
          {startDate && endDate && (
            <>Du {startDate} au {endDate}</>
          )}
        </div>
      </Link>
    </div>
  );
};

// Colonnes pour la table de campagnes
export const columns: ColumnDef<Campaign>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Sélectionne tous"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionne la ligne"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "campaign_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="font-bold">#</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <Link href={`/manage/campaigns/${row.getValue("campaign_id")}`} title={`${row.getValue("campaign_name")}`} className="hover:underline">
          {row.getValue("campaign_id")}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "advertiser_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span className="font-bold">Annonceur</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const advertiserName = row.original.advertiser_name;
      const advertiserId = row.original.advertiser_id;

      return (
        <div>
          <Link href={`/manage/advertisers/${advertiserId}`} title={`${advertiserName}`} className="hover:underline">
            {advertiserName}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "campaign_name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <span className="font-bold">Nom</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      // Utilisation de CampaignRow pour afficher les détails de la campagne
      <CampaignRow row={row} />
    ),
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <span className="font-bold">Dernière MAJ</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>{formatDistanceToNow(new Date(row.getValue("updated_at")), { addSuffix: true })}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const campaign = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
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
              <Recycle className="mr-2 h-4 w-4" />
              <span>Supprimer</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        /* <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button variant="ghost" className="h-8 w-8 p-0">
               <span className="sr-only">Ouvrir le menu</span>
               <MoreHorizontal className="h-4 w-4" />
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="end">
             <DropdownMenuLabel>Actions</DropdownMenuLabel>
             <DropdownMenuItem
               onClick={() => navigator.clipboard.writeText(String(campaign.campaign_id))}
             >
               Copier l'ID de la campagne
             </DropdownMenuItem>
             <DropdownMenuSeparator />
             <DropdownMenuItem>Voir détails de la campagne</DropdownMenuItem>
           </DropdownMenuContent>
         </DropdownMenu>*/
      );
    },
  },
];

export function DataTable({ data }: { data: Campaign[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  /*
    // Ajout de useEffect pour surveiller les données
    React.useEffect(() => {
      console.log("Données du tableau mises à jour :", data);
    }, [data]);  // Se déclenche chaque fois que 'data' change.
  */

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      return (
        row.original.campaign_id.toString().includes(searchValue) ||
        row.original.campaign_name.toLowerCase().includes(searchValue) ||
        row.original.advertiser_name.toLowerCase().includes(searchValue)
      );
    },
    initialState: { pagination: { pageSize: 100 } },  // Pagination fixée à 100 éléments par page
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {/* Champ de recherche global */}
        <Input
          placeholder="Rechercher par ID, nom de campagne ou annonceur..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Colonnes
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel()?.rows && table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucune campagne.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}