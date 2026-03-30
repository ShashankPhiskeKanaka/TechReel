import { z } from "zod";
import { errorMessage } from "../constants/error.messages.js";

const GetData = z.object({
    params: z.union([
        z.object({ id: z.string({ error: errorMessage.INVALIDDATA.message }) }),
        z.object({ email: z.email({ error: errorMessage.INVALIDDATA.message }) })
    ])
});

const DeleteData = z.object({
    body: z.object({
        flag: z.boolean({ error: errorMessage.INVALIDDATA.message })
    }),
    params: z.object({
        id: z.string({ error: errorMessage.INVALIDDATA.message })
    })
});

export { GetData, DeleteData }