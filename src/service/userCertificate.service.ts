import type { UserCertificate, UserCertificateData } from "../dto/userCertificate.dto.js";
import type { UserCertificateRepository } from "../repository/userCertificate.repository.js";
import { BaseService } from "./base.service.js";

class UserCertificateService extends BaseService<UserCertificate, UserCertificateData, any> {
    constructor(methods: UserCertificateRepository) {
        super(methods, "USER-CERTIFICATE");
    }
}

export { UserCertificateService }