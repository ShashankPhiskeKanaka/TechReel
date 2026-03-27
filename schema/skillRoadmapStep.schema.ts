import { z } from "zod";
import { errorMessage } from "../constants/error.messages.js";

const CreateSkillRoadmapSteps = z.object({
    body: z.object({
        roadmapId : z.string({ error: errorMessage.INVALIDDATA.message }),
        reelId: z.string({ error: errorMessage.INVALIDDATA.message }),
        challengeId: z.string({ error: errorMessage.INVALIDDATA.message }),
        stepOrder: z.number({ error: errorMessage.INVALIDDATA.message }),
        title: z.string({ error: errorMessage.INVALIDDATA.message }),
        description: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
    })
});

const UpdateSkillRoadmapSteps = z.object({
    body: z.object({
        roadmapId: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        reelId: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        challengeId: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        stepOrder: z.number({ error: errorMessage.INVALIDDATA.message }).optional(),
        title: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        description: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
    }),
    params: z.object({
        id: z.string({ error: errorMessage.INVALIDDATA.message })
    })
});

export { CreateSkillRoadmapSteps, UpdateSkillRoadmapSteps }