import { LegacyCard, EmptyState } from '@shopify/polaris';
import React from 'react';

export function ProductsCard() {
  return (
    <LegacyCard sectioned>
      <EmptyState
        heading='Manage your inventory transfers'
        action={{ content: 'Products CSV' }}
        secondaryAction={{
          content: 'Learn more',
          url: 'https://mailto:info@coffeeannan.com',
        }}
        image='https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png'
      >
        <p>Easily sync our products to your store.</p>
      </EmptyState>
    </LegacyCard>
  );
}
