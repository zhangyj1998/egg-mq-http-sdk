"use strict";

exports.default = (appInfo) => {

    const config = {};

    config.mqMsgPostgres = {
        host: '127.0.0.1',
        user: 'postgres',
        password: '123456',
        port: 5432,
        database: 'mq_message',
    };

    config.rocketMQ = {
        endpoint: 'http://1781976019325425.mqrest.cn-qingdao-public.aliyuncs.com',
        accessKeyId: 'LTAI4G9YShrc95sYnRroB4Je',
        accessKeySecret: 'F19vSOhqbU9LUOFZfM5yoHCvg8kJQ6',
        instanceId: 'MQ_INST_1781976019325425_BcaxlyA8',
        topic: 'topic_test',
        groupId: 'GID_icoastline_logsBusiness',
        messageTags: [],
    };

    return config;
};