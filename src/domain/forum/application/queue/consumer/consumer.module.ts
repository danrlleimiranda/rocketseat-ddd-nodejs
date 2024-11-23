import { Module } from "@nestjs/common";
import { SqsModule } from "@ssut/nestjs-sqs";
import { config } from "../../../config";
import { MessageHandler } from "./message-handler";

@Module({
  imports: [
    SqsModule.register({
      consumers: [
        {
          name: config.SQS_CANCEL_PAGARME_NAME,
          queueUrl: config.SQS_CANCEL_PAGARME_URL,
          region: config.AWS_REGION,
        },
      ],
      producers: [],
    }),
  ],
  controllers: [],
  providers: [MessageHandler],
})
export class ConsumerModule {}
