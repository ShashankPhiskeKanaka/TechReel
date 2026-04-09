import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../../service/auth.service.js';
import { logger } from '../../utils/logger.js';
import { authUtils } from '../../factory/auth.factory.js';
import { serverError } from '../../utils/error.utils.js';
import crypto from 'crypto';

// Mock Dependencies
vi.mock('../../utils/logger.js', () => ({ logger: { info: vi.fn(), warn: vi.fn() } }));
vi.mock('../../factory/auth.factory.js', () => ({
    authUtils: {
        comparePasswords: vi.fn(),
        generateAccessToken: vi.fn(),
        generateForgetToken: vi.fn(),
        decodeForgetToken: vi.fn(),
        hashPassword: vi.fn()
    }
}));
vi.mock('crypto', () => ({
    default: { randomUUID: vi.fn(() => 'mock-uuid') }
}));

describe('AuthService', () => {
    let service: AuthService;
    let userRepoMock: any;
    let authRepoMock: any;
    const mockedAuthUtils = vi.mocked(authUtils);

    beforeEach(() => {
        userRepoMock = { fetchByUsername: vi.fn(), fetchByEmail: vi.fn(), update: vi.fn() };
        authRepoMock = { create: vi.fn(), generateNewToken: vi.fn(), deleteByUser: vi.fn(), deleteByFamily: vi.fn() };

        service = new AuthService(authRepoMock, userRepoMock);

        vi.clearAllMocks();
    });

    describe('login', () => {
        const mockUser = { id: 'u1', verified: true, password: 'hashed_password', role: 'USER' };

        it('should return tokens on valid credentials', async () => {
            userRepoMock.fetchByUsername.mockResolvedValue(mockUser);
            mockedAuthUtils.comparePasswords.mockResolvedValue(true);
            mockedAuthUtils.generateAccessToken.mockReturnValue('access_token');
            authRepoMock.create.mockResolvedValue({ id: 'refresh_token_id' });

            const result = await service.login('testuser', 'password123');

            expect(result).toEqual({ accessToken: 'access_token', refreshToken: 'refresh_token_id' });
            expect(logger.info).toHaveBeenCalled();
        });

        it('should throw error if user is unverified or missing', async () => {
            userRepoMock.fetchByUsername.mockResolvedValue({ id: null, verified: false });

            await expect(service.login('user', 'pass')).rejects.toThrow(serverError);
            expect(logger.warn).toHaveBeenCalled();
        });

        it('should throw error if password does not match', async () => {
            userRepoMock.fetchByUsername.mockResolvedValue(mockUser);
            mockedAuthUtils.comparePasswords.mockResolvedValue(false);

            await expect(service.login('user', 'pass')).rejects.toThrow(serverError);
        });
    });

    describe('logout', () => {
        it('should delete by user if flag is true', async () => {
            authRepoMock.deleteByUser.mockResolvedValue({ userId: 'u1' });
            await service.logout(true, 'token123');
            expect(authRepoMock.deleteByUser).toHaveBeenCalledWith('token123');
        });

        it('should delete by family if flag is false', async () => {
            authRepoMock.deleteByFamily.mockResolvedValue({ userId: 'u1' });
            await service.logout(false, 'token123');
            expect(authRepoMock.deleteByFamily).toHaveBeenCalledWith('token123');
        });
    });

    describe('forgetPass', () => {
        it('should generate a forget token for valid email', async () => {
            userRepoMock.fetchByEmail.mockResolvedValue({ id: 'u1' });
            mockedAuthUtils.generateForgetToken.mockReturnValue('forget_token');

            const result = await service.forgetPass('test@test.com');

            expect(result).toBe('forget_token');
            expect(authUtils.generateForgetToken).toHaveBeenCalledWith('u1');
        });
    });

    describe('changePass', () => {
        it('should hash password and update user', async () => {
            mockedAuthUtils.hashPassword.mockResolvedValue('new_hash');
            mockedAuthUtils.decodeForgetToken.mockReturnValue({ id: 'u1' });

            await service.changePass('token', 'new_pass');

            expect(authUtils.hashPassword).toHaveBeenCalledWith('new_pass');
            expect(userRepoMock.update).toHaveBeenCalledWith({ password: 'new_hash' }, 'u1');
            expect(logger.info).toHaveBeenCalled();
        });
    });

    describe('generateCredentials', () => {
        it('should generate a new accessToken for a valid refreshToken', async () => {
            const mockTokenData = { id: 'rt-1', userId: 'u1', role: 'USER' };
            authRepoMock.generateNewToken.mockResolvedValue(mockTokenData);
            vi.mocked(authUtils.generateAccessToken).mockReturnValue('new_access_token');

            const result = await service.generateCredentials('existing_refresh_token');

            expect(authRepoMock.generateNewToken).toHaveBeenCalledWith('existing_refresh_token');
            expect(vi.mocked(authUtils.generateAccessToken)).toHaveBeenCalledWith('u1', 'USER');
            expect(result).toEqual({
                accessToken: 'new_access_token',
                refreshToken: mockTokenData
            });
        });

        it('should throw UNAUTHORIZED if refreshToken is invalid', async () => {
            authRepoMock.generateNewToken.mockResolvedValue({ id: null });

            await expect(service.generateCredentials('invalid_token'))
                .rejects.toThrow(serverError);

            // Verifies it specifically fails on the ID check
            expect(vi.mocked(authUtils.generateAccessToken)).not.toHaveBeenCalled();
        });
    });

    describe('generateNewCredentials', () => {
        it('should generate credentials from a user object', async () => {
            const mockUser = { id: 'u1', role: 'ADMIN' } as any;
            const mockRefreshToken = { id: 'new-rt-123', userId: 'u1' };

            vi.mocked(authUtils.generateAccessToken).mockReturnValue('access_token_123');
            authRepoMock.create.mockResolvedValue(mockRefreshToken);

            const result = await service.generateNewCredentials(mockUser);

            expect(crypto.randomUUID).toHaveBeenCalled();
            expect(authRepoMock.create).toHaveBeenCalledWith(
                'mock-uuid', // From our global crypto mock
                'u1',
                'ADMIN'
            );
            expect(result).toEqual({
                accessToken: 'access_token_123',
                refreshToken: 'new-rt-123'
            });
            expect(logger.info).toHaveBeenCalledWith(
                expect.stringContaining("New refreshToken"),
                { userId: 'u1' }
            );
        });
    });

});
