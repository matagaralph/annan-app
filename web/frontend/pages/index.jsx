import { Layout, Page } from '@shopify/polaris';
import { useTranslation } from 'react-i18next';

import { ProductsCard } from '../components';

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <Page narrowWidth>
      <Layout>
        <Layout.Section>
          <ProductsCard />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
