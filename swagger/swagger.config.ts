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
                ...SkillRoadmapStepSchema
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
            ...skillRoadmapStepDocs
        }
    },
    apis: ['./routes/*.ts', './controller/*.ts'],
};

export const specs = swaggerJsdoc(options);