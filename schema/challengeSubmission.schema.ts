import {z} from "zod";
import { errorMessage } from "../constants/error.messages.js";

const CreateChallengeSubmissionData = z.object({
    body: z.object({
        challengeId: z.string({ error: errorMessage.INVALIDDATA.message }),
        answer: z.string({ error: errorMessage.INVALIDDATA.message }),
        isCorrect: z.boolean({ error: errorMessage.INVALIDDATA.message }),
        roadmapStepId: z.string({ error: errorMessage.INVALIDDATA.message })
    })
});

export { CreateChallengeSubmissionData };