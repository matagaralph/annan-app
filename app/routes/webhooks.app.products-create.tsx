import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { allowedStores } from "./stores";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic, payload, apiVersion, webhookId } =
    await authenticate.webhook(request);
  const { id } = payload;

  console.log(`Received product ${id} from ${shop}`);
  if (!allowedStores.includes(shop)) {
    console.error(`${shop} is not allowed to sync products`);
    return new Response("Store is not allowed to sync products", {
      status: 200,
    });
  }

  await db.product.create({
    data: {
      api_version: apiVersion,
      payload: JSON.stringify(payload),
      topic: topic,
      shop: shop,
      webhook_id: webhookId,
      product_id: id.toString(),
    },
  });
  console.log(`Product: ${id} webhook call was saved in db.`);
  return new Response();
};
