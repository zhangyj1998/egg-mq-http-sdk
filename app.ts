import { MQClient } from '@aliyunmq/mq-http-sdk';
import { Application } from 'egg';
import { isArray } from 'util';
import { ConsumeMessageResponse } from '.';

export default (app: Application) => {

    const ctx = app.createAnonymousContext();

    const mqConf = app.config.mqHttpSdk;
    try {
        (app as any).mqClient = new MQClient(mqConf.endpoint, mqConf.accessKeyId, mqConf.accessKeySecret, mqConf.securityToken);
    } catch (error) {
        app.logger.error(`mq_start error`, error);
    }

    app.messenger.on('mq_consumer_receive', async ({ conf, res }) => {
        if (!isArray(res.body) || res.body.length === 0) {
            return;
        }
        const cb = (app as any).mqConsumerCallback;
        if (!cb) {
            return;
        }
        const fn = cb.get(res.body[0].MessageTag);
        if (!fn) {
            return;
        }
        ctx.runInBackground(async () => {
            const consumer = (app as any).mqClient.getConsumer(conf.instanceId, conf.topic, conf.groupId, res.body[0].MessageTag);
            for (const b of res.body) {
                await fn(ctx, consumer, b);
            }
        })
    });

    app.messenger.on('mq_trans_producer_receive', async ({ conf, res }) => {
        if (!isArray(res.body) || res.body.length === 0) {
            return;
        }
        const cb = (app as any).mqTransProducerCallback;
        if (!cb) {
            return;
        }
        const fn = cb.get(res.body[0].MessageTag);
        if (!fn) {
            return;
        }
        ctx.runInBackground(async () => {
            const transProducer = (app as any).mqClient.getTransProducer(conf.instanceId, conf.topic, conf.groupId);
            for (const b of res.body) {
                await fn(ctx, transProducer, b);
            }
        })
    });

};