import { NextResponse } from "next/server";
import Image from "next/image";
import Link from "next/link";
import db from "../config/db";
import mysql from 'mysql2/promise';

import { Campaign, columns } from "./columns"
import { DataTable } from "./data-table"

async function fetchData(): Promise<Campaign[]>  {      
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
     );

       // Ferme la connexion à la base de données
       await connection.end();

     return results;
    } catch (err) {
      console.log(err);
    }
}

export default async function Page() {
  const data = await fetchData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
