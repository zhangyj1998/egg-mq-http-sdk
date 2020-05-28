import { Application } from 'egg';

export default (app: Application) => {

    const ctx = app.createAnonymousContext();

    app.messenger.on('mq_start', (client) => {
        (app as any).mqClient = client;
    })

    app.messenger.on('mq_receive', async ({ conf, messages }) => {
        const { service, method } = conf;
        ctx.runInBackground(async () => {
            await ctx.service[service][method](messages);
        });
    });

};