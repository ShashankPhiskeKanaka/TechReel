class InteractionFactory {
    static create (LikeRepository: any, ViewRepository: any, Service: any, Controller: any) {
        const likeRepo = new LikeRepository();
        const viewRepo = new ViewRepository();
        const service = new Service(likeRepo, viewRepo);
        const controller = new Controller(service);

        return controller;
    }
}

export { InteractionFactory }