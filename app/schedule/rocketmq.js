"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9ja2V0bXEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyb2NrZXRtcS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFFYixRQUFRLEVBQUU7UUFDTixJQUFJLEVBQUUsUUFBUTtRQUNkLFNBQVMsRUFBRSxJQUFJO0tBQ2xCO0lBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFZO1FBQ25CLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3pDLE9BQU8sSUFBSSxFQUFFO1lBQ1QsSUFBSTtnQkFDQSxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDL0I7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDVixJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssaUJBQWlCLEVBQUU7b0JBQ2hDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDeEM7YUFDSjtTQUNKO0lBQ0wsQ0FBQztDQUVKLENBQUMifQ==