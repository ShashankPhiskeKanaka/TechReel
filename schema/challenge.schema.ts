import { z } from "zod";
import { errorMessage } from "../constants/error.messages.js";

const ChallengeData = z.object({
    body: z.object({
        reelId: z.string({ error: errorMessage.INVALIDDATA.message }),
        question: z.string({ error: errorMessage.INVALIDDATA.message }),
        language: z.string({ error: errorMessage.INVALIDDATA.message }),
        challengeType: z.string({ error: errorMessage.INVALIDDATA.message }),
        answer: z.string({ error: errorMessage.INVALIDDATA.message }),
        difficutlyLevel: z.string({ error: errorMessage.INVALIDDATA.message }),
        options: z.object({
            option: z.string({error: errorMessage.INVALIDDATA.message}),
            isCorrect: z.boolean({ error: errorMessage.INVALIDDATA.message })
        })
    })
});

const ChallengeUpdateData = z.object({
    body: z.object({
        question: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        language: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        answer: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        difficutlyLevel: z.string({ error: errorMessage.INVALIDDATA.message }).optional()
    }),
    params: z.object({
        id: z.string({ error: errorMessage.INVALIDDATA.message })
    })
});

const ChallengeOptionUpdateData = z.object({
    body: z.object({
        isCorrect: z.boolean({ error: errorMessage.INVALIDDATA.message }),
        option: z.string({ error: errorMessage.INVALIDDATA.message })
    }),
    params: z.object({
        id: z.string({ error: errorMessage.INVALIDDATA.message })
    })   
})

export { ChallengeData, ChallengeUpdateData, ChallengeOptionUpdateData }