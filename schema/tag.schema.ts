import { z } from "zod";
import { errorMessage } from "../src/constants/error.messages.js";

const TagSchema = z.object({
    body: z.object({
        name: z.string({ error: errorMessage.INVALIDDATA.message })
    })
});

export { TagSchema }