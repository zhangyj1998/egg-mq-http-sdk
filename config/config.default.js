"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (appInfo) => {
    const config = {};
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
    };
    return config;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmRlZmF1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25maWcuZGVmYXVsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLGtCQUFlLENBQUMsT0FBbUIsRUFBRSxFQUFFO0lBQ25DLE1BQU0sTUFBTSxHQUFHLEVBQWdDLENBQUM7SUFFaEQsTUFBTSxDQUFDLGFBQWEsR0FBRztRQUNuQixJQUFJLEVBQUUsV0FBVztRQUNqQixRQUFRLEVBQUUsVUFBVTtRQUNwQixRQUFRLEVBQUUsUUFBUTtRQUNsQixJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxVQUFVO1FBQ2hCLFFBQVEsRUFBRSxZQUFZO1FBQ3RCLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLFFBQVEsRUFBRSxDQUFDLG9CQUFvQixDQUFDO0tBQ25DLENBQUM7SUFFRixNQUFNLENBQUMsUUFBUSxHQUFHO1FBQ2QsUUFBUSxFQUFFLCtEQUErRDtRQUN6RSxXQUFXLEVBQUUsMEJBQTBCO1FBQ3ZDLGVBQWUsRUFBRSxnQ0FBZ0M7UUFDakQsVUFBVSxFQUFFLG1DQUFtQztRQUMvQyxLQUFLLEVBQUUsWUFBWTtRQUNuQixPQUFPLEVBQUUsNkJBQTZCO1FBQ3RDLFdBQVcsRUFBRSxFQUFFO0tBQ2xCLENBQUE7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDLENBQUMifQ==