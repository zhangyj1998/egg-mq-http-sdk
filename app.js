"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    const ctx = app.createAnonymousContext();
    app.messenger.on('mq_start', (client) => {
        app.mqClient = client;
    });
    app.messenger.on('mq_receive', async ({ conf, messages }) => {
        const { service, method } = conf;
        ctx.runInBackground(async () => {
            await ctx.service[service][method](messages);
        });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0JBQWUsQ0FBQyxHQUFnQixFQUFFLEVBQUU7SUFFaEMsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFFekMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7UUFDbkMsR0FBVyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7SUFDbkMsQ0FBQyxDQUFDLENBQUE7SUFFRixHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7UUFDeEQsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDakMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUMzQixNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUVQLENBQUMsQ0FBQyJ9