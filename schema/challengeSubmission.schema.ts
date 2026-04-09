import { z } from "zod";
import { errorMessage } from "../src/constants/error.messages.js";

const CreateChallengeSubmissionData = z.object({
    body: z.object({
        challengeId: z.string({ error: errorMessage.INVALIDDATA.message }),
        answer: z.string({ error: errorMessage.INVALIDDATA.message }),
        roadmapStepId: z.string({ error: errorMessage.INVALIDDATA.message })
    })
});

export { CreateChallengeSubmissionData };