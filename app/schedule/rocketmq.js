"use strict";

module.exports = {

    schedule: {
        type: 'worker',
        immediate: true,
    },

    async task(ctx) {
        const cbs = ctx.service.rocketmq.getCb();
        while (true) {
            try {
                await Promise.all([...cbs]);
            }
            catch (err) {
                if (err.Code !== 'MessageNotExist') {
                    ctx.logger.warn(JSON.stringify(err));
                }
            }
        }
    },

};