import type { ChallengeOptionsRepository } from "../repository/challengeOptions.repository.js";

class ChallengeOptionService {
    constructor ( private ChallengeOptionMethods: ChallengeOptionsRepository ) {}
}

export { ChallengeOptionService }