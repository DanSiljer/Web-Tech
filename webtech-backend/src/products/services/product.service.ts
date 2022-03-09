import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Product } from "@prisma/client";
import * as Excel from 'exceljs'
import { resolve } from "path";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductDto } from "../dtos/create-product.dto";
import { QueryProductDto } from "../dtos/query-product.dto";
import { UpdateProductPriceDto } from "../dtos/update-product-price.dto";
import { UpdateProductDto } from "../dtos/update-product.dto";
import { ProductLogsService } from "./product-logs.service";


@Injectable()
export class ProductService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly productLogsService: ProductLogsService
    ) { }

    async uploadProducts(file: Express.Multer.File, userId: number) {

        const updateProduct: UpdateProductPriceDto[] = []
        const errors: Object[] = []

        const filePath = resolve('tmp', file.filename);
        const workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);

        worksheet.eachRow(async (row, rowNumber) => {
            console.log(rowNumber);
            if (rowNumber === 1) return;
            console.log(rowNumber);

            const updateProductPrice = new UpdateProductPriceDto();

            const productId = row.getCell(1).value.toString();

            updateProductPrice.productProduct = productId;

            if (row.getCell(2).type === Excel.ValueType.Number && row.getCell(2).value < 100 && row.getCell(2).value >= 0) {
                let discountPromotion = row.getCell(2).value;

                updateProductPrice.discountPromotion = Number(discountPromotion);
            }

            if (row.getCell(3).type === Excel.ValueType.Number && row.getCell(3).value >= 0) {
                let price1 = row.getCell(3).value;

                updateProductPrice.price1 = Number(price1);
            }

            if (row.getCell(4).type === Excel.ValueType.Number && row.getCell(4).value > 0) {
                let priceLiquid = row.getCell(4).value;

                updateProductPrice.priceLiquid = Number(priceLiquid);
            }

            if (row.getCell(5).type === Excel.ValueType.Number && row.getCell(5).value < 100 && row.getCell(5).value >= 0) {
                let discountLimit = row.getCell(5).value;

                updateProductPrice.discountLimit = Number(discountLimit);
            }

            updateProduct.push(updateProductPrice);
        })
        let countUpdateProductsSucess: number = 0;
        for (const productPrice of updateProduct) {

            const { productProduct: productId } = productPrice;

            const productPriceOriginal = await this.prismaService.productPrice.findUnique({ where: { productProduct: productId } });

            if (productPriceOriginal) {
                const productPriceUpdate = await this.prismaService.productPrice.update({
                    where: {
                        productProduct: productPrice.productProduct
                    },
                    data: {
                        ...productPrice
                    }
                })

                if (productPriceUpdate) {
                    await this.productLogsService.createLogProductsPrice(productPriceOriginal, productPriceUpdate, userId);
                    countUpdateProductsSucess += 1;
                }

            } else {
                errors.push(`Unable to update the product, ${productId} not exist`)
            }
        }


        return {
            productsAtualized: countUpdateProductsSucess,
            errors: errors
        }
    }

    async create(createProductDto: CreateProductDto): Promise<any> {
        const { productPrice, ...data } = createProductDto;
        const { codTabPriceId, ...dataProductPrice } = productPrice;

        const tabPriceExist = await this.prismaService.tabPrice.findUnique({ where: { id: codTabPriceId } });
        if (!tabPriceExist) throw new BadRequestException("Código da tabela não existe");

        const productAlreadyExist = await this.prismaService.product.findUnique({ where: { product: data.product } });
        if (productAlreadyExist) throw new BadRequestException('Código do produto já existe');

        const productNameAlreadyExist = await this.prismaService.product.findFirst({ where: { name: data.name } })
        if (productNameAlreadyExist) throw new BadRequestException('Nome do produto já existe');

        const prodcut = await this.prismaService.product.create({
            data: {
                ...data,
                ProductPrice: {
                    create: {
                        ...dataProductPrice,
                        tabPrice: {
                            connect: {
                                id: codTabPriceId
                            }
                        },
                    }
                }
            },
            include: { ProductPrice: true }
        });

        return prodcut;
    }

    async find(query: QueryProductDto): Promise<any[]> {
        const { skip, take, available, collection, category, grife } = query;
        return await this.prismaService.product.findMany({
            take,
            skip,
            where: {
                available,
                collection,
                category,
                grife
            },
            orderBy: {
                id: 'asc'
            },
            include: {
                ProductPrice: {
                    include: {
                        tabPrice: true
                    }
                }
            }
        })
    }

    async findByProduct(product: string): Promise<Product> {
        const data = await this.prismaService.product.findUnique({ where: { product }, include: {
                ProductPrice: {
                    include: {
                        tabPrice: true
                    }
                }
            } });

        if (!data) throw new BadRequestException('O Produto não existe');

        return data;
    }

    async update(product: string, updateProductDto: UpdateProductDto, userId: number) {

        const productExist = await this.prismaService.product.findUnique({ where: { product }, include: { ProductPrice: true } });

        if (!productExist) throw new BadRequestException('Prodcut not exist');

        const { productPrice, ...data } = updateProductDto;

        const resultUpdate = await this.prismaService.product.update({
            where: { product },
            data: {
                ...data,
                ProductPrice: {
                    update: {
                        ...productPrice
                    }
                }
            },
            include: { ProductPrice: true }
        })

        if (resultUpdate) {
            await this.productLogsService.createLogProductsPrice(productExist.ProductPrice, resultUpdate.ProductPrice, userId);
        }
    }
}
