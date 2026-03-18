class TagFactory {
    static create (TagRepo : any, TagService: any, TagController: any) {
        const repo = new TagRepo();
        const service = new TagService(repo);
        const controller = new TagController(service);

        return controller;
    }
}

export { TagFactory };