import { z } from "zod";
import { errorMessage } from "../src/constants/error.messages.js";

const CreateViewRecord = z.object({
    body: z.object({
        reelId: z.string({ error: errorMessage.INVALIDDATA.message }),
        completed: z.boolean({ error: errorMessage.INVALIDDATA.message }),
        watchedSeconds: z.number({ error: errorMessage.INVALIDDATA.message })
    })
});

const DeleteViewRecord = z.object({
    body: z.object({
        reelId: z.string({ error: errorMessage.INVALIDDATA.message }),
        viewId: z.string({ error: errorMessage.INVALIDDATA.message })
    })
})

export { CreateViewRecord, DeleteViewRecord }