import { MQConsumer, MQTransProducer, MQClient } from '@aliyunmq/mq-http-sdk';
import { Agent } from 'egg';

interface ProducerConfig {
    instanceId: string;
    topic: string;
    groupId: string;
    messageTag: string;
    numOfMessages: number;
    waitSeconds: number;
    service: string;
    method: string;
}

interface ConsumerConfig {
    instanceId: string;
    topic: string;
    groupId: string;
    messageTag: string;
    numOfMessages: number;
    waitSeconds: number;
    service: string;
    method: string;
}

interface RocketmqConfig {
    endpoint: string;
    accessKeyId: string;
    accessKeySecret: string;
    producers: ProducerConfig[];
    consumers: ConsumerConfig[];
}

export default (agent: Agent & { mqClient: MQClient }) => {

    const ctx = agent.createAnonymousContext();
    const mqConf = agent.config.rocketmq as RocketmqConfig;
    try {
        agent.mqClient = new MQClient(mqConf.endpoint, mqConf.accessKeyId, mqConf.accessKeySecret);
        agent.messenger.sendToApp('mq_start', agent.mqClient);
    } catch (error) {
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
                    ])
                } catch (error) {
                    agent.logger.error(`mq_polling error`, error);
                }
            }
        })
    });
};

// 检查未commit/rollback的半消息
async function consumeHalfMessage(agent: Agent, p: { conf: ProducerConfig, instance: MQTransProducer }) {
    try {
        const res = await p.instance.consumeHalfMessage(p.conf.numOfMessages || 3, p.conf.waitSeconds || 3);
        if (res.code !== 200) {
            agent.logger.error(`consumeHalfMessage error`, res);
            return;
        }
        agent.messenger.sendRandom('mq_receive', { conf: p.conf, messages: res.body });
    } catch (error) {
        agent.logger.error(`consumeHalfMessage error`, error);
    }
}

// 消费者长轮询进行消息消费
async function consumeMessage(agent: Agent, c: { conf: ConsumerConfig, instance: MQConsumer }) {
    try {
        const res = await c.instance.consumeMessage(c.conf.numOfMessages || 3, c.conf.waitSeconds || 3);
        if (res.code !== 200) {
            agent.logger.error(`consumeMessage error`, res);
            return;
        }
        agent.messenger.sendRandom('mq_receive', { conf: c.conf, messages: res.body });
    } catch (error) {
        agent.logger.error(`consumeMessage error`, error);
    }
}
