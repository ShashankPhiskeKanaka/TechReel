import swaggerJsdoc from "swagger-jsdoc";
import { authPaths } from "./paths/auth.docs.js";
import { userPaths } from "./paths/user.docs.js";
import { responseSchemas } from "./schemas/responses.doc.js";
import { userProfileDocs } from "./paths/userProfile.docs.js";
import { UserProfileSchemas } from "./schemas/userProfile.schema.js";
import { tokenSchema } from "./schemas/token.schema.js";
import { tokenDocs } from "./paths/token.docs.js";
import { skillDocs } from "./paths/skill.docs.js";
import { SkillSchema } from "./schemas/skill.schema.js";
import { BadgeSchema } from "./schemas/badge.schema.js";
import { badgeDocs } from "./paths/badge.docs.js";
import { challengeDocs } from "./paths/challenge.docs.js";
import { ChallengeSchema } from "./schemas/challenge.schema.js";
import { SkillRoadmapSchema } from "./schemas/skillRoadmap.schema.js";
import { skillRoadmapDocs } from "./paths/skillRoadmap.docs.js";
import { skillRoadmapStepDocs } from "./paths/skillRoadmapStep.docs.js";
import { SkillRoadmapStepSchema } from "./schemas/skillRoadmapStep.schema.js";
import { ViewSchema } from "./schemas/view.schema.js";
import { viewDocs } from "./paths/view.docs.js";
import { likeDocs } from "./paths/like.docs.js";
import { LikeSchema } from "./schemas/like.schema.js";
import { StreakSchema } from "./schemas/streak.schema.js";
import { streakDocs } from "./paths/streak.docs.js";
import { challengeSubmissionDocs } from "./paths/challengeSubmission.docs.js";
import { ChallengeSubmissionSchema } from "./schemas/challengeSubmission.schema.js";
import { ChallengeOptionSchema } from "./schemas/challengeOption.schema.js";
import { challengeOptionDocs } from "./paths/challengeOption.docs.js";
import { feedDocs } from "./paths/feed.docs.js";
import { leaderboardDocs } from "./paths/leaderboard.docs.js";
import { xpDocs } from "./paths/xp.docs.js";
import { XpSchema } from "./schemas/xp.schema.js";
import { UserBadgeSchema } from "./schemas/userBadge.schema.js";
import { userBadgeDocs } from "./paths/userBadge.docs.js";
import { userRoadmapStepDocs } from "./paths/userRoadmapStep.docs.js";
import { UserRoadmapStepSchema } from "./schemas/userRoadmapStep.schema.js";
import { FolderSchema } from "./schemas/folder.schema.js";
import { folderDocs } from "./paths/folder.docs.js";
import { reelSaveDocs } from "./paths/reelSave.docs.js";
import { reelDocs } from "./paths/reel.docs.js";
import { ReelSchema } from "./schemas/reel.schema.js";
import { adminDocs } from "./paths/admin.docs.js";
import { UserSchema } from "../schema/user.schema.js";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tech Reel API',
            version: '1.0.0',
            description: 'API documentation for TechReel platform'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ],
        components: {
            schemas: {
                ...responseSchemas,
                ...UserProfileSchemas,
                ...tokenSchema,
                ...SkillSchema,
                ...BadgeSchema,
                ...ChallengeSchema,
                ...SkillRoadmapSchema,
                ...SkillRoadmapStepSchema,
                ...ViewSchema,
                ...LikeSchema,
                ...StreakSchema,
                ...ChallengeSubmissionSchema,
                ...ChallengeOptionSchema,
                ...XpSchema,
                ...UserBadgeSchema,
                ...UserRoadmapStepSchema,
                ...FolderSchema,
                ...ReelSchema,
                ...UserSchema
            },
            securitySchemas: {
                accessToken: {
                    type: 'http',
                    schema: 'bearer',
                    bearerFormat: 'JWT'
                },
                refreshToken: {
                    type: 'http',
                    schema: 'bearer',
                    bearerFormat: 'JWT'
                },
                idempotencyKey: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-idempotency-key',
                    description: 'Unique key to prevent duplicate processing'
                }
            }
        },
        paths: {
            ...authPaths,
            ...userPaths,
            ...userProfileDocs,
            ...tokenDocs,
            ...skillDocs,
            ...badgeDocs,
            ...challengeDocs,
            ...skillRoadmapDocs,
            ...skillRoadmapStepDocs,
            ...viewDocs,
            ...likeDocs,
            ...streakDocs,
            ...challengeSubmissionDocs,
            ...challengeOptionDocs,
            ...feedDocs,
            ...leaderboardDocs,
            ...xpDocs,
            ...userBadgeDocs,
            ...userRoadmapStepDocs,
            ...folderDocs,
            ...reelSaveDocs,
            ...reelDocs,
            ...adminDocs
        }
    },
    apis: ['./routes/*.ts', './controller/*.ts'],
};

export const specs = swaggerJsdoc(options);

export { options }