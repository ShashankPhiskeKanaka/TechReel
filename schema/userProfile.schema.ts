import { z } from "zod";
import { errorMessage } from "../src/constants/error.messages.js";

const CreateUserProfileSchema = z.object({
    body: z.object({
        name: z.string({ error: errorMessage.INVALIDDATA.message }),
        bio: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        avatar_url: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        skills_summary: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        interests: z.array(
            z.string({ error: errorMessage.INVALIDDATA.message })
        ),
        imageType: z.string({ error: errorMessage.INVALIDDATA.message }).optional()
    })
})

const UpdateUserProfileData = z.object({
    body: z.object({
        name: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        bio: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        avatar_url: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        skills_summary: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        interests: z.array(
            z.string({ error: errorMessage.INVALIDDATA.message })
        ).optional(),
        imageType: z.string({ error: errorMessage.INVALIDDATA.message }).optional()
    })
});

export { CreateUserProfileSchema, UpdateUserProfileData }