import { prisma } from "../../db/prisma.js";
import type { Folder, FolderData } from "../dto/folder.dto.js";
import { BaseRepository } from "./base.repository.js";

class FolderRepository extends BaseRepository<Folder, FolderData, any> {
    constructor() {
        super(prisma.reel_folders, "FOLDER");
    }

}

export { FolderRepository }