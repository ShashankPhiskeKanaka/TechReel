import { z } from "zod";
import { errorMessage } from "../src/constants/error.messages.js";

const CreateBadge = z.object({
    body: z.object({
        skillId: z.string({ error: errorMessage.INVALIDDATA.message }),
        name: z.string({ error: errorMessage.INVALIDDATA.message }),
        description: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        iconUrl: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        xpReward: z.number({ error: errorMessage.INVALIDDATA.message })
    })
});

const UpdateBadge = z.object({
    body: z.object({
        skillId: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        name: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        description: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        iconUrl: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        xpReward: z.number({ error: errorMessage.INVALIDDATA.message }).optional()
    }),
    params: z.object({
        id: z.string({ error: errorMessage.INVALIDDATA.message })
    })
});

export { CreateBadge, UpdateBadge }