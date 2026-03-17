import { errorMessage } from "../constants/error.messages.js";
import type { Token, TokenData } from "../dto/token.dto.js";
import type { TokenRepository } from "../repository/token.repository.js";
import { serverError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.js";

class TokenService {
    constructor (private TokenMethods : TokenRepository) {}

    create = async (data: TokenData) => {
        const token = await this.TokenMethods.create(data);

        logger.info("New token created", {
            tokenId: token.id
        });
        return token;
    }

    update = async (data: TokenData, id : string) => {
        const token = await this.TokenMethods.update(data, id);

        logger.info("Token updated", {
            tokenId: id
        });

        return token;
    }

    get = async (id: string) => {
        const token = await this.TokenMethods.get(id);

        if(!token.id) {
            logger.warn("Token fetch failed: No token found", {
                tokenId: id
            });

            throw new serverError(errorMessage.NOTFOUND);
        }

        logger.info("Token fetched", {
            tokenId: id
        });

        return token;
    }

    delete = async (id: string, flag: boolean) => {
        let token;
        if(flag) {
            token = await this.TokenMethods.hardDelete(id);
            logger.info("Token hard deleted", {
                tokenId: id
            });
        }else{
            token = await this.TokenMethods.softDelete(id);
            logger.info("Token soft deleted", {
                tokenId: id
            });
        }

        return token;
    }
}

export { TokenService }