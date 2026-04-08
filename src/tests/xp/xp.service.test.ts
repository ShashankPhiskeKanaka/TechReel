import { describe, it, expect, vi, beforeEach } from 'vitest';
import { XpService } from '../../service/xp.service.js';
import { logger } from '../../utils/logger.js';
import { serverError } from '../../utils/error.utils.js';
import { errorMessage } from '../../constants/error.messages.js';

vi.mock('../../utils/logger.js', () => ({
    logger: { info: vi.fn(), warn: vi.fn() }
}));

describe('XpService - Fetch Methods', () => {
    let xpService: XpService;
    let repoMock: any;

    beforeEach(() => {

        repoMock = {
            fetch: vi.fn(),
            fetchAll: vi.fn()
        };

        xpService = new XpService(repoMock);
        vi.clearAllMocks();
    });

    describe('fetch', () => {
        it('should return a record if it exists', async () => {
            const mockXp = { id: 'xp-1', amount: 100, userId: 'user-1' };
            repoMock.fetch.mockResolvedValue(mockXp);

            const result = await xpService.fetch('xp-1', 'user-1');

            expect(result).toEqual(mockXp);
            expect(logger.info).toHaveBeenCalled();
        });

        it('should throw 404 if record is missing', async () => {
            repoMock.fetch.mockResolvedValue(null);

            await expect(xpService.fetch('invalid-id'))
                .rejects.toThrow();

            expect(logger.warn).toHaveBeenCalled();
        });
    });

    describe('fetchAll', () => {
        const paginationData = { limit: 10, sort: 'desc' };

        it('should return records and a nextCursor', async () => {
            const mockRecords = [
                { id: '1', createdAt: new Date('2023-01-01') },
                { id: '2', createdAt: new Date('2023-01-02') }
            ];
            repoMock.fetchAll.mockResolvedValue(mockRecords);

            const result = await xpService.fetchAll(paginationData as any, {}, ['source']);

            expect(result.records).toHaveLength(2);

            expect(result.nextCursor).toEqual({
                lastId: '2',
                lastCreatedAt: mockRecords[1]?.createdAt
            });
            expect(logger.info).toHaveBeenCalled();
        });

        it('should throw 404 if records array is empty', async () => {
            repoMock.fetchAll.mockResolvedValue([]);

            await expect(xpService.fetchAll(paginationData as any, {}, []))
                .rejects.toThrow();

            expect(logger.warn).toHaveBeenCalled();
        });
    });
});
