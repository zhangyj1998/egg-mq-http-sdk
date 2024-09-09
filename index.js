'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.transProduce = exports.consume = exports.createMessageProperties = void 0;
const createMessageProperties = () => {
  const mqHttpSdk = require('@aliyunmq/mq-http-sdk');
  return new mqHttpSdk.MessageProperties();
};
exports.createMessageProperties = createMessageProperties;
const consume = (app, tag, fn) => {
  if (!app.mqConsumerCallback) {
    app.mqConsumerCallback = new Map();
  }
  app.mqConsumerCallback.set(tag, fn);
};
exports.consume = consume;
const transProduce = (app, tag, fn) => {
  if (!app.mqTransProducerCallback) {
    app.mqTransProducerCallback = new Map();
  }
  app.mqTransProducerCallback.set(tag, fn);
};
exports.transProduce = transProduce;
// # sourceMappingURL=index.js.map
