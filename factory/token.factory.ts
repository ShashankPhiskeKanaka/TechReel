class TokenFactory {
    static create (TokenRepo: any, TokenService: any, TokenController: any) {
        const repo = new TokenRepo();
        const service = new TokenService(repo);
        const controller = new TokenController(service);

        return controller;
    }
}

export { TokenFactory }