import { NextResponse } from "next/server";
import Image from "next/image";
import Link from "next/link";
import db from "../config/db";
import mysql from 'mysql2/promise';

import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";

async function fetchData(): Promise<Payment[]>  {
      
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
     // console.log(results); // results contains rows returned by server
     return results;
      // console.log(fields); // fields contains extra meta data about results, if available
    } catch (err) {
      console.log(err);
    }

}

export default async function DemoPage() {
  const data = await fetchData();
  console.log(data);
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
