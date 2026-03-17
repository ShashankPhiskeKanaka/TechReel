import { z } from "zod";
import { errorMessage } from "../constants/error.messages.js";

const UserProfileSchema = z.object({
    body: z.object({
        name: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        bio: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        avatar_url: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        skills_summary: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        interests: z.object({ error: errorMessage.INVALIDDATA.message }).optional(),
    })
})

export { UserProfileSchema }