import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, mockReset,type DeepMockProxy } from 'vitest-mock-extended';
import { UserService } from '../../service/user.service.js';
import { authUtils } from '../../factory/auth.factory.js';
import { redisUtils } from '../../utils/redis.utils.js';
import { logger } from '../../utils/logger.js';
import { AuthUtilsClass } from '../../utils/auth.utils.js';
import { s3Client } from '../../../db/s3.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

describe('UserService - CRUD', () => {
    let userService: UserService;
    let repoMock: any;

    vi.mock('../../../db/s3.js', () => ({
        s3Client: {
            send: vi.fn()
        }
    }));

    vi.mock('@aws-sdk/s3-request-presigner', () => ({
        getSignedUrl: vi.fn().mockResolvedValue('http://mock-url.com'),
    }));

    vi.mock('../../utils/auth.utils.js', () => {
        class MockAuthUtilsClass {
            hashPassword = vi.fn();
            generateForgetToken = vi.fn();
            decodeForgetToken = vi.fn()
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
        logger: { info: vi.fn(), warn: vi.fn() }
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

    describe('verifyEmail', () => {
        let userService: UserService;
        let repoMock: any;

        beforeEach(() => {
            repoMock = {
                create: vi.fn(),
                verified: vi.fn() // Ensure this is added to match the method name
            };
            userService = new UserService(repoMock);
            vi.clearAllMocks();
        });

        it('should decode the token and mark the user as verified', async () => {
            const mockToken = 'valid-token';
            const mockUserId = 'user-123';

            // Mock decoding to return the expected ID
            vi.mocked(authUtils.decodeForgetToken).mockReturnValue({ id: mockUserId });

            // Mock the repository call
            repoMock.verified.mockResolvedValue({ id: mockUserId, verified: true });

            await userService.verifyEmail(mockToken);

            // Verify the token was decoded correctly
            expect(authUtils.decodeForgetToken).toHaveBeenCalledWith(mockToken);

            // Verify the repository's verified method was called with the decoded ID
            expect(repoMock.verified).toHaveBeenCalledWith(mockUserId);

            // Verify logging
            expect(logger.info).toHaveBeenCalledWith(
                "Email verified successfully",
                { userId: mockUserId }
            );
        });

        it('should throw an error if the token is invalid or expired', async () => {
            vi.mocked(authUtils.decodeForgetToken).mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await expect(userService.verifyEmail('bad-token'))
                .rejects.toThrow('Invalid token');

            expect(repoMock.verified).not.toHaveBeenCalled();
        });
    });



    beforeEach(() => {
        repoMock = {
            fetch: vi.fn(),
            fetchAll: vi.fn(),
            update: vi.fn(),
            hardDelete: vi.fn(),
            softDelete: vi.fn()
        };
        userService = new UserService(repoMock);
        vi.clearAllMocks();
    });

    describe('fetch', () => {
        it('should return a PublicUser if found', async () => {
            const mockUser = { id: 'u1', username: 'test', password: 'secret' };
            repoMock.fetch.mockResolvedValue(mockUser);

            const result = await userService.fetch('u1');

            expect(result.id).toBe('u1');
            expect(result).not.toHaveProperty('password'); // Verifies PublicUser transformation
            expect(logger.info).toHaveBeenCalled();
        });

        it('should throw NOTFOUND if user id is missing', async () => {
            repoMock.fetch.mockResolvedValue({ id: null });

            await expect(userService.fetch('u1')).rejects.toThrow();
            expect(logger.warn).toHaveBeenCalled();
        });
    });

    describe('fetchAll', () => {
        it('should return an array of PublicUsers', async () => {
            const mockUsers = [{ id: 'u1' }, { id: 'u2' }];
            repoMock.fetchAll.mockResolvedValue(mockUsers);

            const result = await userService.fetchAll({} as any, {}, []);

            expect(result).toHaveLength(2);
            expect(result[0]?.id).toBe('u1');
        });

        it('should throw if no records are found', async () => {
            repoMock.fetchAll.mockResolvedValue([]);
            await expect(userService.fetchAll({} as any, {}, [])).rejects.toThrow();
        });
    });

    describe('delete', () => {
        it('should handle hard delete and clear S3 if imageRecord exists', async () => {
            const mockUser = { id: 'u1' };
            const mockImage = { key: 'avatars/u1.png' };
            repoMock.hardDelete.mockResolvedValue({ user: mockUser, imageRecord: mockImage });

            await userService.delete(true, 'u1');

            expect(repoMock.hardDelete).toHaveBeenCalledWith('u1');
            expect(s3Client.send).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));
            expect(redisUtils.invalidateKey).toHaveBeenCalled();
        });

        it('should handle soft delete and skip S3', async () => {
            const mockUser = { id: 'u1' };
            repoMock.softDelete.mockResolvedValue(mockUser);

            await userService.delete(false, 'u1');

            expect(repoMock.softDelete).toHaveBeenCalledWith('u1');
            expect(s3Client.send).not.toHaveBeenCalled();
            expect(redisUtils.invalidateKey).toHaveBeenCalled();
        });
    });
});