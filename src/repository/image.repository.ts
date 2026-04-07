import { prisma } from "../../db/prisma.js";
import type { Image } from "../dto/image.dto.js";
import { BaseRepository } from "./base.repository.js";

class ImageRepository extends BaseRepository<Image, ImageData, any> {
    
    constructor() {
        super(prisma.images, "IMAGE");
    }

    

}

export { ImageRepository }