import { PrismaClient } from "../../generated/prisma/client.js";
import { beforeEach, vi } from "vitest";
import { mockDeep, mockReset, type DeepMockProxy } from "vitest-mock-extended";

const prismaMock = mockDeep<PrismaClient>();
beforeEach(() => {
    mockReset(prismaMock)
});

export { prismaMock }