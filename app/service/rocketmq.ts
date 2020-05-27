import { MessageProperties, MQClient, MQConsumer } from '@aliyunmq/mq-http-sdk';
import { Context, Service } from 'egg';
import { ProducerEntity } from '../entity/producer';
import { ConsumerEntity } from '../entity/consumer';

// mq response 成功时的code
export enum MqResCode {
    PublishMessage = 201, // 发布消息
    Commit = 204, // 提交事务消息
    Rollback = 204, // 回滚事务消息
    ConsumeHalfMessage = 200, // 消费检查事务半消息
    ConsumeMessage = 200, // 消费消息
    AckMessage = 204, // 确认消息消费成功
}

export default class RocketMQService extends Service {

    private client: MQClient;
    private cbs: any[] = [];

    constructor(ctx: Context) {
        super(ctx);
        this.getClient();
    }

    getClient() {
        if (!this.client) {
            const { endpoint, accessKeyId, accessKeySecret } = this.config.rocketMQ;
            this.client = new MQClient(endpoint, accessKeyId, accessKeySecret);
        }
        return this.client;
    }

    getProducer() {
        const { instanceId, topic } = this.config.rocketMQ;
        return this.getClient().getProducer(instanceId, topic);
    }

    getTransProducer() {
        const { instanceId, topic, groupId } = this.config.rocketMQ;
        return this.getClient().getTransProducer(instanceId, topic, groupId);
    }

    getConsumer(messageTag?: string) {
        const { instanceId, topic, groupId } = this.config.rocketMQ;
        return this.getClient().getConsumer(instanceId, topic, groupId, messageTag);
    }

    /**
     * 向主题发送一条消息
     * @param body  发送的内容
     * @param tag   发送消息的标签
     * @param msgProps 发送消息的属性
     */
    async publishMessage(body: string, messageKey: string, tag: string, trans?: boolean) {
        const now = new Date();
        await ProducerEntity.save({
            message_key: messageKey,
            status: trans ? false : true,
            createdAt: now,
            updatedAt: now
        } as ProducerEntity);
        const producer = trans ? this.getTransProducer() : this.getProducer();
        const msgProps = new MessageProperties();
        if (messageKey) {
            msgProps.messageKey(messageKey);
        }
        const res = await producer.publishMessage(body, tag as string, msgProps);
        if (res.code !== MqResCode.PublishMessage) {
            return;
        }
        return res.body.ReceiptHandle;
    }

    /**
     * 消费检查事务半消息,默认如果该条消息没有被 {commit} 或者 {rollback} 在NextConsumeTime时会再次消费到该条消息
     * @param numOfMessages 每次从服务端消费条消息
     * @param waitSeconds 长轮询的等待时间（可空），如果服务端没有消息请求会在该时间之后返回等于请求阻塞在服务端，如果期间有消息立刻返回
     */
    async consumeHalfMessage(numOfMessages: number, waitSeconds?: number) {
        const producer = this.getTransProducer();
        const res = await producer.consumeHalfMessage(numOfMessages, waitSeconds);
        if (res.code !== MqResCode.ConsumeHalfMessage) {
            return [];
        }
        return res.body;
    }

    /**
     * 提交事务消息
     * @param receiptHandle consumeHalfMessage返回的单条消息句柄或者是发送事务消息返回的句柄
     */
    async commit(messageKey: string, receiptHandle: string) {
        await ProducerEntity.update({ message_key: messageKey }, { status: true, updatedAt: new Date() });
        const producer = this.getTransProducer();
        const res = await producer.commit(receiptHandle);
        if (res.code !== MqResCode.Commit) {
            return;
        }
        return res.requestId;
    }

    /**
     * 回滚事务消息
     * @param receiptHandle consumeHalfMessage返回的单条消息句柄或者是发送事务消息返回的句柄
     */
    async rollback(receiptHandle: string) {
        const producer = this.getTransProducer();
        const res = await producer.rollback(receiptHandle);
        if (res.code !== MqResCode.Rollback) {
            return;
        }
        return res.requestId;
    }

    /**
     * 消费消息,默认如果该条消息没有被 {ackMessage} 确认消费成功，即在NextConsumeTime时会再次消费到该条消息
     * @param numOfMessages 每次从服务端消费条消息
     * @param waitSeconds 长轮询的等待时间（可空），如果服务端没有消息请求会在该时间之后返回等于请求阻塞在服务端，如果期间有消息立刻返回
     */
    async consumeMessage(consumer: MQConsumer, numOfMessages: number, waitSeconds?: number) {
        const res = await consumer.consumeMessage(numOfMessages, waitSeconds);
        if (res.code !== MqResCode.ConsumeMessage) {
            return [];
        }
        return res.body;
    }

    /**
     * 确认消息消费成功，消费成功后需要调用该接口否则会重复消费消息
     * @param receiptHandles 消息句柄数组
     */
    async ackMessage(messageKey: string, receiptHandles: string[]) {
        const now = new Date();
        await ConsumerEntity.save({
            message_key: messageKey,
            status: true,
            createdAt: now,
            updatedAt: now
        } as ProducerEntity);
        const consumer = this.getConsumer();
        const res = await consumer.ackMessage(receiptHandles);
        if (res.code !== MqResCode.AckMessage) {
            return;
        }
        return res.requestId;
    }

    // 注册回调函数
    cb(fn: any) {
        this.cbs.push(fn);
    }

    // 获取已注册的回调函数
    getCb() {
        return this.cbs;
    }

}