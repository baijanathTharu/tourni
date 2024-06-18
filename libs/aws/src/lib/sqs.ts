import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandOutput,
  DeleteMessageCommand,
  DeleteMessageCommandOutput,
  ReceiveMessageCommand,
  ReceiveMessageCommandOutput,
} from '@aws-sdk/client-sqs';

type TSendMessageInput = {
  QueueUrl: string;
  MessageBody: string;
};

type TDeleteMessageInput = {
  QueueUrl: string;
  ReceiptHandle: string;
};

type TReceiveMessageInput = {
  QueueUrl: string;
};

export class LCodeSQSClient {
  private client: SQSClient | null = null;

  constructor({
    accessKeyId,
    secretAccessKey,
    region,
  }: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  }) {
    this.client = new SQSClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  public getClient() {
    if (!this.client) {
      throw new Error('SQS client not found');
    }
    return this.client;
  }

  public async sendMessage(
    input: TSendMessageInput
  ): Promise<SendMessageCommandOutput> {
    const command = new SendMessageCommand(input);
    const response = await this.getClient().send(command);
    return response;
  }

  public async deleteMessage(
    input: TDeleteMessageInput
  ): Promise<DeleteMessageCommandOutput> {
    const command = new DeleteMessageCommand(input);
    const response = await this.getClient().send(command);
    return response;
  }

  public async receiveMessage(
    input: TReceiveMessageInput
  ): Promise<ReceiveMessageCommandOutput> {
    const command = new ReceiveMessageCommand({
      ...input,
      VisibilityTimeout: 30,
      MaxNumberOfMessages: 10,
    });
    const response = await this.getClient().send(command);
    return response;
  }
}
