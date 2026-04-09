import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addInteractionTask } from '../../jobs/producers/interaction.producer.js';
import { addGamificationTask } from '../../jobs/producers/gamification.producer.js';
import { interactionQueue } from '../../jobs/queues/interaction.queue.js';
import { gamificationQueue } from '../../jobs/queues/gamification.queue.js';

// Mock the queue files so they don't try to connect to a real Redis
vi.mock('../../jobs/queues/interaction.queue.js', () => ({
    interactionQueue: { add: vi.fn() }
}));

vi.mock('../../jobs/queues/gamification.queue.js', () => ({
    gamificationQueue: { add: vi.fn() }
}));

describe('Producers', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('addInteractionTask', () => {
        it('should add a task to interactionQueue with correct options', async () => {
            const mockData = { reelId: '123' };
            await addInteractionTask(mockData, 'LIKE');

            expect(interactionQueue.add).toHaveBeenCalledWith(
                "UPDATE_REEL_STATS",
                { data: mockData, type: 'LIKE' },
                expect.objectContaining({
                    attempts: 3,
                    removeOnComplete: true,
                    backoff: { type: 'exponential', delay: 1000 }
                })
            );
        });
    });

    describe('addGamificationTask', () => {
        it('should add a task to gamificationQueue', async () => {
            const mockData = { userId: 'user1', points: 10 };
            await addGamificationTask(mockData);

            expect(gamificationQueue.add).toHaveBeenCalledWith(
                "GAMIFICATION_TASK",
                { data: mockData },
                expect.objectContaining({ attempts: 3 })
            );
        });
    });
});
