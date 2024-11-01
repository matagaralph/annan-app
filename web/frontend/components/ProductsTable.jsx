import { useState } from 'react';
import { Page, LegacyCard, DataTable } from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import axios from 'axios';

export function ProductsTable() {
  const shopify = useAppBridge();
  const { t } = useTranslation();

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products/count');
      return await response.json();
    },
    refetchOnWindowFocus: false,
  });

  const rows = [
    [
      'Fellow Atmos Canister 1,2L Matte-Schwarz, Aeropress, Probierpaket Small',
      'B55_1168MB12',
      'Active',
      0,
      'Zubehör',
      102.0,
      'Coffee Annan',
    ],
    [
      'Fellow Stagg X Dripper Filterpapier (45 Stück)',
      'CH_1135',
      'Active',
      4,
      'Kaffeefilter',
      9.9,
      'Fellow',
    ],
  ];

  return (
    <Page
      title='Products'
      fullWidth
      subtitle='List of all products from Coffee Annan'
    >
      <LegacyCard>
        <DataTable
          columnContentTypes={[
            'text', // Product title
            'text', // Status (e.g., "Available" or "Unavailable")
            'numeric', // Inventory
            'text', // Category
            'text', // Type
            'numeric', // Price
            'text',
          ]}
          headings={[
            'Product',
            'SKU',
            'Status',
            'Inventory',
            'Type',
            'Price',
            'Vendor',
          ]}
          rows={rows}
        ></DataTable>
      </LegacyCard>
    </Page>
  );
}
