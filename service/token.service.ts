import { errorMessage } from "../constants/error.messages.js";
import { ServiceMessages } from "../constants/service.messages.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import type { Token, TokenData } from "../dto/token.dto.js";
import type { TokenRepository } from "../repository/token.repository.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";
import { BaseService } from "./base.service.js";

const serviceMessage = new ServiceMessages("Token");

class TokenService extends BaseService<Token, TokenData, any> {
    constructor (methods : TokenRepository) {
        super(methods, "Token");
    }

    // create = async (data: TokenData) => {
    //     const token = await this.TokenMethods.create(data);

    //     logger.info(serviceMessage.CREATE.message, {
    //         tokenId: token.id
    //     });
    //     return token;
    // }

    // update = async (data: TokenData, id : string) => {
    //     const token = await this.TokenMethods.update(data, id);

    //     logger.info(serviceMessage.UPDATE.message, {
    //         tokenId: id
    //     });

    //     return token;
    // }

    // fetch = async (id: string) => {
    //     const token = await this.TokenMethods.fetch(id);

    //     if(!token.id) {
    //         logger.warn(serviceMessage.FETCH.error, {
    //             tokenId: id
    //         });

    //         throw new serverError(errorMessage.NOTFOUND);
    //     }

    //     logger.info(serviceMessage.FETCH.message, {
    //         tokenId: id
    //     });

    //     return token;
    // }

    // fetchAll = async (data: PaginationData, filters: {}) => {
    //     const tokens = await this.TokenMethods.fetchAll(data, filters);

    //     if(tokens.length == 0) {
    //         logger.warn(serviceMessage.FETCHALL.error);

    //         throw new serverError(errorMessage.NOTFOUND);
    //     }

    //     logger.info(serviceMessage.FETCHALL.message);

    //     return tokens;
    // }

    // delete = async (id: string, flag: boolean) => {
    //     let token;
    //     if(flag) {
    //         token = await this.TokenMethods.hardDelete(id);
    //         logger.info(serviceMessage.DELETE.hardDelete, {
    //             tokenId: id
    //         });
    //     }else{
    //         token = await this.TokenMethods.softDelete(id);
    //         logger.info(serviceMessage.DELETE.softDelete, {
    //             tokenId: id
    //         });
    //     }

    //     return token;
    // }

}

export { TokenService }