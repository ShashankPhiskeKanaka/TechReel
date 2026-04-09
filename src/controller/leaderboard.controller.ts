import type { Request, Response } from "express";
import { logger } from "../utils/logger.js";
import { client, subClient } from "../../caching/redis.client.js";
import { ApiResponse } from "../utils/api.utils.js";

class LeaderBoardController {
    fetchTopUsers = async (req: Request, res: Response) => {
        logger.http("Fetch top users request recieved", {
            ip: req.ip
        });

        const type = req.params.type;
        const now = new Date();
        let key = "";

        if (type === "daily") {
            key = `lb:daily:${now.toISOString().split("T")[0]}`;
        } else if (type === "monthly") {
            key = `lb:monthly:${now.getFullYear()}-${now.getMonth() + 1}`;
        }
        const topPlayers = await client.zrevrange(key, 0, 9, "WITHSCORES");

        const formatted = [];

        for(let i = 0; i < topPlayers.length; i+= 2){
            formatted.push({ value: topPlayers[i], score: topPlayers[i+1] });
        }

        return ApiResponse.success(res, "Top users fetched", formatted);
    }

    streamLeaderboard = async (req: Request, res: Response) => {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const today = new Date().toISOString().split("T")[0];
        const dailyKey = `lb:daily:${today}`;

        const initialData = await req.redis.zrevrange(dailyKey, 0, 9, "WITHSCORES");
        res.write(`data: ${JSON.stringify(initialData)}\n\n`);

        const onMessage = async (channel: string, message: string) => {
            if (channel === "xp:updates") {

                const updatedLB = await req.redis.zrevrange(dailyKey, 0, 9, "WITHSCORES");
                res.write(`data: ${JSON.stringify(updatedLB)}\n\n`);
            }
        };

        subClient.on("message", onMessage);

        req.on("close", () => {
            subClient.removeListener("message", onMessage);
            logger.info("Client disconnected from stream");
        });
    };

}

export { LeaderBoardController }