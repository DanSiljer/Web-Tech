import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "src/auth/decorators/roles.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Role } from "src/auth/models/role.enum";
import { ProductLogsService } from "../services/product-logs.service";

@Roles(Role.ADMIN)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('/logs/products')
export class ProductLogsController {
    constructor(private readonly productLogsService: ProductLogsService) { }

    @Post()
    async getLogs(
        @Body() data: { gte?: Date, lte?: Date },
        @Query() query: { alterFieldId?: number, productId?: string, userId?: number }
    ): Promise<any> {
        const { gte, lte } = data;
        const { alterFieldId, productId, userId } = query;

        return await this.productLogsService.get(gte, lte, alterFieldId, productId, userId);
    }
}