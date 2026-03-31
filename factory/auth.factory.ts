import { AuthController } from "../src/controller/auth.controller.js";
import { AuthRepository } from "../src/repository/auth.repository.js";
import { UserRepository } from "../src/repository/user.repository.js";
import { AuthService } from "../src/service/auth.service.js";
import { AuthUtilsClass } from "../src/utils/auth.utils.js";
import { ErrorHandlerClass, GlobalErrorHandlerClass } from "../src/utils/error.utils.js";

class AuthFactory {
    static createUtils() {
        const authUtils = new AuthUtilsClass();
        return authUtils;
    }

    static create() {
        const repo = new AuthRepository();
        const userRepo = new UserRepository();
        const service = new AuthService(repo, userRepo);
        const controller = new AuthController(service);

        return controller;
    }
}

const globalErrorHandler = new GlobalErrorHandlerClass();
const errorHandler = new ErrorHandlerClass();
const authUtils = AuthFactory.createUtils();

export { authUtils, AuthFactory, errorHandler, globalErrorHandler }