import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ViewService } from '../../service/view.service.js';
import { logger } from '../../utils/logger.js';
import { addInteractionTask } from '../../../jobs/producers/interaction.producer.js';

// Mocking external dependencies
vi.mock('../../utils/logger.js', () => ({
    logger: { info: vi.fn(), error: vi.fn() }
}));

vi.mock('../../../jobs/producers/interaction.producer.js', () => ({
    addInteractionTask: vi.fn()
}));

describe('ViewService', () => {
    let viewService: any;
    let repoMock: any;

    beforeEach(() => {
        repoMock = {
            fetchViews: vi.fn()
        };

        viewService = new ViewService(repoMock);
        viewService.methods = repoMock;

        vi.clearAllMocks();
    });

    describe('createView', () => {
        it('should add an INCREMENT task and log the job', async () => {
            const mockData = { reelId: 'reel-123', userId: 'user-456' };

            await viewService.createView(mockData);

            expect(addInteractionTask).toHaveBeenCalledWith(
                { ...mockData, process: "INCREMENT" },
                "VIEW"
            );
            expect(logger.info).toHaveBeenCalledWith(
                "New view record create job added to the queue",
                expect.objectContaining({ process: "INCREMENT", reelId: 'reel-123' })
            );
        });
    });

    describe('fetchViews', () => {
        it('should return view count from the repository', async () => {
            const mockViews = 150;
            repoMock.fetchViews.mockResolvedValue(mockViews);

            const result = await viewService.fetchViews('reel-123');

            expect(result).toBe(mockViews);
            expect(repoMock.fetchViews).toHaveBeenCalledWith('reel-123');
            expect(logger.info).toHaveBeenCalledWith(
                "Total views for a reel fetched",
                { reelId: 'reel-123' }
            );
        });
    });

    describe('updateView', () => {
        it('should add a REWATCHED task and log the update', async () => {
            const mockData = { reelId: 'reel-123', userId: 'user-456' };

            await viewService.updateView(mockData);

            expect(addInteractionTask).toHaveBeenCalledWith(
                { ...mockData, process: "REWATCHED" },
                "VIEW"
            );
            expect(logger.info).toHaveBeenCalledWith(
                "View record update job added to the queue",
                expect.objectContaining({ process: "REWATCHED" })
            );
        });
    });
});
