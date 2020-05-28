"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mq_http_sdk_1 = require("@aliyunmq/mq-http-sdk");
exports.default = (app) => {
    const ctx = app.createAnonymousContext();
    const mqConf = app.config.mqHttpSdk;
    try {
        app.mqClient = new mq_http_sdk_1.MQClient(mqConf.endpoint, mqConf.accessKeyId, mqConf.accessKeySecret, mqConf.securityToken);
    }
    catch (error) {
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
//# sourceMappingURL=app.js.map