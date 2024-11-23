import { Module } from "@nestjs/common";
import { SqsModule } from "@ssut/nestjs-sqs";
import { config } from "../../../config";
import { MessageProducer } from "./producer.service";

@Module({
  imports: [
    SqsModule.register({
      consumers: [],
      producers: [
        {
          name: config.SQS_CANCEL_PAGARME_NAME,
          queueUrl: config.SQS_CANCEL_PAGARME_URL,
          region: config.AWS_REGION,
        },
      ],
    }),
  ],
  controllers: [],
  providers: [MessageProducer],
  exports: [MessageProducer],
})
export class ProducerModule {}
