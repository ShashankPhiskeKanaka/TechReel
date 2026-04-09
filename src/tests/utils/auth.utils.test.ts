import { describe, vi, beforeEach, it, expect } from "vitest";
import { AuthUtilsClass } from "../../utils/auth.utils.js";

const authUtils = new AuthUtilsClass();

describe("Auth Utility", () => {
    const mockId = "user_123";
    const mockRole = "USER";
    const plainPassword = "abcdefghijk";

    it("should hash and successfully compare the a password", async () => {
        const hash = await authUtils.hashPassword(plainPassword);
        expect(hash).not.toBe(plainPassword);

        const isMatch = await authUtils.comparePasswords(plainPassword, hash);
        expect(isMatch).toBe(true);
    });

    it("should generate a valid Access Token containing ID and Role", () => {
        const token = authUtils.generateAccessToken(mockId, mockRole);
        const decoded = authUtils.decodeAccesstoken(token);

        expect(decoded.id).toBe(mockId);
        expect(decoded.role).toBe(mockRole);
    })

    it("should throw a ServerError for an invalid or expired token", () => {
        const invalidToken = "ivalid_123_zca";
        expect(() => {
            authUtils.decodeAccesstoken(invalidToken);
        }).toThrow();
    })

    it("should generate and decode a Forget password token", () => {
        const token = authUtils.generateForgetToken(mockId);
        const decoded = authUtils.decodeForgetToken(token);

        expect(decoded.id).toBe(mockId);
        expect(decoded).not.toHaveProperty("role");
    });
});