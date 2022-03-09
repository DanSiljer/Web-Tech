import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { PrismaModule } from "src/prisma/prisma.module";
import { ProductLogsController } from "./controllers/produc-logs.controller";
import { ProductLogsService } from "./services/product-logs.service";
import { ProductController } from "./controllers/product.controller";
import { ProductService } from "./services/product.service";

@Module({
    imports: [MulterModule.register({
        storage: diskStorage({
            destination: './tmp',
            filename: (req, file, cb) => {
                cb(null, file.originalname)
            }
        })
    }), PrismaModule],
    providers: [ProductService, ProductLogsService],
    controllers: [ProductController, ProductLogsController],
})
export class ProductModule { }
