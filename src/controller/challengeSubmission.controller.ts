import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import { ChallengeSubmissionService } from "../service/challengeSubmission.service.js";
import { logger } from "../utils/logger.js";
import { ApiResponse } from "../utils/api.utils.js";
import { BaseController } from "./base.controller.js";
import { serverError } from "../utils/error.utils.js";
import { errorMessage } from "../constants/error.messages.js";

const controllerMessages = new ControllerMessages("Challenge Submission");

class ChallengeSubmissionController extends BaseController<ChallengeSubmissionService> {
    constructor(service: ChallengeSubmissionService) {
        super(service, "Challenge submission");
    }

    /**
     * Handles HTTP request to enqueue a new challenge submission.
     * 
     * @param {Request} req - Express request; expects `challengeId` and `answer` in body.
     * @param {Response} res - Express response; confirms task has been queued.
     * @returns {Promise<Response>} 200 OK with confirmation message.
     */
    createChallengeSubmissionJob = async (req: Request, res: Response) => {
        logger.http(controllerMessages.CREATE.req, {
            ip: req.ip,
            userId: req.user?.id,
            challengeId: req.body.challengeId
        });

        await this.service.createChallengeSubmissionJob({ ...req.body, userId: req.user?.id });

        return ApiResponse.success(res, controllerMessages.CREATE.res);
    }

    // fetch = async (req: Request, res: Response) => {
    //     logger.http(controllerMessages.FETCH.req, {
    //         ip: req.ip,
    //         userId: req.user?.id,
    //         challengeSubmissionId: req.params.id?.toString()
    //     });

    //     const challengeSubmission = await this.ChallengesubmissionService.fetchById(req.params.id?.toString() ?? "");

    //     return ApiResponse.success(res, controllerMessages.FETCH.res, challengeSubmission);
    // }

    /**
     * Handles the retrieval of challenge submissions.
     * Implements role-based visibility: Admins can fetch any record, 
     * while standard users are restricted to their own data.
     * @param req - Express Request (params: id, user: role/id)
     * @param res - Express Response (json: submission data)
     */
    fetch = async (req: Request, res: Response) => {
        const id = req.params.id?.toString() ?? "";
        this.logRequest(req, this.messages.FETCH.req, { id });

        const result = await this.service.fetch(id, req.user?.role == "ADMIN" ? "" : req.user?.id);
        return ApiResponse.success(res, this.messages.FETCH.res, result);
    }

    /**
     * Handles the HTTP request to retrieve a paginated list of challenge submissions.
     * Enforces data privacy by restricting "USER" roles to their own submissions while 
     * allowing admins to filter by any user or challenge.
     * @param {Request} req - Express request; expects pagination and optional challenge filters.
     * @param {Response} res - Express response object.
     * @returns {Promise<Response>} API success response with a list of challenge submissions.
     */
    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id,
        });

        const challengeSubmissions = await this.service.fetchAll(
            {
                limit: Number(req.query.limit),
                sort: req.query.sort?.toString(),
                search: req.query.search?.toString(),
                lastId: req.query.lastId?.toString(),
                lastCreatedAt: new Date(req.query.lastCreatedAt?.toString() ?? "")
            },
            {
                userId: req.user?.role == "USER" ? req.user?.id : req.query.userId?.toString(),
                challengeId: req.query.challengeId?.toString(),
                isCorrect: req.query.isCorrect !== undefined ? req.query.isCorrect.toString() === "true" : undefined
            },
            [

            ]
        )

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, challengeSubmissions);
    }

    // delete = async (req: Request, res: Response) => {
    //     logger.http(controllerMessages.DELETE.req, {
    //         ip: req.ip,
    //         userId: req.user?.id,
    //     });

    //     const challengeSubmission = await this.ChallengesubmissionService.delete(req.params.id?.toString() ?? "");

    //     return ApiResponse.success(res, controllerMessages.DELETE.res, challengeSubmission);
    // }
}

export { ChallengeSubmissionController }