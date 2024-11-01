import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
} from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';
import { useTranslation, Trans } from 'react-i18next';

import { trophyImage } from '../assets';

import { ProductsCard, ProductsTable } from '../components';

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <ProductsTable />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
