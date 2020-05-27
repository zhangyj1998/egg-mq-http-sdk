const mq_http_sdk = require("@aliyunmq/mq-http-sdk");
const { Service } = require("egg");
const pg = require('pg');

class RocketMQService extends Service {

    constructor(ctx) {
        super(ctx);
        this.cbs = [];
        this.pool = new pg.Pool(this.config.mqMsgPostgres);
        this.client = this.getClient();
    }

    getClient() {
        if (!this.client) {
            const { endpoint, accessKeyId, accessKeySecret } = this.config.rocketMQ;
            this.client = new mq_http_sdk.MQClient(endpoint, accessKeyId, accessKeySecret);
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

    async publishMessage(body, messageKey, tag, trans) {
        const now = new Date();
        await this.pool.query(`insert into producer (message_key, status, createdAt, updatedAt) values ('${messageKey}', ${trans ? false : true}, ${now}, ${now})`);
        const producer = trans ? this.getTransProducer() : this.getProducer();
        const msgProps = new mq_http_sdk.MessageProperties();
        if (messageKey) {
            msgProps.messageKey(messageKey);
        }
        const res = await producer.publishMessage(body, tag, msgProps);
        if (res.code !== MqResCode.PublishMessage) {
            return;
        }
        return res.body.ReceiptHandle;
    }

    async consumeHalfMessage(numOfMessages, waitSeconds) {
        const producer = this.getTransProducer();
        const res = await producer.consumeHalfMessage(numOfMessages, waitSeconds);
        if (res.code !== MqResCode.ConsumeHalfMessage) {
            return [];
        }
        return res.body;
    }

    async commit(messageKey, receiptHandle) {
        await this.pool.query(`update producer set status = ${true}, updatedAt = ${new Date()} where message_key = '${messageKey}'`);
        const producer = this.getTransProducer();
        const res = await producer.commit(receiptHandle);
        if (res.code !== MqResCode.Commit) {
            return;
        }
        return res.requestId;
    }

    async rollback(receiptHandle) {
        const producer = this.getTransProducer();
        const res = await producer.rollback(receiptHandle);
        if (res.code !== MqResCode.Rollback) {
            return;
        }
        return res.requestId;
    }

    async consumeMessage(consumer, numOfMessages, waitSeconds) {
        const res = await consumer.consumeMessage(numOfMessages, waitSeconds);
        if (res.code !== MqResCode.ConsumeMessage) {
            return [];
        }
        return res.body;
    }

    async ackMessage(messageKey, receiptHandles) {
        const now = new Date();
        await this.pool.query(`insert into consumer (message_key, status, createdAt, updatedAt) values ('${messageKey}', ${true}, ${now}, ${now})`);
        const consumer = this.getConsumer();
        const res = await consumer.ackMessage(receiptHandles);
        if (res.code !== MqResCode.AckMessage) {
            return;
        }
        return res.requestId;
    }

    cb(fn) {
        this.cbs.push(fn);
    }

    getCb() {
        return this.cbs;
    }
}
exports.default = RocketMQService;