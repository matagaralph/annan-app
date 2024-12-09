import { type ActionFunction } from "@remix-run/node";

import db from "../db.server";

import { authenticate } from "../shopify.server";

export const action: ActionFunction = async ({ request }) => {
  const { topic, shop, session, payload, webhookId, apiVersion } =
    await authenticate.webhook(request);

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }
      break;
    case "CUSTOMERS_DATA_REQUEST":
      if (session) {
        return new Response(
          JSON.stringify({
            message: "Processed successfully",
          }),
          { status: 200 },
        );
      }
      break;
    case "CUSTOMERS_REDACT":
      if (session) {
        return new Response(
          JSON.stringify({
            message: "Processed successfully",
          }),
          { status: 200 },
        );
      }
      break;
    case "SHOP_REDACT":
      if (session) {
        return new Response(
          JSON.stringify({
            message: "Processed successfully",
          }),
          { status: 200 },
        );
      }
      break;
    case "ORDERS_CREATE":
      if (session) {
        console.log(payload);
        const { order_number } = payload;
        db.order.create({
          data: {
            api_version: apiVersion,
            payload: JSON.stringify(payload),
            topic: topic,
            shop: shop,
            webhook_id: webhookId,
            order_number: order_number,
          },
        });
        return new Response(
          JSON.stringify({
            message: "Processed successfully",
          }),
          { status: 200 },
        );
      }
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
