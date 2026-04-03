import { z } from "zod";
import { errorMessage } from "../constants/error.messages.js";

const CreateFolderSchema = z.object ({
    body: z.object({
        name: z.string({ error: errorMessage.INVALIDDATA.message })
    })
});

const UpdateFolderSchema = z.object({
    body: z.object({
        name: z.string({ error: errorMessage.INVALIDDATA.message })
    }),
    params: z.object({
        id: z.string({ error: errorMessage.INVALIDDATA.message })
    })
});

export { CreateFolderSchema, UpdateFolderSchema }