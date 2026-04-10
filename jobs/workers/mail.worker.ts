import type { Job } from "bullmq";
import { Worker } from "bullmq";
import { redisConfig } from "../../src/config/redis.config.js";
import { logger } from "../../src/utils/logger.js";
import { ForgetPassMail, WelcomeMail } from "../../src/constants/mail.template.js";
import { config } from "../../src/config/index.js";
import { mailUtils } from "../../src/utils/mail.utils.js";

const mailWorker = new Worker("Mail", async (job: Job) => {
    const { data, type } = job.data;

    logger.info("Working on mail job", {
        type
    });  
    switch(type){
        case "WELCOME":
            let mail = WelcomeMail.replace("{{name}}", data.name).replace("{{verifyMail}}", `${config.exposedRoute}/v1/user/verify/${data.emailToken}`);
            await mailUtils.sendMail(data.email, "Welcome to TechReel!", mail);
            logger.info("Welcome mail sent", {
                email: data.email
            });
            return;
    
        case "FORGETPASS":
            let forgetMail = ForgetPassMail.replace("{{resetUrl}}", `${config.exposedRoute}/v1/auth/${data.forgetToken}`);
            await mailUtils.sendMail(data.email, "Reset TechReel Password!", forgetMail);
            logger.info("Forget password mail sent", {
                email: data.email
            });
            return;

        default:
            logger.warn("Invalid type");
            return;
    }

}, {
    connection: redisConfig,
    concurrency: 10
});
mailWorker.on("failed", (job: any, err) => {
    logger.warn(`Job ${job.id} failed: ${err.message}`);
});

export { mailWorker }