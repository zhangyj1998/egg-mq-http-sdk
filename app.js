"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mq_http_sdk_1 = require("@aliyunmq/mq-http-sdk");
const util_1 = require("util");
exports.default = (app) => {
    const ctx = app.createAnonymousContext();
    const mqConf = app.config.mqHttpSdk;
    try {
        app.mqClient = new mq_http_sdk_1.MQClient(mqConf.endpoint, mqConf.accessKeyId, mqConf.accessKeySecret, mqConf.securityToken);
    }
    catch (error) {
        app.logger.error(`mq_start error`, error);
    }
    app.messenger.on('mq_consumer_receive', async (res) => {
        if (!util_1.isArray(res.body) || res.body.length === 0) {
            return;
        }
        const cb = app.mqConsumerCallback;
        if (!cb) {
            return;
        }
        const fn = cb.get(res.body[0].MessageTag);
        if (!fn) {
            return;
        }
        ctx.runInBackground(async () => {
            for (const b of res.body) {
                await fn(ctx, b);
            }
        });
    });
    app.messenger.on('mq_trans_producer_receive', async (res) => {
        if (!util_1.isArray(res.body) || res.body.length === 0) {
            return;
        }
        const cb = app.mqTransProducerCallback;
        if (!cb) {
            return;
        }
        const fn = cb.get(res.body[0].MessageTag);
        if (!fn) {
            return;
        }
        ctx.runInBackground(async () => {
            for (const b of res.body) {
                await fn(ctx, b);
            }
        });
    });
};
//# sourceMappingURL=app.js.map