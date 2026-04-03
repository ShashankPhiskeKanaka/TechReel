import type { ReelSave, ReelSaveData } from "../dto/reelSave.dto.js";
import type { ReelSaveRepsitory } from "../repository/reelSave.repository.js";
import { BaseService } from "./base.service.js";

class ReelSaveService extends BaseService<ReelSave, ReelSaveData, any> {
    constructor(methods: ReelSaveRepsitory) {
        super(methods, "REEL-SAVE");
    }
}

export { ReelSaveService }