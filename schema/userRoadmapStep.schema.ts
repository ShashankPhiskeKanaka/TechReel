import { z } from "zod";
import { errorMessage } from "../src/constants/error.messages.js";

const UpdateUserRoadmapStepData = z.object({
    body: z.object({
        roadmapStepId: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        userId: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        stepOrder: z.number({ error: errorMessage.INVALIDDATA.message }).optional(),
        roadmapId: z.string({ error: errorMessage.INVALIDDATA.message }).optional()
    }),
    params: z.object({
        id: z.string({ error: errorMessage.INVALIDDATA.message })
    })
});

const CreateUserRoadmapStepData = z.object({
    body: z.object({
        roadmapStepId: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        userId: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        stepOrder: z.number({ error: errorMessage.INVALIDDATA.message }).optional(),
        roadmapId: z.string({ error: errorMessage.INVALIDDATA.message }).optional()
    }),
})

export { UpdateUserRoadmapStepData, CreateUserRoadmapStepData }