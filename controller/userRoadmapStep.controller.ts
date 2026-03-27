import type { UserRoadmapStepService } from "../service/userRoadmapStep.service.js";
import { BaseController } from "./base.controller.js";

class UserRoadmapStepController extends BaseController<UserRoadmapStepService> {

    constructor(service: UserRoadmapStepService) {
        super(service, "User roadmap step");
    }

}

export { UserRoadmapStepController }