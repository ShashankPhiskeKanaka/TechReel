import type { Folder, FolderData } from "../dto/folder.dto.js";
import type { FolderRepository } from "../repository/folder.repository.js";
import { BaseService } from "./base.service.js";

class FolderService extends BaseService<Folder, FolderData, any> {
    constructor(methods: FolderRepository) {
        super(methods, "FOLDER");
    }
}

export { FolderService }