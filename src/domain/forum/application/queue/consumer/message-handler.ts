import { Message } from "@aws-sdk/client-sqs";
import { Injectable } from "@nestjs/common";
import { SqsMessageHandler } from "@ssut/nestjs-sqs";
import axios from "axios";
import { config } from "../../../config";
import { type ISubscriptionsList } from "../../payment/payment/interface/pagarme";

@Injectable()
export class MessageHandler {
  @SqsMessageHandler(config.SQS_CANCEL_PAGARME_NAME, false)
  async handleMessage(message: Message): Promise<void> {
    const customerId = message.Body;
    console.log(customerId);

    try {
      const pagarmeSubscriptions: ISubscriptionsList = await axios.get(
        `https://api.pagar.me/core/v5/subscriptions?customer_id=${customerId}&status=active`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.PAGARME_TOKEN}:`,
            ).toString("base64")}`,
            "Content-Type": "application/json",
          },
        },
      );
      const allCustomerSubscriptions = pagarmeSubscriptions.data.data;
      if (allCustomerSubscriptions.length > 1) {
        const subscriptionsToBeCanceled = [...allCustomerSubscriptions]
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .slice(1);

        for await (const subscription of subscriptionsToBeCanceled) {
          if (subscription.customer.id === customerId) {
            await axios.delete(
              `https://api.pagar.me/core/v5/subscriptions/${subscription.id}`,
              {
                headers: {
                  Authorization: `Basic ${Buffer.from(
                    `${process.env.PAGARME_TOKEN}:`,
                  ).toString("base64")}`,
                  "Content-Type": "application/json",
                },
                data: {
                  cancel_pending_invoices: true,
                },
              },
            );
          }
        }
        console.log("Old subscriptions cancelled successfully");
      } else {
        console.log("None old subscription to cancel");
      }
    } catch (error) {
      console.log(error.response.message);
    }
  }
}
