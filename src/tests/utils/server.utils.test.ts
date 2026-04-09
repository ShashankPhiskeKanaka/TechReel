import { describe, vi, it, expect } from "vitest";
import { serverUtils } from "../../utils/server.utils.js";

describe("Server Utils", () => {
    const mockValue = "gte:10";
    const mockData = {
        id: "image_123",
        name: "image",
        imageType: "image/jpeg"
    } 

    it("should parse the value and returned the key value pair", () => {
        const value = serverUtils.parseFilterValue(mockValue);
        expect(value).toStrictEqual({ gte: 10 })
    });

    it("should generate a signed s3 bucket url to upload image", async () => {
        const url = await serverUtils.generateSignedUrl(mockData);
        expect(url).toContain(mockData.id);
    });
});