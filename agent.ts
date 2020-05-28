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

interface MqHttpSdkConfig {
    endpoint: string;
    accessKeyId: string;
    accessKeySecret: string;
    securityToken: string;
    producers: ProducerConfig[];
    consumers: ConsumerConfig[];
}

export default (agent: Agent & { mqClient: MQClient }) => {

    const ctx = agent.createAnonymousContext();

    const mqConf = agent.config.mqHttpSdk as MqHttpSdkConfig;
    try {
        agent.mqClient = new MQClient(mqConf.endpoint, mqConf.accessKeyId, mqConf.accessKeySecret, mqConf.securityToken);
    } catch (error) {
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
                        ...(mqConf.producers || []).map(p => ({ conf: p, instance: agent.mqClient.getTransProducer(p.instanceId, p.topic, p.groupId) })).map(p => consumeHalfMessage(agent, p)),
                        ...(mqConf.consumers || []).map(c => ({ conf: c, instance: agent.mqClient.getConsumer(c.instanceId, c.topic, c.groupId, c.messageTag) })).map(c => consumeMessage(agent, c)),
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
        agent.messenger.sendRandom('mq_receive', { conf: p.conf, res });
    } catch (error) {
        if (error.Code !== 'MessageNotExist') {
            agent.logger.error(`consumeHalfMessage error`, error);
        }
    }
}

// 消费者长轮询进行消息消费
async function consumeMessage(agent: Agent, c: { conf: ConsumerConfig, instance: MQConsumer }) {
    try {
        const res = await c.instance.consumeMessage(c.conf.numOfMessages || 3, c.conf.waitSeconds || 3);
        agent.messenger.sendRandom('mq_receive', { conf: c.conf, res });
    } catch (error) {
        if (error.Code !== 'MessageNotExist') {
            agent.logger.error(`consumeMessage error`, error);
        }
    }
}
