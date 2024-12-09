import { allowedStores } from "app/routes/stores";
import { fetchAllData, formatDate, mapAddress, zohoApi } from "./helpers";
import { logger } from "./logger";

export class ZohoController {
  private order: Order;

  constructor(order: Order) {
    this.order = order;
  }

  async matchTax(taxLine: TaxLine): Promise<Tax> {
    const taxes = (
      await zohoApi.get<ZohoResponse<Tax[], "taxes">>("/settings/taxes")
    ).data.taxes;

    const taxPercentage = taxLine.rate * 100;

    const matchingTax = taxes.find(
      (tax) => tax.tax_percentage.toFixed(2) === taxPercentage.toFixed(2),
    );
    if (matchingTax) return matchingTax;
    return {
      tax_id: null,
      tax_name: taxLine.title,
      tax_percentage: taxPercentage,
    };
  }

  private async mapOrderItems(lineItems: LineItem[]): Promise<Item[]> {
    const zohoItems = await fetchAllData<Item>("/items", "items");
    const positions: Item[] = [];
    for (const lineItem of lineItems) {
      for (const zohoItem of zohoItems) {
        if (lineItem.sku === zohoItem.sku) {
          if (lineItem.tax_lines.length > 0) {
            const itemPrice = parseFloat(
              lineItem.price_set.presentment_money.amount,
            );
            const discountAmount = parseFloat(
              lineItem.discount_allocations[0].amount_set.presentment_money
                .amount,
            );
            const matchingTax = await this.matchTax(lineItem.tax_lines[0]);
            positions.push({
              sku: zohoItem.sku,
              quantity: lineItem.quantity,
              item_id: zohoItem.item_id,
              rate: itemPrice,
              discount: discountAmount,
              tax_id: matchingTax.tax_id,
              tax_name: matchingTax.tax_name,
              tax_percentage: matchingTax.tax_percentage,
            });
          }
        }
      }
    }

    return positions;
  }

  private async findCurrency(currencyCode: string): Promise<Currency> {
    const {
      data: { currencies },
    } = await zohoApi.get<ZohoResponse<Currency[], "currencies">>(
      "/settings/currencies",
    );
    const currency = currencies.find(
      (currency) => currency.currency_code === currencyCode,
    );
    if (!currency)
      return {
        currency_code: "EUR",
        currency_id: "1718282828",
      };
    return currency;
  }

  private async createCustomer(customerName: string): Promise<Contact> {
    const { billing_address, shipping_address, customer } = this.order;
    const currency = await this.findCurrency(
      this.order.total_line_items_price_set.presentment_money.currency_code,
    );

    const {
      data: { contact },
    } = await zohoApi.post<ZohoResponse<Contact, "contact">>("/contacts", {
      currency_id: currency.currency_id,
      contact_name: customerName,
      //@ts-expect-error
      billing_address: mapAddress(billing_address || customer.default_address),
      shipping_address: mapAddress(shipping_address as Address),
      contact_persons: [
        {
          first_name: customer?.first_name || "",
          last_name: customer?.last_name || "",
          email: customer?.email || "",
          phone: customer?.phone || "",
        },
      ],
    });
    return contact;
  }

  async createProduct() {}

  async sendOrder(shop: string) {
    const {
      line_items,
      created_at,
      order_number,
      order_status_url,
      taxes_included,
    } = this.order;
    const customer = await this.findCustomer();
    const products = await this.mapOrderItems(line_items);

    let orderName = order_number;
    if (!allowedStores.includes(shop)) {
      orderName = "DR-0" + order_number;
    } else {
      orderName = "SO-0" + order_number;
    }

    const zohoOrder = {
      customer_id: customer.contact_id,
      salesorder_number: orderName,
      date: formatDate(created_at),
      reference_number: order_number,
      line_items: products,
      is_inclusive_tax: taxes_included,
      is_discount_before_tax: true,
      discount: 0,
      discount_type: "item_level",
      shipping_charge: parseFloat(
        this.order?.total_shipping_price_set?.presentment_money
          ?.amount as string,
      ),
      custom_fields: [
        {
          value: `${order_status_url}`,
          api_name: "cf_order_status_url",
        },
        {
          value: `https://${shop}`,
          api_name: "cf_store",
        },
      ],
    };

    const shippingTaxRate = this.order.shipping_lines[0]?.tax_lines[0];
    if (shippingTaxRate && zohoOrder.shipping_charge > 0) {
      const shippingTax = await this.matchTax(shippingTaxRate);
      //@ts-expect-error
      zohoOrder.shipping_charge_tax_id = shippingTax?.tax_id;
    }
    console.log(zohoOrder);

    const {
      data: { salesorder },
    } = await zohoApi.post<
      ZohoResponse<{ salesorder_id: string }, "salesorder">
    >("/salesorders", JSON.stringify(zohoOrder), {
      params: {
        ignore_auto_number_generation: true,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(`Salesorder: ${salesorder.salesorder_id} was generated.`);

    zohoApi
      .post(`/salesorders/${salesorder.salesorder_id}/status/confirmed`)
      .then(() => console.log("Sales order was confirmed"))
      .catch((err) => logger(err));
  }

  private async findCustomer(): Promise<Contact> {
    const { first_name, last_name, email } = this.order.customer;

    const customerName = first_name + " " + last_name;
    const {
      data: { contacts },
    } = await zohoApi.get<ZohoResponse<Contact[], "contacts">>("/contacts", {
      params: {
        email_contains: email,
        contact_name: customerName,
        address: this.order.billing_address?.country,
      },
    });
    if (contacts.length > 0) {
      console.log(
        `Matched customer: ${contacts[0].contact_id} Currency: ${contacts[0].currency_code}`,
      );
      return contacts[0];
    }
    const newCustomer = await this.createCustomer(customerName);
    return newCustomer;
  }
}
