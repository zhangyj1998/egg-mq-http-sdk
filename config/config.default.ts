import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    config.mqMsgPostgres = {
        host: '127.0.0.1',
        username: 'postgres',
        password: '123456',
        port: 5432,
        type: 'postgres',
        database: 'mq_message',
        schema: 'public',
        synchronize: true,
        entities: ['app/entity/**/*.ts'],
    };

    config.rocketMQ = {
        endpoint: 'http://1781976019325425.mqrest.cn-qingdao-public.aliyuncs.com',
        accessKeyId: 'LTAI4G9YShrc95sYnRroB4Je',
        accessKeySecret: 'F19vSOhqbU9LUOFZfM5yoHCvg8kJQ6',
        instanceId: 'MQ_INST_1781976019325425_BcaxlyA8',
        topic: 'topic_test',
        groupId: 'GID_icoastline_logsBusiness',
        messageTags: [],
    }

    return config;
};