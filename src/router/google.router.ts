import express from "express";
import { AuthFactory, errorHandler } from "../../factory/auth.factory.js";
import passport from "passport";

const router = express.Router();

const controller = AuthFactory.create();

router.get("/", passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get("/callback", passport.authenticate('google', { session: false, failureRedirect: '/v1/auth/login' }), errorHandler.controllerWrapper(controller.SignIn));

export { router as GoogleRouter };