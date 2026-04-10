import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectPrisma } from "./db/prisma.js";
import { UserRouter } from "./src/router/user.router.js";
import { AuthRouter } from "./src/router/auth.router.js";
import { globalErrorHandler } from "./factory/auth.factory.js";
import { logger } from "./src/utils/logger.js";
import morgan from "morgan";
import { authenticate, AuthService } from "./src/middleware/authenticate.middleware.js";
import expressSession from "express-session"
import passport from "passport"
import { configurePassport } from "./src/config/passport.config.js";
import { GoogleRouter } from "./src/router/google.router.js";
import { GithubRouter } from "./src/router/github.router.js";
import { TokenRouter } from "./src/router/token.router.js";
import { SkillRouter } from "./src/router/skill.router.js";
import { TagRouter } from "./src/router/tag.router.js";
import { ReelRouter } from "./src/router/reel.router.js";
import { ChallengeRouter } from "./src/router/challenge.router.js";
import { ChallengeOptionRouter } from "./src/router/challengeOption.router.js";
import { ViewRouter } from "./src/router/view.router.js";
import { LikeRouter } from "./src/router/like.router.js";
import { BadgeRouter } from "./src/router/badge.router.js";
import { ChallengeSubmissionRouter } from "./src/router/challengeSubmission.router.js";
import { SkillRoadmapRouter } from "./src/router/skillRoadmap.router.js";
import { SkillRoadmapStepRouter } from "./src/router/skillRoadmapStep.router.js";
import { UserProfileRouter } from "./src/router/userProfile.router.js";
import { AdminRouter } from "./src/router/admin.router.js";
import { UserRoadmapStepRouter } from "./src/router/userRoadmapStep.router.js";
import { idempotencyMiddleware } from "./src/middleware/idempotency.middleware.js";
import { FeedRouter } from "./src/router/feed.router.js";

import { interactionWorker } from "./jobs/workers/interaction.worker.js";
import { gamificationWorker } from "./jobs/workers/gamification.worker.js";
import { mailWorker } from "./jobs/workers/mail.worker.js";
import { notificationWorker } from "./jobs/workers/notification.worker.js";
import { StreakRouter } from "./src/router/streak.router.js";
import swaggerUi from "swagger-ui-express";
import { options, specs } from "./swagger/swagger.config.js";
import { rateLimiter } from "./src/middleware/rateLimiter.middleware.js";
import { Imagerouter } from "./src/router/image.router.js";

import swStats from "swagger-stats";
import { LeaderboardRouter } from "./src/router/leaderboard.router.js";
import { client } from "./caching/redis.client.js";
import { NotificationRouter } from "./src/router/notification.router.js";

dotenv.config();

const app = express();

app.set('trust proxy', true);

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
app.use(swStats.getMiddleware({
    swaggerSpec: specs,
    uriPath: "/v1/swagger-stats"
}))

app.use((req, res, next) => {
    req.redis = client;
    next();
})

app.use(rateLimiter);

app.use("/v1/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// app.use(idempotencyMiddleware);

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
app.use("/v1/streak", StreakRouter);

app.use("/v1/badge", BadgeRouter);

app.use("/v1/feed", FeedRouter);

app.use("/v1/images", Imagerouter);

app.use("/v1/leaderboard", LeaderboardRouter);

app.use("/v1/notification", NotificationRouter);

app.use(authenticate);
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use(globalErrorHandler.handleError);

app.listen(process.env.PORT, () => {
    logger.info(`Server started on PORT : ${process.env.PORT}`);
});