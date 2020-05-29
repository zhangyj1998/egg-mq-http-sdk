import { MQClient } from '@aliyunmq/mq-http-sdk';
import { Agent } from 'egg';
export interface ProducerConfig {
    instanceId: string;
    topic: string;
    groupId: string;
    numOfMessages: number;
    waitSeconds: number;
}
export interface ConsumerConfig {
    instanceId: string;
    topic: string;
    groupId: string;
    messageTags: string[];
    numOfMessages: number;
    waitSeconds: number;
}
export interface MqHttpSdkConfig {
    endpoint: string;
    accessKeyId: string;
    accessKeySecret: string;
    securityToken: string;
    producers: ProducerConfig[];
    consumers: ConsumerConfig[];
    pollingInterval: number;
}
declare const _default: (agent: Agent & {
    mqClient: MQClient;
}) => void;
export default _default;
