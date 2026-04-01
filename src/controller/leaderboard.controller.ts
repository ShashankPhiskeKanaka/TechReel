import type { Request, Response } from "express";
import { logger } from "../utils/logger.js";
import { client } from "../../caching/redis.client.js";
import { ApiResponse } from "../utils/api.utils.js";

class LeaderBoardController {
    fetchTopUsers = async (req: Request, res: Response) => {
        logger.http("Fetch top users request recieved", {
            ip: req.ip
        });

        const key = `lb:${req.params.type?.toString()}:...`;

        const topPlayers = await client.zrevrange(key, 0, 9, `WITHSCORES`);

        const formatted = [];

        for(let i = 0; i < topPlayers.length; i+= 2){
            formatted.push({ value: topPlayers[i], score: topPlayers[i+1] });
        }

        return ApiResponse.success(res, "Top users fetched", formatted);
    }
}

export { LeaderBoardController }