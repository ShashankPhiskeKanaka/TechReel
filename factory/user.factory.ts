import { UserController } from "../src/controller/user.controller.js";
import { UserRepository } from "../src/repository/user.repository.js";
import { UserService } from "../src/service/user.service.js";

class UserFactory {
    static create() {
        const repo = new UserRepository();
        const service = new UserService(repo)
        const controller = new UserController(service);

        return controller;
    }
}

export { UserFactory };