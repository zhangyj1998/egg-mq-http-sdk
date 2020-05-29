import { MQClient } from '@aliyunmq/mq-http-sdk';
import { Application } from 'egg';
import { isArray } from 'util';

export default (app: Application) => {

    const ctx = app.createAnonymousContext();

    const mqConf = app.config.mqHttpSdk;
    try {
        (app as any).mqClient = new MQClient(mqConf.endpoint, mqConf.accessKeyId, mqConf.accessKeySecret, mqConf.securityToken);
    } catch (error) {
        app.logger.error(`mq_start error`, error);
    }

    app.messenger.on('mq_trans_producer_receive', async ({ conf, res }) => {
        if (!isArray(res.body) || res.body.length === 0) {
            return;
        }
        const cb = (app as any).mqTransProducerCallback;
        if (!cb) {
            return;
        }
        ctx.runInBackground(async () => {
            const transProducer = (app as any).mqClient.getTransProducer(conf.instanceId, conf.topic, conf.groupId);
            for (const b of res.body) {
                const fn = cb.get(b.MessageTag);
                if (!fn) {
                    continue;
                }
                await fn(ctx, transProducer, b);
            }
        })
    });

    app.messenger.on('mq_consumer_receive', async ({ conf, res }) => {
        if (!isArray(res.body) || res.body.length === 0) {
            return;
        }
        const cb = (app as any).mqConsumerCallback;
        if (!cb) {
            return;
        }
        ctx.runInBackground(async () => {
            for (const b of res.body) {
                const consumer = (app as any).mqClient.getConsumer(conf.instanceId, conf.topic, conf.groupId, b.MessageTag);
                const fn = cb.get(b.MessageTag);
                if (!fn) {
                    continue;
                }
                await fn(ctx, consumer, b);
            }
        })
    });

};