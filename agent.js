"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mq_http_sdk_1 = require("@aliyunmq/mq-http-sdk");
exports.default = (agent) => {
    const ctx = agent.createAnonymousContext();
    const mqConf = agent.config.rocketmq;
    try {
        agent.mqClient = new mq_http_sdk_1.MQClient(mqConf.endpoint, mqConf.accessKeyId, mqConf.accessKeySecret, mqConf.securityToken);
    }
    catch (error) {
        agent.logger.error(`mq_start error`, error);
    }
    agent.messenger.on('egg-ready', async () => {
        if (!agent.mqClient) {
            return;
        }
        ctx.runInBackground(async () => {
            while (true) {
                try {
                    await Promise.all([
                        ...mqConf.producers.map(p => ({ conf: p, instance: agent.mqClient.getTransProducer(p.instanceId, p.topic, p.groupId) })).map(p => consumeHalfMessage(agent, p)),
                        ...mqConf.consumers.map(c => ({ conf: c, instance: agent.mqClient.getConsumer(c.instanceId, c.topic, c.groupId, c.messageTag) })).map(c => consumeMessage(agent, c)),
                    ]);
                }
                catch (error) {
                    agent.logger.error(`mq_polling error`, error);
                }
            }
        });
    });
};
// 检查未commit/rollback的半消息
async function consumeHalfMessage(agent, p) {
    try {
        const res = await p.instance.consumeHalfMessage(p.conf.numOfMessages || 3, p.conf.waitSeconds || 3);
        agent.messenger.sendRandom('mq_receive', { conf: p.conf, res });
    }
    catch (error) {
        if (error.Code !== 'MessageNotExist') {
            agent.logger.error(`consumeHalfMessage error`, error);
        }
    }
}
// 消费者长轮询进行消息消费
async function consumeMessage(agent, c) {
    try {
        const res = await c.instance.consumeMessage(c.conf.numOfMessages || 3, c.conf.waitSeconds || 3);
        agent.messenger.sendRandom('mq_receive', { conf: c.conf, res });
    }
    catch (error) {
        if (error.Code !== 'MessageNotExist') {
            agent.logger.error(`consumeMessage error`, error);
        }
    }
}
//# sourceMappingURL=agent.js.map