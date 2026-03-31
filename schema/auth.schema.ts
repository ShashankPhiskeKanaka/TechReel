import { z } from "zod";
import { errorMessage } from "../src/constants/error.messages.js";

const LoginSchema = z.object({
    body: z.object({
        username: z.string({ error: errorMessage.INVALIDDATA.message }),
        password: z.string({ error: errorMessage.INVALIDDATA.message })
            .min(8, "Password must have atleast 8 characters")
            .max(32, "Password is too long")
            .regex(/[A-Z]/, "Must contain atleast one uppercase letter")
            .regex(/[a-z]/, "Must contain atleast one lowercase letter")
            .regex(/[0-9]/, "Must contain atleast one number")
            .regex(/[/[ !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/, "Must contain atleast one special character")
    })
});

const LogoutSchema = z.object({
    params: z.object({
        flag: z.string({ error: errorMessage.INVALIDDATA.message })
    })
});

const ChangePasswordSchema = z.object({
    body: z.object({
        password: z.string({ error: errorMessage.INVALIDDATA.message })
    }),
    params: z.object({
        token: z.string({ error: errorMessage.INVALIDDATA.message })
    })
});

export { LoginSchema, LogoutSchema, ChangePasswordSchema };