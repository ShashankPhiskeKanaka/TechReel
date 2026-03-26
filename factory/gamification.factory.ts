import { GamificationController } from "../controller/gamification.controller.js";

class GamificationFactory {
    static createController (ChallengeSubmissionRepo: any, XpRepo: any, TokenLedgerRepo: any, UserRoadmapStepsRepo: any, UserBadgesRepo: any, GamificationService: any) {
        const challengeSubmissionRepo = new ChallengeSubmissionRepo();
        const xpRepo = new XpRepo();
        const tokenLedgerRepo = new TokenLedgerRepo()
        const userRoadmapStepsRepo = new UserRoadmapStepsRepo();
        const userBadgesRepository = new UserBadgesRepo();
        const gamificationService = new GamificationService(challengeSubmissionRepo, xpRepo, tokenLedgerRepo, userRoadmapStepsRepo, userBadgesRepository);

        const controller = new GamificationController(gamificationService);

        return controller
    }

    static createService(ChallengeSubmissionRepo: any, XpRepo: any, TokenLedgerRepo: any, UserRoadmapStepsRepo: any, UserBadgesRepo: any, GamificationService: any) {
        const challengeSubmissionRepo = new ChallengeSubmissionRepo();
        const xpRepo = new XpRepo();
        const tokenLedgerRepo = new TokenLedgerRepo()
        const userRoadmapStepsRepo = new UserRoadmapStepsRepo();
        const userBadgesRepository = new UserBadgesRepo();
        const gamificationService = new GamificationService(challengeSubmissionRepo, xpRepo, tokenLedgerRepo, userRoadmapStepsRepo, userBadgesRepository);

        return gamificationService;
    }
}

export { GamificationFactory }