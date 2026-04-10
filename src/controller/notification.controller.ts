import type { Request, Response } from "express"
import { client, subClient } from "../../caching/redis.client.js";

class NotificationController {

    /**
     * Establishes a Server-Sent Events (SSE) connection for real-time user notifications.
     * 
     * Subscribes to a unique Redis Pub/Sub channel based on the user's ID and streams 
     * messages to the client. Includes a keep-alive heartbeat and handles cleanup 
     * on connection close.
     * 
     * @param {Request} req - Express request object (expects req.user.id from auth middleware).
     * @param {Response} res - Express response object.
     * @returns {Promise<void>}
     */
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
        });

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