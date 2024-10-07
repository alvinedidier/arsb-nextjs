'use client';
import { Suspense } from 'react';
import Image from "next/image";
import Link from "next/link";
import { notFound } from 'next/navigation';

import { useEffect, useState } from 'react';
import { DataTable, Campaign } from '../../../../components/DataTableCampaigns';

interface PageProps {
  params: {
      id: number;
  };
}

export default async function Page({ params }: PageProps) {
  // Vérifie que params.tool est défini
  if (!params.id) {
      notFound();
      return;
  }

  try {
      // Récupère les données
     /* const infoData = await getData(params.id);
      if (!infoData) {
          notFound();
          return;
      } else {
        //  const toolPostofCategory = await getPostsofCategoriesId(toolData.categories, params.tool);
      }

      return (
          <>

          </>
      );
*/

  } catch (error) {
      notFound();
      return;
  }
}
