import { z } from "zod"
import { errorMessage } from "../src/constants/error.messages.js"

const UpdateChallengeOptionData = z.object({
    body: z.object({
        isCorrect: z.boolean({ error: errorMessage.INVALIDDATA.message }),
        option: z.string({ error: errorMessage.INVALIDDATA.message })
    }),
    params: z.object({
        id: z.string({ error: errorMessage.INVALIDDATA.message })
    })
});

export { UpdateChallengeOptionData }