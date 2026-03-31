import express from "express";
import { AuthFactory, errorHandler } from "../../factory/auth.factory.js";
import passport from "passport";

const router = express.Router();

const controller = AuthFactory.create();
router.get("/", passport.authenticate('github', { scope: ['user:email'] }));
router.get("/callback", passport.authenticate('github', { session: false, failureRedirect: '/v1/auth/login' }), errorHandler.controllerWrapper(controller.SignIn));

export { router as GithubRouter };