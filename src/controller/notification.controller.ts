import type { Request, Response } from "express"
import { client, subClient } from "../../caching/redis.client.js";

class NotificationController {

    notification = async (req: Request, res: Response) => {
        const userId = req.user?.id;

        const subscriber = client.duplicate();

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();

        const channel = `notifications:${userId}`;

        await subscriber.subscribe(channel, (message) => {
            res.write(`data: ${message}\n\n`);
        });

        subscriber.on("message", (channel, message) => {
            res.write(`data: ${message}\n\n`);
        })

        const keepAlive = setInterval(() => {
            res.write(": keep-alive\n\n");
        }, 30000);

        req.on("close", async () => {
            clearInterval(keepAlive);
            await subscriber.quit();
            res.end();
        });
    }
}

export { NotificationController }