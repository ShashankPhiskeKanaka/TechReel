import { UserController } from "../controller/user.controller.js";
import { UserRepository } from "../repository/user.repository.js";
import { UserService } from "../service/user.service.js";

class UserFactory {
    static create () {
        const repo = new UserRepository();
        const service = new UserService(repo)
        const controller = new UserController(service);

        return controller;
    }
}

export { UserFactory };