import { errorMessage } from "../constants/error.messages.js";
import { ServiceMessages } from "../constants/service.messages.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import type { StreakData } from "../dto/streak.dto.js";
import type { StreakRepository } from "../repository/streak.repository.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";
import { redisUtils } from "../utils/redis.utils.js";
import { BaseService } from "./base.service.js";

const serviceMessage = new ServiceMessages("Streak");

class StreakService {
    constructor (private methods: StreakRepository) {}

    create = async (data: StreakData) => {
        const streak = await this.methods.create(data);

        logger.info(serviceMessage.CREATE.message, {
            streakId: streak.id
        });

        return streak;
    }

    update = async (userId: string) => {
        const streak = await this.methods.update(userId);

        logger.info(serviceMessage.UPDATE.message, {
            userId,
            streakId: streak.id
        });

        return streak;
    }

    fetch = async (id: string) => {
        const streak = await this.methods.fetch(id);

        if(!streak.id) {
            logger.warn(serviceMessage.FETCH.error, {
                streakId: id
            });

            throw new serverError(errorMessage.NOTFOUND);
        }

        logger.info(serviceMessage.FETCH.message);

        return streak;
    }

    fetchAll = async (data: PaginationData, filters: {}, searchFields: string[]) => {

        const records = await this.methods.fetchAll(data, filters, searchFields);

        if (records.length == 0) {
            logger.warn(serviceMessage.FETCHALL.error);

            throw new serverError(errorMessage.NOTFOUND);
        }

        const lastRecord = records[records.length - 1] as any;

        logger.warn(serviceMessage.FETCHALL.message);

        return {
            records, nextCursor: {
                lastId: lastRecord.id,
                lastActiveAt: lastRecord.lastActiveAt
            }
        };
    }

    delete = async (id: string, flag: boolean) => {
        let record;
        if (flag) {
            //@ts-ignore
            record = await this.methods.hardDelete(id);
            logger.info(serviceMessage.DELETE.hardDelete, {
                id
            });
        } else {
            //@ts-ignore
            record = await this.methods.softDelete(id);
            logger.info(serviceMessage.DELETE.softDelete, {
                id
            });
        }

        redisUtils.invalidateKey(record.userId ? record.userId : "PUBLIC", "Steak", "UPDATE");

        return record;
    }
}

export { StreakService }