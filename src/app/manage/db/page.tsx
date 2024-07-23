import { NextResponse } from "next/server";
import Image from "next/image";
import Link from "next/link";
import db from "../../config/db";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import mysql from 'mysql2/promise';

async function fetchData() {
      
    try {
      // create the connection to database
      const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        database: process.env.MYSQL_DATABASE,
        password: process.env.MYSQL_PASSWORD
      });

      // execute will internally call prepare and query
      const [results, fields] = await connection.execute(
        'SELECT * FROM `asb_campaigns` INNER JOIN `asb_advertisers` ON `asb_advertisers`.`advertiser_id` = `asb_campaigns`.`advertiser_id`;'
        // 'SELECT * FROM asb_campaigns WHERE `agency_id` = ?',
        // ['23121']
      );
      return results;
     // console.log(results); // results contains rows returned by server
     // console.log(fields); // fields contains extra meta data about results, if available
    } catch (err) {
      console.log(err);
    }

}

export default async function Page() {
  const data = await fetchData();
 
  return ( 
    <>    
     
     <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Crypt</TableHead>
            <TableHead className="text-right">Annonceur</TableHead>
            <TableHead>Agence</TableHead>
            <TableHead>Date de campagne</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {data.map(campaign => (
          <TableRow key={campaign.campaign_id}>
            <TableCell className="font-medium">{campaign.campaign_id}</TableCell>
            <TableCell><Link href={`/manage/campaigns/${campaign.campaign_id}`}>{campaign.campaign_name}</Link></TableCell>
            <TableCell>{campaign.campaign_crypt}</TableCell>
            <TableCell className="text-right"><Link href={`/manage/advertisers/${campaign.advertiser_id}`}>{campaign.advertiser_id} -- {campaign.advertiser_name}</Link></TableCell>
            <TableCell className="text-right">{campaign.agency_id}</TableCell>
            <TableCell className="text-right"></TableCell>
          </TableRow>
         ))}
        </TableBody>
      </Table>    </>
  );
}
