"use client"

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { DataTableColumnHeader }  from "@/components/ui/column-header"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Campaigns = {
  id: string
  campaign_status_id : "0" | "1" | "2" | "3"
  campaign_name: string
  advertiser_name: string
}

export const columns: ColumnDef<Campaigns>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Tout sélectionner"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionner une ligne"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "campaign_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="#" />
    ),
  },
  {
    accessorKey: "advertiser_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Annonceur" />
    ),
  },
  {
    accessorKey: "campaign_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const campaign = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><Link href={`/r/${campaign.campaign_crypt}`}>Génerer un rapport</Link></DropdownMenuItem>
            <DropdownMenuItem>Supprimer le rapport</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(campaign.campaign_id)}
            >
              Copie la campagne ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(campaign.advertiser_id)}
            >
              Copie l annonceur ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Voir l annonceur</DropdownMenuItem>
            <DropdownMenuItem>Voir la campagne</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Voir la campagne sur SMARTADSERVER</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
