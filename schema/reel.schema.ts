import { z } from "zod";
import { errorMessage } from "../constants/error.messages.js";

const ReelSchema = z.object({
    body: z.object({
        title: z.string({ error: errorMessage.INVALIDDATA.message }),
        description: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        skill_id: z.string({ error: errorMessage.INVALIDDATA.message }),
        difficulty_level: z.string({ error: errorMessage.INVALIDDATA.message }),
        tags: z.object({ error: errorMessage.INVALIDDATA.message }).optional(),
        is_bonus: z.boolean({ error: errorMessage.INVALIDDATA.message })
    })
});

const UpdateReelSchema = z.object({
    body: z.object({
        title: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        description: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        difficulty_level: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        tags: z.object({ error: errorMessage.INVALIDDATA.message }).optional(),
        is_bonus: z.boolean({ error: errorMessage.INVALIDDATA.message }).optional()
    }),
    params: z.object({
        id: z.string({ error: errorMessage.INVALIDDATA.message })
    })
});

export { UpdateReelSchema, ReelSchema }