import { z } from "zod";
import { errorMessage } from "../constants/error.messages.js";

const CreateReelSave = z.object({
    body: z.object({
        reelId: z.string({ error: errorMessage.INVALIDDATA.message }),
        folderId: z.string({ error: errorMessage.INVALIDDATA.message })
    })
});

export { CreateReelSave }