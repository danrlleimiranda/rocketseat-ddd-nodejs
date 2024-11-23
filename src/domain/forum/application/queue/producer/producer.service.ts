import { Injectable } from "@nestjs/common";
import { SqsService } from "@ssut/nestjs-sqs";
import { v4 as uuid } from "uuid";
import { config } from "../../../config";
@Injectable()
export class MessageProducer {
  constructor(private readonly sqsService: SqsService) {}
  async sendMessage(body: string): Promise<void> {
    try {
      await this.sqsService.send(config.SQS_CANCEL_PAGARME_NAME, {
        id: uuid(),
        body,
      });
    } catch (error) {
      console.log("error in send message with customerId!", error);
    }
  }
}
