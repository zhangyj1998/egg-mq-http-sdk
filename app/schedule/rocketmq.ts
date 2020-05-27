import { Context } from 'egg';

module.exports = {

    schedule: {
        type: 'worker',
        immediate: true,
    },

    async task(ctx: Context) {
        const cbs = ctx.service.rocketmq.getCb();
        while (true) {
            try {
                await Promise.all([...cbs]);
            } catch (err) {
                if (err.Code !== 'MessageNotExist') {
                    ctx.logger.warn(JSON.stringify(err));
                }
            }
        }
    },

};