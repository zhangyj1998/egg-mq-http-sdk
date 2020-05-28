import { MQClient } from '@aliyunmq/mq-http-sdk';
import { Application } from 'egg';

export default (app: Application) => {

    const ctx = app.createAnonymousContext();

    const mqConf = app.config.rocketmq;
    try {
        (app as any).mqClient = new MQClient(mqConf.endpoint, mqConf.accessKeyId, mqConf.accessKeySecret, mqConf.securityToken);
    } catch (error) {
        app.logger.error(`mq_start error`, error);
    }

    app.messenger.on('mq_receive', async ({ conf, res }) => {
        const { service, method } = conf;
        if (!service || !method) {
            return;
        }
        ctx.runInBackground(async () => {
            await ctx.service[service][method](res);
        });
    });

};