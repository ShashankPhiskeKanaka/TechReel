import dotenv from "dotenv"
import path from "path"

dotenv.config({
    path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`)
})

interface Config {
    port: number;
    databaseUrl: string;
    adminEmail: string;
    adminPassword: string;
    jwtSecret: string;
    redisUrl: string;
    googleWebClientId: string;
    googleWebClientSecret: string;
    githubClientId: string;
    githubClientSecret: string;
    ttlTiny: number;
    ttlShort: number;
    ttlMedium: number;
    ttlLong: number;
    awsUserSecretKey: string;
    awsUserAccessKey: string;
    awsBucketRegion: string;
    awsRawBucket: string;
    awsImageBucket: string;
    internalSecret: string;
}

const config: Config = {
    port: Number(process.env.PORT),
    databaseUrl: process.env.DATABASE_URL || "",
    adminEmail: process.env.ADMIN_EMAIL || "",
    adminPassword: process.env.ADMIN_PASSWORD || "",
    jwtSecret: process.env.JWTSECRET || "",
    redisUrl: process.env.REDIS_URL || "",
    googleWebClientId: process.env.GOOGLE_WEB_CLIENTID || "",
    googleWebClientSecret: process.env.GOOGLE_WEB_CLIENTSECRET || "",
    githubClientId: process.env.GITHUB_CLIENTID || "",
    githubClientSecret: process.env.GITHUB_CLIENTSECRET || "",
    ttlTiny: Number(process.env.CACHE_TTL_TINY) || 30,
    ttlShort: Number(process.env.CACHE_TTLE_SHORT) || 300,
    ttlMedium: Number(process.env.CACHE_TTL_MEDIUM) || 3600,
    ttlLong: Number(process.env.CACHE_TTLE_LONG) || 86400,
    awsUserSecretKey: process.env.AWS_USER_SECRETKEY || "",
    awsUserAccessKey: process.env.AWS_USER_ACCESSKEY || "",
    awsBucketRegion: process.env.AWS_BUCKET_REGION || "",
    awsRawBucket: process.env.AWS_RAW_BUCKET || "",
    awsImageBucket: process.env.AWS_IMAGE_BUCKET || "",
    internalSecret: process.env.INTERNAL_SECRET || ""
}
export { config };