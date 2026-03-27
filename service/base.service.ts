import { errorMessage } from "../constants/error.messages.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";
import { redisUtils } from "../utils/redis.utils.js";

abstract class BaseService<T, TData, TMethods> {
    constructor (protected methods: TMethods, protected modelName: string) {}

    tx(TxClient: any): this {
        const instance = Object.create(Object.getPrototypeOf(this))
        Object.assign(instance, this)
        // @ts-ignore
        instance.methods = this.methods.tx(TxClient);

        return instance;
    }

    create = async (data: TData): Promise<T> => {
        //@ts-ignore
        const record = await this.methods.create(data);
        logger.info(`${this.modelName} created`, {
            id: record.id,
        });

        return record;
    }

    fetch = async (id: string, userId?: string): Promise<T> => {
        //@ts-ignore

        const record = await this.methods.fetch(id, userId);
        if(!record || !record.id) {
            logger.warn(`No ${this.modelName} found`, {
                id
            });

            throw new serverError(errorMessage.NOTFOUND);
        }

        logger.info(`${this.modelName} fetched`, {
            id
        });

        return record;
    }

    fetchAll = async (data: PaginationData, filters: {}, searchFields: string[]) => {
        //@ts-ignore

        const records = await this.methods.fetchAll(data, filters, searchFields);

        if(records.length == 0) {
            logger.warn(`No ${this.modelName} records found`);

            throw new serverError(errorMessage.NOTFOUND);
        }

        const lastRecord = records[records.length - 1] as any;

        logger.warn(`${this.modelName} records fetched`);

        return { records, nextCursor: {
            lastId: lastRecord.id,
            lastCreatedAt: lastRecord.createdAt
        } };
    }

    update = async (data: any, id: string): Promise<T> => {
        //@ts-ignore

        const record = await this.methods.update(data, id);

        logger.info(`${this.modelName} record updated`, {
            id
        });

        redisUtils.invalidateKey(record.userId ? record.userId : "PUBLIC", this.modelName, "UPDATE");

        return record;
    }

    delete = async (id: string, flag: boolean): Promise<T> => {
        let record;
        if(flag) {
            //@ts-ignore
            record = await this.methods.hardDelete(id);
            logger.info(`${this.modelName} record hard deleted`, { id });        
        }else{
            //@ts-ignore
            record = await this.methods.softDelete(id);
            logger.info(`${this.modelName} record soft deleted`, {id})
        }

        redisUtils.invalidateKey(record.userId ? record.userId : "PUBLIC", this.modelName, "UPDATE");

        return record;
    }
}

export { BaseService };