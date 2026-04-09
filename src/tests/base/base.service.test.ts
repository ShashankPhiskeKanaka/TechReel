import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseService } from '../../service/base.service.js';
import { logger } from '../../utils/logger.js';
import { redisUtils } from '../../utils/redis.utils.js';
import { serverError } from '../../utils/error.utils.js';
import { errorMessage } from '../../constants/error.messages.js';

vi.mock('../../utils/logger.js', () => ({
    logger: { info: vi.fn(), warn: vi.fn() }
}));

vi.mock('../../utils/redis.utils.js', () => ({
    redisUtils: { invalidateKey: vi.fn() }
}));

interface MockModel { id: string; userId?: string; createdAt?: Date; }
interface MockMethods {
    create: any; fetch: any; fetchAll: any; update: any; hardDelete: any; softDelete: any; tx: any;
}

class TestService extends BaseService<MockModel, any, MockMethods> {
    constructor(methods: MockMethods) {
        super(methods, 'TestModel');
    }
}

describe('BaseService', () => {
    let service: TestService;
    let repoMock: MockMethods;

    beforeEach(() => {
        repoMock = {
            create: vi.fn(),
            fetch: vi.fn(),
            fetchAll: vi.fn(),
            update: vi.fn(),
            hardDelete: vi.fn(),
            softDelete: vi.fn(),
            tx: vi.fn(),
        };
        service = new TestService(repoMock);
        vi.clearAllMocks();
    });

    describe('create', () => {
        it('should create record and invalidate cache with userId', async () => {
            const mockRecord = { id: '123', userId: 'user_1' };
            repoMock.create.mockResolvedValue(mockRecord);

            const result = await service.create({ some: 'data' });

            expect(repoMock.create).toHaveBeenCalledWith({ some: 'data' });
            expect(redisUtils.invalidateKey).toHaveBeenCalledWith('user_1', 'TestModel', 'UPDATE');
            expect(logger.info).toHaveBeenCalled();
            expect(result).toEqual(mockRecord);
        });

        it('should invalidate cache with PUBLIC if userId is missing', async () => {
            repoMock.create.mockResolvedValue({ id: '123' });
            await service.create({});
            expect(redisUtils.invalidateKey).toHaveBeenCalledWith('PUBLIC', 'TestModel', 'UPDATE');
        });
    });

    describe('fetch', () => {
        it('should return record if found', async () => {
            const mockRecord = { id: '123' };
            repoMock.fetch.mockResolvedValue(mockRecord);

            const result = await service.fetch('123');

            expect(result).toEqual(mockRecord);
            expect(logger.info).toHaveBeenCalled();
        });

        it('should throw serverError if record is missing', async () => {
            repoMock.fetch.mockResolvedValue(null);

            await expect(service.fetch('invalid'))
                .rejects.toThrow(serverError);

            expect(logger.warn).toHaveBeenCalled();
        });
    });

    describe('fetchAll', () => {
        it('should return records and nextCursor', async () => {
            const mockDate = new Date();
            const mockRecords = [{ id: '1', createdAt: mockDate }];
            repoMock.fetchAll.mockResolvedValue(mockRecords);

            const result = await service.fetchAll({ limit: 10 } as any, {}, []);

            expect(result.records).toEqual(mockRecords);
            expect(result.nextCursor).toEqual({
                lastId: '1',
                lastCreatedAt: mockDate
            });
        });

        it('should throw NOTFOUND error if array is empty', async () => {
            repoMock.fetchAll.mockResolvedValue([]);

            await expect(service.fetchAll({} as any, {}, []))
                .rejects.toThrow();
        });
    });

    describe('update', () => {
        it('should update record and invalidate cache', async () => {
            const mockRecord = { id: '123', userId: 'user_999' };
            repoMock.update.mockResolvedValue(mockRecord);

            const result = await service.update({ name: 'updated' }, '123');

            expect(repoMock.update).toHaveBeenCalledWith({ name: 'updated' }, '123');
            expect(redisUtils.invalidateKey).toHaveBeenCalledWith('user_999', 'TestModel', 'UPDATE');
            expect(logger.info).toHaveBeenCalledWith('TestModel record updated', { id: '123' });
            expect(result).toEqual(mockRecord);
        });
    });

    describe('delete', () => {
        it('should perform hard delete when flag is true', async () => {
            const mockRecord = { id: '123', userId: 'user_1' };
            repoMock.hardDelete.mockResolvedValue(mockRecord);

            const result = await service.delete('123', true);

            expect(repoMock.hardDelete).toHaveBeenCalledWith('123');
            expect(logger.info).toHaveBeenCalledWith('TestModel record hard deleted', { id: '123' });
            expect(redisUtils.invalidateKey).toHaveBeenCalledWith('user_1', 'TestModel', 'UPDATE');
            expect(result).toEqual(mockRecord);
        });

        it('should perform soft delete when flag is false', async () => {
            const mockRecord = { id: '123', userId: null };
            repoMock.softDelete.mockResolvedValue(mockRecord);

            const result = await service.delete('123', false);

            expect(repoMock.softDelete).toHaveBeenCalledWith('123');
            expect(logger.info).toHaveBeenCalledWith('TestModel record soft deleted', { id: '123' });
            expect(redisUtils.invalidateKey).toHaveBeenCalledWith('PUBLIC', 'TestModel', 'UPDATE');
            expect(result).toEqual(mockRecord);
        });
    });


    describe('tx', () => {
        it('should return a new instance with transaction methods', () => {
            const mockTxClient = {};
            const mockTxRepo = { some: 'repo' };
            repoMock.tx.mockReturnValue(mockTxRepo);

            const txService = service.tx(mockTxClient);

            expect(repoMock.tx).toHaveBeenCalledWith(mockTxClient);
            // Verify it's a clone and methods are updated
            expect(txService).not.toBe(service);
            // @ts-ignore
            expect(txService.methods).toBe(mockTxRepo);
        });
    });
});
