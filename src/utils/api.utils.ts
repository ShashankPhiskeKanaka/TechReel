import type { Response } from 'express';

class ApiResponse {
    // We keep the constructor private so people use the static methods
    private constructor(
        public success: boolean, 
        public message: string, 
        public data: any = null
    ) {}

    /**
     * Standard Success Response
     * @param status Defaults to 200, but can be 201, 204, etc.
     */
    static success(res: Response, message: string, data: any = null, status: number = 200) {
        return res.status(status).json(new ApiResponse(true, message, data));
    }

    /**
     * Standard Error Response
     * @param status Defaults to 400, but can be 401, 403, 404, 500, etc.
     */
    static error(res: Response, message: string, status: number = 400) {
        return res.status(status).json(new ApiResponse(false, message));
    }
}

export { ApiResponse }