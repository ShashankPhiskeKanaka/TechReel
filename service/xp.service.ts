import type { XpData } from "../dto/xp.dto.js";
import type { XpRepository } from "../repository/xp.repository.js";

class XpService {
    constructor (private XpMethods: XpRepository) {}

    awardXp = async (data: XpData, client: any) => {
        const xp = await this.XpMethods.awardXp(data, client);

        return xp;
    }
}

export { XpService };