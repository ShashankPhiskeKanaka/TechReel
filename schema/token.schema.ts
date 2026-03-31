import { z } from "zod";
import { errorMessage } from "../src/constants/error.messages.js";

const TokenData = z.object({
    body: z.object({
        id: z.string({ error: errorMessage.INVALIDDATA.message }).optional(),
        name: z.string({ error: errorMessage.INVALIDDATA.message }),
        token_url: z.string({ error: errorMessage.INVALIDDATA.message }).optional()
    })
})

const GetToken = z.object({
    params: z.object({
        id: z.string({ error: errorMessage.INVALIDDATA.message })
    })
})

const DeleteToken = z.object({
    body: z.object({
        id: z.string({ error: errorMessage.INVALIDDATA.message })
    }),
    params: z.object({
        flag: z.string({ error: errorMessage.INVALIDDATA.message })
    })
});

export { TokenData, GetToken, DeleteToken }