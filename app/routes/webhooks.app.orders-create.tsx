import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { ZohoController } from "app/lib/zoho";
import { logger } from "app/lib/logger";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, topic, payload, apiVersion, webhookId } =
    await authenticate.webhook(request);

  const { order_number } = payload;
  console.log(`Order: ${order_number} was received.`);
  const recordedOrder = await db.order.create({
    data: {
      api_version: apiVersion,
      payload: JSON.stringify(payload),
      topic: topic,
      shop: shop,
      webhook_id: webhookId,
      order_number: order_number,
    },
  });

  try {
    //@ts-expect-error
    const zohoController = new ZohoController(payload);
    await zohoController.sendOrder(shop);

    db.order.update({
      where: {
        id: recordedOrder.id,
      },
      data: {
        status: true,
      },
    });
  } catch (error) {
    logger(error);
    return new Response("Failed to process webhook.", { status: 400 });
  }

  console.log(`Received ${topic} webhook for ${shop}`);

  return new Response();
};
