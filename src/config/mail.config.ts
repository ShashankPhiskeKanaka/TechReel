import nodemailer from "nodemailer";
import { config } from "./index.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.mailAccount,
        pass: config.mailPassword
    }
});

export { transporter }