import type { UserCertificate, UserCertificateData } from "../dto/userCertificate.dto.js";
import { BaseRepository } from "./base.repository.js";

class UserCertificateRepository extends BaseRepository<UserCertificate, UserCertificateData, any> {

}

export { UserCertificateRepository }