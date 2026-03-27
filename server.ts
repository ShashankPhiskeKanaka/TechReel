import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectPrisma } from "./db/prisma.js";
import { UserRouter } from "./router/user.router.js";
import { AuthRouter } from "./router/auth.router.js";
import { globalErrorHandler } from "./factory/auth.factory.js";
import { logger } from "./utils/logger.js";
import morgan from "morgan";
import { authenticate, AuthService } from "./middleware/authenticate.middleware.js";
import expressSession from "express-session"
import passport from "passport"
import { configurePassport } from "./config/passport.config.js";
import { GoogleRouter } from "./router/google.router.js";
import { GithubRouter } from "./router/github.router.js";
import { TokenRouter } from "./router/token.router.js";
import { SkillRouter } from "./router/skill.router.js";
import { TagRouter } from "./router/tag.router.js";
import { ReelRouter } from "./router/reel.router.js";
import { ChallengeRouter } from "./router/challenge.router.js";
import { ChallengeOptionRouter } from "./router/challengeOption.router.js";
import { ViewRouter } from "./router/view.router.js";
import { LikeRouter } from "./router/like.router.js";
import { BadgeRouter } from "./router/badge.router.js";
import { ChallengeSubmissionRouter } from "./router/challengeSubmission.router.js";
import { SkillRoadmapRouter } from "./router/skillRoadmap.router.js";
import { SkillRoadmapStepRouter } from "./router/skillRoadmapStep.router.js";
import { UserProfileRouter } from "./router/userProfile.router.js";
import { AdminRouter } from "./router/admin.router.js";
import { UserRoadmapStepRouter } from "./router/userRoadmapStep.router.js";

dotenv.config();

const app = express();

configurePassport();

const corsOptions = {
    origin: "*",
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(expressSession({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

connectPrisma();

const stream = {
    write: (message: string) => logger.info(message.trim())
}

app.use(morgan(`:method :url :response-time ms`, { stream }));

app.use("/v1/admin", AdminRouter);

app.use("/v1/google/", GoogleRouter);
app.use("/v1/github/", GithubRouter)

app.use("/v1/user", UserRouter);
app.use("/v1/user-profile", UserProfileRouter);

app.use("/v1/auth", AuthRouter);

app.use("/v1/token", TokenRouter);

app.use("/v1/skill", SkillRouter);

app.use("/v1/tag", TagRouter);

app.use("/v1/reel", ReelRouter);

app.use("/v1/challenge", ChallengeRouter);
app.use("/v1/challenge-option", ChallengeOptionRouter);
app.use("/v1/challenge-submission", ChallengeSubmissionRouter);

app.use("/v1/skill-roadmap", SkillRoadmapRouter);
app.use("/v1/skill-roadmap-step", SkillRoadmapStepRouter);
app.use("/v1/user-roadmap-step", UserRoadmapStepRouter);

app.use("/v1/view", ViewRouter);
app.use("/v1/like", LikeRouter);

app.use("/v1/badge", BadgeRouter);

app.use(authenticate);
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use(globalErrorHandler.handleError);

app.listen(process.env.PORT, () => {
    logger.info(`Server started on PORT : ${process.env.PORT}`);
});