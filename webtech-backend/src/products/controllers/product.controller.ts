import { Body, Controller, Get, Param, Post, Put, Query, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { Product } from "@prisma/client";
import { CreateProductDto } from "../dtos/create-product.dto";
import { QueryProductDto } from "../dtos/query-product.dto";
import { UpdateProductDto } from "../dtos/update-product.dto";
import { ProductService } from "../services/product.service";
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';


@UseGuards(AuthGuard('jwt'))
@ApiTags('product')
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post('import')
    @UseInterceptors(FileInterceptor('file'))
    async uploadProducts(
        @Request() req,
        @UploadedFile() file: Express.Multer.File
    ): Promise<any> {
        const { id: userId } = req.user;
        return await this.productService.uploadProducts(file, userId);
    }

    @Post()
    @ApiOperation({ summary: 'Cadastrar um item' })
    @ApiBearerAuth()
    async create(@Body() createProductDto: CreateProductDto): Promise<any> {
        return await this.productService.create(createProductDto)
    }

    @Get()
    @ApiOperation({ summary: 'Obter lista de itens' })
    @ApiBearerAuth()
    async find(@Query() query: QueryProductDto): Promise<void[]> {
        let { skip, take, available, collection, category, grife } = query;

        skip = Number(skip)
        take = Number(take)

        return await this.productService.find({ skip, take, available, collection, category, grife });
    }

    @Get(':product')
    @ApiOperation({ summary: 'Obter um item' })
    @ApiBearerAuth()
    async findByProduct(@Param('product') product: string): Promise<Product> {
        return await this.productService.findByProduct(product);
    }

    @Put(':product')
    @ApiOperation({ summary: 'Atualizar um item' })
    @ApiBearerAuth()
    async update(
        @Request() req,
        @Param('product') product: string,
        @Body() updateProductDto: UpdateProductDto
    ): Promise<any> {
        const { id: userId } = req.user;
        return await this.productService.update(product, updateProductDto, userId);
    }
}