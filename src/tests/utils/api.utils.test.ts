import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiResponse } from '../../utils/api.utils.js';
import type { Response } from 'express';

describe('Api Utility', () => {
    let mockResponse: any;

    beforeEach(() => {
        mockResponse = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        } as unknown as Response;

        vi.clearAllMocks();
    });

    describe('success', () => {
        it('should return a 200 status and correct body by default', () => {
            const message = 'Operation successful';
            const data = { id: 1 };

            ApiResponse.success(mockResponse, message, data);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message,
                data,
            });
        });

        it('should allow overriding the status code (e.g., 201 Created)', () => {
            ApiResponse.success(mockResponse, 'Created', null, 201);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true, message: 'Created' })
            );
        });
    });

    describe('error', () => {
        it('should return a 400 status and correct body by default', () => {
            const errorMessage = 'Something went wrong';

            ApiResponse.error(mockResponse, errorMessage);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: errorMessage,
                data: null
            });
        });

        it('should allow overriding the error status code (e.g., 404 Not Found)', () => {
            ApiResponse.error(mockResponse, 'Not Found', 404);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: false, message: 'Not Found', data: null })
            );
        });
    });
});
