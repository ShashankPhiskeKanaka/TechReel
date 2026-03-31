
import { prisma } from "../../db/prisma.js";
import { PaginationConstants, type PaginationData } from "../dto/pagination.dto.js";
import { serverUtils } from "../utils/server.utils.js";


interface RepoConfig {
    primaryKey: string,
    statusField: string
}

export abstract class BaseRepository<T, TCreateData, TUpdateData> {

    constructor(
        protected model: any = prisma,
        protected modelName: string,
        config: { primaryKey?: string; statusField?: string } = {}
    ) {
        this.config = {
            primaryKey: "id",
            statusField: "",
            ...config
        }
    }

    protected config: { primaryKey: string; statusField: string };

    tx(txModel: any): this {
        const instance = Object.create(Object.getPrototypeOf(this));
        Object.assign(instance, this);
        instance.model = txModel;
        return instance;
    }

    create = async (data: TCreateData): Promise<T> => {
        return await this.model.create({ data });
    };

    fetch = async (id: string, userId?: string): Promise<T> => {

        const where: any = {
            [this.config.primaryKey]: id,
            ...(userId ? { userId } : {})
        };

        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }
        const record = await this.model.findFirst({
            where
        });
        return record ?? ({} as T);
    };

    fetchAll = async (data: PaginationData, filters: any, searchFields: string[] = []): Promise<T[]> => {

        let where: any = {
        };
        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }

        where = serverUtils.buildWhere(where, filters, data, searchFields);
        console.log(where);
        return await this.model.findMany({
            take: !data.limit ? PaginationConstants.limit : data.limit,
            where,
            orderBy: [
                { createdAt: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' },
                { id: (data.sort ?? PaginationConstants.sort) as 'asc' | 'desc' }
            ]
        });
    };

    update = async (data: TUpdateData, id: string): Promise<T> => {
        const where: any = {
            [this.config.primaryKey]: id
        };
        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }

        return await this.model.update({
            where,
            data
        });
    };

    softDelete = async (id: string): Promise<T> => {

        return await this.model.update({
            where: { id, deletedAt: null },
            data: { deletedAt: new Date() }
        });
    };

    hardDelete = async (id: string): Promise<T> => {
        return await this.model.delete({ where: { id } });
    };
}
