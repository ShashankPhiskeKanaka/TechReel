class ControllerFactory {
    static create (Repository: any, Service: any, Controller: any) {
        const repo = new Repository();
        const service = new Service(repo);
        const controller = new Controller(service);

        return controller;
    }
}

export { ControllerFactory }