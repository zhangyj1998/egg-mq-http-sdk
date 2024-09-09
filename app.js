'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const mq_http_sdk_1 = require('@aliyunmq/mq-http-sdk');
const util_1 = require('util');
exports.default = app => {
  const ctx = app.createAnonymousContext();
  const mqConf = app.config.mqHttpSdk;
  try {
    app.mqClient = new mq_http_sdk_1.MQClient(mqConf.endpoint, mqConf.accessKeyId, mqConf.accessKeySecret, mqConf.securityToken);
  } catch (error) {
    app.logger.error('mq_start error', error);
  }
  app.messenger.on('mq_trans_producer_receive', async ({ conf, res }) => {
    if (!util_1.isArray(res.body) || res.body.length === 0) {
      return;
    }
    const cb = app.mqTransProducerCallback;
    if (!cb) {
      return;
    }
    ctx.runInBackground(async () => {
      const transProducer = app.mqClient.getTransProducer(conf.instanceId, conf.topic, conf.groupId);
      for (const b of res.body) {
        const fn = cb.get(b.MessageTag);
        if (!fn) {
          continue;
        }
        await fn(ctx, transProducer, b);
      }
    });
  });
  app.messenger.on('mq_consumer_receive', async ({ conf, res }) => {
    if (!util_1.isArray(res.body) || res.body.length === 0) {
      return;
    }
    const cb = app.mqConsumerCallback;
    if (!cb) {
      return;
    }
    ctx.runInBackground(async () => {
      for (const b of res.body) {
        const consumer = app.mqClient.getConsumer(conf.instanceId, conf.topic, conf.groupId, b.MessageTag);
        const fn = cb.get(b.MessageTag);
        if (!fn) {
          continue;
        }
        await fn(ctx, consumer, b);
      }
    });
  });
};
// # sourceMappingURL=app.js.map
