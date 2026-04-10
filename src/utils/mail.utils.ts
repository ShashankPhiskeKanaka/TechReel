import { transporter } from "../config/mail.config.js";

class MailUtils {
    sendMail = async (to: string, subject: string, html: string) => {
        return await transporter.sendMail({
            from: '"Tech Reel" <noreply@techreel.com>',
            to,
            subject,
            html
        });
    }
}

const mailUtils = new MailUtils();

export { MailUtils, mailUtils }