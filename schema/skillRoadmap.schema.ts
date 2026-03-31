import { z } from "zod";
import { errorMessage } from "../src/constants/error.messages.js";

const UpdateSkillRoadmap = z.object({
    params: z.object({
        id: z.string({ error: errorMessage.INVALIDDATA.message })
    }),
    body: z.object({
        skillId: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        difficultyLevel: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        title: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        description: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        tokenId: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
    })
});

const CreateSkillRoadmap = z.object({
    body: z.object({
        skillId: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        difficultyLevel: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        title: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        description: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        tokenId: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
    })
});

export { UpdateSkillRoadmap, CreateSkillRoadmap };