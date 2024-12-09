/**
 * Shopify Types
 */

type Order = {
  email: string;
  order_number: string;
  taxes_included: boolean;
  order_status_url: string;
  customer: Customer;
  created_at: string;
  billing_address: Address | null;
  shipping_address: Address | null;
  total_shipping_price_set: PriceSet;
  total_price_set: PriceSet;
  total_discounts_set: PriceSet;
  line_items: LineItem[];
  shipping_lines: ShippingLine[];
  total_line_items_price_set: PriceSet;
};

type Address = {
  first_name: string;
  address1: string;
  phone: string | null;
  city: string;
  zip: string;
  country: string;
  last_name: string;
  address2: string | null;
  company: string | null;
  name: string;
  country_code: string;
};

type Customer = {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  tax_exempt: boolean;
  phone: string | null;
  tags: string;
  currency: string;
  default_address: Address | null;
};

type PriceSet = {
  shop_money: Price;
  amount_set: PriceSet;
  presentment_money: Price;
};

type Price = {
  amount: string;
  currency_code: string;
};

type LineItem = {
  name: string;
  sku: string;
  quantity: number;
  price_set: PriceSet;
  taxable: boolean;
  total_discount_set: PriceSet;
  tax_lines: TaxLine[];
  discount_allocations: PriceSet[];
};

type TaxLine = {
  price_set: PriceSet;
  rate: number;
  title: string;
};

type ShippingLine = {
  title: string;
  tax_lines: TaxLine[];
};

/**
 * Zoho Types
 */
type ZohoResponse<T = unknown, K extends string = string> = {
  code: number;
  message: string;
} & {
  [P in K]: T;
};

type Item = {
  item_id: string;
  sku: string;
  rate: number;
  quantity: number;
  discount: number;
  tax_id: number | null;
  tax_name: string;
  tax_percentage: number;
};

type Tax = {
  tax_id: number | null;
  tax_name: string;
  tax_percentage: number;
};

type Currency = {
  currency_id: string;
  currency_code: string;
};

type Contact = {
  contact_id: number;
  currency_code: string;
};
