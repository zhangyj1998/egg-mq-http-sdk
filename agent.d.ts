import { MQClient } from '@aliyunmq/mq-http-sdk';
import { Agent } from 'egg';
declare const _default: (agent: Agent & {
    mqClient: MQClient;
}) => void;
export default _default;
