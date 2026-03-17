import type { SkillData } from "../dto/skills.dto.js";
import type { SkillRepository } from "../repository/skill.repository.js";
import { logger } from "../utils/logger.js";

class SkillService {
    constructor (private SkillMethods: SkillRepository) {}

    create = async (data: SkillData) => {
        const skill = await this.SkillMethods.create(data);

        logger.info("New skill created", {
            skillId: skill.id
        });

        return skill;
    }

    get = async (id: string) => {
        const skill = await this.SkillMethods.get(id);

        logger.info("Skill fetched", {
            skillId: skill.id
        });

        return skill;
    }

    update = async (data: SkillData, id: string) => {
        const skill = await this.SkillMethods.update(data,id);

        logger.info("Skill updated", {
            skillId: skill.id
        });

        return skill;
    }

    delete = async (id: string, flag: boolean) => {
        let skill;
        if(flag) {
            skill = await this.SkillMethods.hardDelete(id);
            logger.info("Skill hard deleted", {
                skillId: id
            });
        }else{
            skill = await this.SkillMethods.softDelete(id);
            logger.info("Skill soft deleted", {
                skillId: id
            });
        }

        return skill;
    }
}

export { SkillService };