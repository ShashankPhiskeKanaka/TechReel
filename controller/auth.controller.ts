import type { AuthService } from "../service/auth.service.js";

class AuthController {
    constructor ( private AuthService : AuthService ) {}
}

export { AuthController }