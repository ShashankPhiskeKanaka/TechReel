import { S3Client } from "@aws-sdk/client-s3"
import { config } from "../src/config/index.js";

const s3Client = new S3Client({
    region: config.awsBucketRegion,
    credentials: {
        accessKeyId: config.awsUserAccessKey,
        secretAccessKey: config.awsUserSecretKey
    }
});

export { s3Client }