import { describe, vi, it, expect } from "vitest";
import { RedisUtilsClass } from "../../utils/redis.utils.js";
import type { Request } from "express";
import { RequestPayer } from "@aws-sdk/client-s3";

const redisUtils = new RedisUtilsClass();

describe("Redis Utility", () => {
    const mockUserId = "user_123";
    const mockUserRole = "USER";
    const mockResource = "SAMPLE";
    const mockAction = "SAMPLE";
    const mockDailyKey = "DAILY:LEADERBAORD";
    const mockMonthlyKey = "DAILY:LEADERBOARD";
    const mockAmount = 10;

    let mockRequest = {
        user : {
            id: mockUserId,
            role: mockUserRole
        },
        baseUrl: "/api/v1/resource",
        path: "/resource",
        query: {

        },
        method: "POST",
        body: {
            testing: true
        }
    } as unknown as Request;

    it("should generate a redis key", () => {
        const key = redisUtils.generateKey(mockRequest, "PUBLIC");
        expect(key).toBe('v1:cache:PUBLIC:RESOURCE:/resource:');
    });

    it("should generate payload hash", () => {
        const hash = redisUtils.generatePayloadHash(mockRequest);
        expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });
})