"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mq_http_sdk_1 = require("@aliyunmq/mq-http-sdk");
exports.default = (agent) => {
    const ctx = agent.createAnonymousContext();
    const mqConf = agent.config.rocketmq;
    try {
        agent.mqClient = new mq_http_sdk_1.MQClient(mqConf.endpoint, mqConf.accessKeyId, mqConf.accessKeySecret);
        agent.messenger.sendToApp('mq_start', agent.mqClient);
    }
    catch (error) {
        agent.logger.error(`mq_start error`, error);
    }
    agent.messenger.on('egg-ready', async () => {
        // 长轮询监听待消费消息和半消息
        ctx.runInBackground(async () => {
            if (!agent.mqClient) {
                return;
            }
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
        if (res.code !== 200) {
            agent.logger.error(`consumeHalfMessage error`, res);
            return;
        }
        agent.messenger.sendRandom('mq_receive', { conf: p.conf, messages: res.body });
    }
    catch (error) {
        agent.logger.error(`consumeHalfMessage error`, error);
    }
}
// 消费者长轮询进行消息消费
async function consumeMessage(agent, c) {
    try {
        const res = await c.instance.consumeMessage(c.conf.numOfMessages || 3, c.conf.waitSeconds || 3);
        if (res.code !== 200) {
            agent.logger.error(`consumeMessage error`, res);
            return;
        }
        agent.messenger.sendRandom('mq_receive', { conf: c.conf, messages: res.body });
    }
    catch (error) {
        agent.logger.error(`consumeMessage error`, error);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhZ2VudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVEQUE4RTtBQWlDOUUsa0JBQWUsQ0FBQyxLQUFxQyxFQUFFLEVBQUU7SUFFckQsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFDM0MsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUEwQixDQUFDO0lBQ3ZELElBQUk7UUFDQSxLQUFLLENBQUMsUUFBUSxHQUFHLElBQUksc0JBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzNGLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDekQ7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNaLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQy9DO0lBRUQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3ZDLGlCQUFpQjtRQUNqQixHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUNqQixPQUFPO2FBQ1Y7WUFDRCxPQUFPLElBQUksRUFBRTtnQkFDVCxJQUFJO29CQUNBLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQzt3QkFDZCxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLFVBQVUs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