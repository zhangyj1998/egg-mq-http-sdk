"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageProperties = void 0;
const createMessageProperties = () => {
    const mqHttpSdk = require('@aliyunmq/mq-http-sdk');
    return new mqHttpSdk.MessageProperties();
};
exports.createMessageProperties = createMessageProperties;
//# sourceMappingURL=index.js.map