"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqResCode = void 0;
const mq_http_sdk_1 = require("@aliyunmq/mq-http-sdk");
const egg_1 = require("egg");
const producer_1 = require("../entity/producer");
const consumer_1 = require("../entity/consumer");
// mq response 成功时的code
var MqResCode;
(function (MqResCode) {
    MqResCode[MqResCode["PublishMessage"] = 201] = "PublishMessage";
    MqResCode[MqResCode["Commit"] = 204] = "Commit";
    MqResCode[MqResCode["Rollback"] = 204] = "Rollback";
    MqResCode[MqResCode["ConsumeHalfMessage"] = 200] = "ConsumeHalfMessage";
    MqResCode[MqResCode["ConsumeMessage"] = 200] = "ConsumeMessage";
    MqResCode[MqResCode["AckMessage"] = 204] = "AckMessage";
})(MqResCode = exports.MqResCode || (exports.MqResCode = {}));
class RocketMQService extends egg_1.Service {
    constructor(ctx) {
        super(ctx);
        this.cbs = [];
        this.getClient();
    }
    getClient() {
        if (!this.client) {
            const { endpoint, accessKeyId, accessKeySecret } = this.config.rocketMQ;
            this.client = new mq_http_sdk_1.MQClient(endpoint, accessKeyId, accessKeySecret);
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
    getConsumer(messageTag) {
        const { instanceId, topic, groupId } = this.config.rocketMQ;
        return this.getClient().getConsumer(instanceId, topic, groupId, messageTag);
    }
    /**
     * 向主题发送一条消息
     * @param body  发送的内容
     * @param tag   发送消息的标签
     * @param msgProps 发送消息的属性
     */
    async publishMessage(body, messageKey, tag, trans) {
        const now = new Date();
        await producer_1.ProducerEntity.save({
            message_key: messageKey,
            status: trans ? false : true,
            createdAt: now,
            updatedAt: now
        });
        const producer = trans ? this.getTransProducer() : this.getProducer();
        const msgProps = new mq_http_sdk_1.MessageProperties();
        if (messageKey) {
            msgProps.messageKey(messageKey);
        }
        const res = await producer.publishMessage(body, tag, msgProps);
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
    async consumeHalfMessage(numOfMessages, waitSeconds) {
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
    async commit(messageKey, receiptHandle) {
        await producer_1.ProducerEntity.update({ message_key: messageKey }, { status: true, updatedAt: new Date() });
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
    async rollback(receiptHandle) {
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
    async consumeMessage(consumer, numOfMessages, waitSeconds) {
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
    async ackMessage(messageKey, receiptHandles) {
        const now = new Date();
        await consumer_1.ConsumerEntity.save({
            message_key: messageKey,
            status: true,
            createdAt: now,
            updatedAt: now
        });
        const consumer = this.getConsumer();
        const res = await consumer.ackMessage(receiptHandles);
        if (res.code !== MqResCode.AckMessage) {
            return;
        }
        return res.requestId;
    }
    // 注册回调函数
    cb(fn) {
        this.cbs.push(fn);
    }
    // 获取已注册的回调函数
    getCb() {
        return this.cbs;
    }
}
exports.default = RocketMQService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9ja2V0bXEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyb2NrZXRtcS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1REFBZ0Y7QUFDaEYsNkJBQXVDO0FBQ3ZDLGlEQUFvRDtBQUNwRCxpREFBb0Q7QUFFcEQsdUJBQXVCO0FBQ3ZCLElBQVksU0FPWDtBQVBELFdBQVksU0FBUztJQUNqQiwrREFBb0IsQ0FBQTtJQUNwQiwrQ0FBWSxDQUFBO0lBQ1osbURBQWMsQ0FBQTtJQUNkLHVFQUF3QixDQUFBO0lBQ3hCLCtEQUFvQixDQUFBO0lBQ3BCLHVEQUFnQixDQUFBO0FBQ3BCLENBQUMsRUFQVyxTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQU9wQjtBQUVELE1BQXFCLGVBQWdCLFNBQVEsYUFBTztJQUtoRCxZQUFZLEdBQVk7UUFDcEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBSFAsUUFBRyxHQUFVLEVBQUUsQ0FBQztRQUlwQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELFNBQVM7UUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNkLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ3hFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxzQkFBUSxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsZUFBZSxDQUFDLENBQUM7U0FDdEU7UUFDRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVELFdBQVc7UUFDUCxNQUFNLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ25ELE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDM0QsQ0FB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