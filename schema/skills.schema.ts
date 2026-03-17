import { z } from "zod";
import { errorMessage } from "../constants/error.messages.js";

const SkillsSchema = z.object({
    body: z.object({
        id: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        name: z.string({ error: errorMessage.INVALIDDATA.message }),
        category : z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        description : z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
    })
})

export { SkillsSchema };