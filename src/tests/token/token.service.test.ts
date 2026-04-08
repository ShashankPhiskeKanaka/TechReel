import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TokenService } from '../../service/token.service.js';
import { logger } from '../../utils/logger.js';
import { redisUtils } from '../../utils/redis.utils.js';
import { s3Client } from '../../../db/s3.js';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Mock Dependencies
vi.mock('../../utils/logger.js', () => ({ logger: { info: vi.fn() } }));
vi.mock('../../utils/redis.utils.js', () => ({ redisUtils: { invalidateKey: vi.fn() } }));
vi.mock('../../../db/s3.js', () => ({ s3Client: { send: vi.fn() } }));
vi.mock('@aws-sdk/s3-request-presigner', () => ({ getSignedUrl: vi.fn() }));
vi.mock('@aws-sdk/client-s3');

describe('TokenService', () => {
    let service: TokenService;
    let repoMock: any;

    beforeEach(() => {
        repoMock = {
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        };
        service = new TokenService(repoMock);
        vi.clearAllMocks();
    });

    describe('create', () => {
        it('should create a token and return a signed URL if imageRecord exists', async () => {
            const mockData = { imageType: 'image/png' } as any;
            const mockToken = { id: 't1' };
            const mockImage = { id: 'img1' };
            repoMock.create.mockResolvedValue({ token: mockToken, imageRecord: mockImage });
            (getSignedUrl as any).mockResolvedValue('https://signed-url.com');

            const result = await service.create(mockData);

            expect(repoMock.create).toHaveBeenCalledWith(mockData);
            expect(redisUtils.invalidateKey).toHaveBeenCalledWith("PUBLIC", "TOKEN", "CREATE");
            expect(getSignedUrl).toHaveBeenCalled();
            expect(result).toEqual({ token: mockToken, uploadUrl: 'https://signed-url.com' });
        });

        it('should return no uploadUrl if imageRecord is missing', async () => {
            repoMock.create.mockResolvedValue({ token: { id: 't1' }, imageRecord: null });

            const result = await service.create({} as any);

            expect(result.uploadUrl).toBeUndefined();
            expect(getSignedUrl).not.toHaveBeenCalled();
        });
    });

    describe('update', () => {
        it('should delete old image and return new signed URL', async () => {
            const mockData = { imageType: 'image/jpeg' } as any;
            const mockImage = { id: 'img2', key: 'old-key' };
            repoMock.update.mockResolvedValue({ token: { id: 't1' }, imageRecord: mockImage });
            (getSignedUrl as any).mockResolvedValue('https://new-url.com');

            const result = await service.update(mockData, 't1');

            expect(s3Client.send).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));
            expect(getSignedUrl).toHaveBeenCalledWith(s3Client, expect.any(PutObjectCommand), { expiresIn: 3600 });
            expect(result.uploadUrl).toBe('https://new-url.com');
        });
    });

    describe('hardDelete', () => {
        it('should delete token record and remove image from S3', async () => {
            const mockImage = { key: 'delete-me' };
            repoMock.delete.mockResolvedValue({ token: { id: 't1' }, imageRecord: mockImage });

            const result = await service.hardDelete('t1');

            expect(repoMock.delete).toHaveBeenCalledWith('t1');
            expect(s3Client.send).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));
            expect(redisUtils.invalidateKey).toHaveBeenCalledWith("PUBLIC", "TOKEN", "DELETE");
            expect(result).toEqual({ id: 't1' });
        });
    });
});
