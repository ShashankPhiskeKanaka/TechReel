import { AuthUtilsClass } from "../utils/auth.utils.js";

class AuthFactory {
    static create () {
        const authUtils = new AuthUtilsClass();
        return authUtils;
    }
}

const authUtils = AuthFactory.create();

export { authUtils }