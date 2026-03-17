import express from "express";
import type { Request, Response } from "express";
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
import { serverError } from "./utils/error.utils.js";
import { errorMessage } from "./constants/error.messages.js";
import { GoogleRouter } from "./router/google.router.js";
import { GithubRouter } from "./router/github.router.js";
import { TokenRouter } from "./router/token.router.js";
import { SkillRouter } from "./router/skill.router.js";
dotenv.config();

const app = express();

configurePassport();

const corsOptions = {
  // Allows any origin while still supporting credentials/cookies
  origin: "*",
  methods: 'GET,POST,PUT,PATCH,DELETE',
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(expressSession({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

connectPrisma();

const stream = {
    write : (message: string) => logger.info(message.trim())
}

app.use(morgan(`:method :url :response-time ms`, {stream}));

app.use("/v1/google/", GoogleRouter);
app.use("/v1/github/", GithubRouter )

app.use("/v1/user", UserRouter);
app.use("/v1/auth/", AuthRouter);
app.use("/v1/token", TokenRouter);
app.use("/v1/skill", SkillRouter);

app.use(authenticate);
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use(globalErrorHandler.handleError);

app.listen(process.env.PORT, () => {
    logger.info(`Server started on PORT : ${process.env.PORT}`);
});