import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import { prisma } from "../db/prisma.js";
import { serverError } from "../utils/error.utils.js";
import { errorMessage } from "../constants/error.messages.js";
import { Role } from "../generated/prisma/enums.js";

export const configurePassport = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_WEB_CLIENTID!,
        clientSecret: process.env.GOOGLE_WEB_CLIENTSECRET!,
        callbackURL: "/v1/google/callback"
    }, async (accessToken, refreshToken, profile, done ) => {
        try{
            const email = profile.emails?.[0]?.value;
            if(!email) throw new serverError(errorMessage.NOTFOUND);

            let user = await prisma.users.findUnique({
                where: { email }
            });

            if(!user) {
                user = await prisma.users.create({
                    data: {
                        email: email,
                        username: profile.displayName,
                        password: "",
                        auth_provider: 'GOOGLE',
                        verified: true,
                        role: Role.USER
                    }
                });
            }

            return done(null, user);
        }
        catch (err : any) {
            throw new serverError({ status: err.status, message: err.message });
        }
    }));

    passport.use(new GithubStrategy({
        clientID: process.env.GITHUB_CLIENTID!,
        clientSecret: process.env.GITHUB_CLIENTSECRET!,
        callbackURL: "/v1/github/callback",
        scope: ['user:email']
    }, async (accessToken: string, refreshToken:string, profile: any, done: any ) => {
        try{
            const email = profile.emails?.[0]?.value;
            if(!email) throw new serverError(errorMessage.NOTFOUND);

            let user = await prisma.users.findUnique({
                where: { email }
            });

            if(!user) {
                user = await prisma.users.create({
                    data: {
                        email: email,
                        username: profile.displayName || profile.username,
                        password: "",
                        auth_provider: 'GITHUB',
                        verified: true,
                        role: Role.USER
                    }
                });
            }

            return done(null, user);
        }
        catch (err : any) {
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
