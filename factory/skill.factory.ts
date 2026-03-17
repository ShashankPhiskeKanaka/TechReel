class SkillFactory {
    static create (SkillRepo: any, SkillService: any, SkillController: any) {
        const repo = new SkillRepo();
        const service = new SkillService(repo);
        const controller = new SkillController(service);

        return controller;
    }
}

export { SkillFactory };