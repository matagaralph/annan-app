import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic, payload, apiVersion, webhookId } =
    await authenticate.webhook(request);

  console.log("Order created", payload);
  const { order_number } = payload;
  await db.order.create({
    data: {
      api_version: apiVersion,
      payload: JSON.stringify(payload),
      topic: topic,
      shop: shop,
      webhook_id: webhookId,
      order_number: order_number,
    },
  });
  console.log(`Received ${topic} webhook for ${shop}`);

  return new Response();
};
