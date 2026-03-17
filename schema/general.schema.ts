import { z } from "zod";
import { errorMessage } from "../constants/error.messages.js";

const GetData = z.object({
    params: z.object({
        id: z.string({  error: errorMessage.INVALIDDATA.message })
    })
})

const DeleteData = z.object({
    body: z.object({
        id: z.string({ error: errorMessage.INVALIDDATA.message })
    }),
    params: z.object({
        flag: z.string({ error: errorMessage.INVALIDDATA.message })
    })
});

export { GetData, DeleteData }