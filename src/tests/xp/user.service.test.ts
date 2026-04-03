import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, mockReset,type DeepMockProxy } from 'vitest-mock-extended';
import { UserService } from '../../service/user.service.js';
import { authUtils } from '../../factory/auth.factory.js';
import { redisUtils } from '../../utils/redis.utils.js';
import { logger } from '../../utils/logger.js';
import { AuthUtilsClass } from '../../utils/auth.utils.js';

vi.mock('../../utils/auth.utils.js', () => {
    class MockAuthUtilsClass {
        hashPassword = vi.fn();
        generateForgetToken = vi.fn();
    }

    return {
        AuthUtilsClass: MockAuthUtilsClass,
        authUtils: new MockAuthUtilsClass()
    };
});

vi.mock('../../utils/redis.utils.js', () => ({
    redisUtils: {
        invalidateKey: vi.fn()
    }
}));

vi.mock('../../utils/logger.js', () => ({
    logger: { info: vi.fn() }
}));

describe('UserService - create', () => {
    let userService: UserService;
    let repoMock: any;

    beforeEach(() => {
        repoMock = {
            create: vi.fn()
        };
        userService = new UserService(repoMock);

        vi.clearAllMocks();
    });

    it('should hash the password, create a user, and invalidate the redis cache', async () => {

        const inputData = {
            email: 'test@example.com',
            username: 'testuser',
            password: 'rawPassword123'
        };

        const mockHashedPassword = 'hashed_secure_string';
        const mockUserFromDb = {
            id: 'uuid-123',
            ...inputData,
            password: mockHashedPassword,
            role: 'USER',
            authProvider: 'LOCAL',
            createdAt: new Date(),
            deletedAt: null,
            verified: false,
            profile: {}
        };
        const mockToken = 'jwt-email-token';

        vi.mocked(authUtils.hashPassword).mockResolvedValue(mockHashedPassword);
        vi.mocked(authUtils.generateForgetToken).mockReturnValue(mockToken);
        repoMock.create.mockResolvedValue(mockUserFromDb);

        const result = await userService.create(inputData);

        expect(authUtils.hashPassword).toHaveBeenCalledWith('rawPassword123');

        expect(repoMock.create).toHaveBeenCalledWith({
            ...inputData,
            password: mockHashedPassword
        });

        expect(redisUtils.invalidateKey).toHaveBeenCalledWith('uuid-123', 'USER', 'CREATE');

        expect(result.user).not.toHaveProperty('password');
        expect(result.emailToken).toBe(mockToken);
        expect(result.user.id).toBe('uuid-123');
    });

    it('should throw an error if hashing fails', async () => {
        vi.mocked(authUtils.hashPassword).mockRejectedValue(new Error('Hash Error'));

        await expect(userService.create({} as any)).rejects.toThrow('Hash Error');
    });
});
