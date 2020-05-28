# egg-mq-http-sdk

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-mq-http-sdk.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-mq-http-sdk
[travis-image]: https://img.shields.io/travis/eggjs/egg-mq-http-sdk.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-mq-http-sdk
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-mq-http-sdk.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-mq-http-sdk?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-mq-http-sdk.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-mq-http-sdk
[snyk-image]: https://snyk.io/test/npm/egg-mq-http-sdk/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-mq-http-sdk
[download-image]: https://img.shields.io/npm/dm/egg-mq-http-sdk.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-mq-http-sdk

<!--
Description here.
-->

## Install

```bash
$ npm i egg-mq-http-sdk --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.mqHttpSdk = {
  enable: true,
  package: 'egg-mq-http-sdk',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.mqHttpSdk = {
  endpoint: '',
  accessKeyId: '',
  accessKeySecret: '',
  securityToken?: '',
  producers?: [{
      instanceId: '',
      topic: '',
      groupId?: '',
      service?: 's1',
      method?: 'm1',
  }],
  consumers?: [{
      instanceId: '',
      topic: '',
      groupId?: '',
      messageTag?: '',
      service?: 's2',
      method?: 'm2',
  }],
  pollingInterval?: 3000, // 轮询间隔 ms 默认为0
};
```
## Example

```js
import { MQClient, createMessageProperties, ConsumeMessageResponse } from 'egg-mq-http-sdk';

const client: MQClient = (this.app as any).mqClient;

const producer = client.getProducer(instanceId, topic); 
const msgProps = createMessageProperties();
msgProps.messageKey(message_key);
await producer.publishMessage(body, tag, msgProps);

const transProducer = client.getTransProducer(instanceId, topic, groupId);

// 注册半消息回查 和 消费消息方法 注意一定要与config里配置的一致
service s1: // 对应上面配置里的生产者回查半消息的回调
  async m1(res: ConsumeMessageResponse){
    xxx
  }

service s2: // 对应上面配置里的消费者消费消息的回调
  async m2(res: ConsumeMessageResponse){
    xxx
  }

```

## Questions & Suggestions

Please open an issue [here](https://github.com/cuifan53/egg/issues).

## License

[MIT](LICENSE)
