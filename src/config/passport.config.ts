import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import { prisma } from "../../db/prisma.js";
import { serverError } from "../utils/error.utils.js";
import { errorMessage } from "../constants/error.messages.js";
import { Role } from "../../generated/prisma/enums.js";
import { config } from "./index.js";

export const configurePassport = () => {
    passport.use(new GoogleStrategy({
        clientID: config.googleWebClientId,
        clientSecret: config.googleWebClientSecret,
        callbackURL: "/v1/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value;
            if (!email) throw new serverError(errorMessage.NOTFOUND);

            let user = await prisma.users.findUnique({
                where: { email }
            });

            if (!user) {
                user = await prisma.users.create({
                    data: {
                        email: email,
                        username: profile.displayName,
                        password: "",
                        authProvider: 'GOOGLE',
                        verified: true,
                        role: Role.USER
                    }
                });
            }

            return done(null, user);
        }
        catch (err: any) {
            throw new serverError({ status: err.status, message: err.message });
        }
    }));

    passport.use(new GithubStrategy({
        clientID: config.githubClientId,
        clientSecret: config.githubClientSecret,
        callbackURL: "/v1/github/callback",
        scope: ['user:email']
    }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
            const email = profile.emails?.[0]?.value;
            if (!email) throw new serverError(errorMessage.NOTFOUND);

            let user = await prisma.users.findUnique({
                where: { email }
            });

            if (!user) {
                user = await prisma.users.create({
                    data: {
                        email: email,
                        username: profile.displayName || profile.username,
                        password: "",
                        authProvider: 'GITHUB',
                        verified: true,
                        role: Role.USER
                    }
                });
            }

            return done(null, user);
        }
        catch (err: any) {
            throw new serverError({ status: err.status, message: err.message });
        }
    }));

    // 3. Serialization
    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await prisma.users.findUnique({ where: { id } });
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
}
