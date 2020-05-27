'use strict';

const mock = require('egg-mock');

describe('test/mq-http-sdk.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/mq-http-sdk-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, mqHttpSdk')
      .expect(200);
  });
});
