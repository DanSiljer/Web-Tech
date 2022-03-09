import { Injectable } from "@nestjs/common";
import { ProductPrice } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductLogsService {
    constructor(private readonly prismaService: PrismaService) { }

    async get(gte?: Date, lte?: Date, alterFieldId?: number, productId?: string, userId?: number) {
        try {

            const parseIntField = alterFieldId ? Number(alterFieldId) : undefined;
            const parseIntUser = userId ? Number(userId) : undefined;
            const getLogs = await this.prismaService.logProductsPrice.findMany({
                where: {
                    AND: [
                        { alterFieldId: parseIntField },
                        { productId },
                        { userId: parseIntUser },
                        {
                            createdAt: {
                                gte
                            }
                        },
                        {
                            createdAt: {
                                lte
                            }
                        }
                    ],
                },
                include: {
                    logProductPriceField: true,
                    user: {
                        select: {
                            name: true
                        }
                    }
                }
            });

            return getLogs;
        } catch (error) {
            console.log(error);
        }
    }

    async createLogProductsPrice(productPriceOriginal: ProductPrice, productPriceUpdate: ProductPrice, userId: number): Promise<void> {

        const { productProduct: productId } = productPriceOriginal;
        const { id: productPriceId } = productPriceOriginal;

        const { price1 } = productPriceOriginal;
        const { price1: newPrice1 } = productPriceUpdate;

        const { discountPromotion } = productPriceOriginal;
        const { discountPromotion: newDiscountPromotion } = productPriceUpdate;

        const { priceLiquid } = productPriceOriginal;
        const { priceLiquid: newPriceLiquid } = productPriceUpdate;

        const { discountLimit } = productPriceOriginal;
        const { discountLimit: newDiscountLimit } = productPriceUpdate;

        if (+price1 !== +newPrice1) {
            await this.prismaService.logProductsPrice.create({
                data: {
                    alterFieldId: 1,
                    originalValue: price1,
                    newValue: newPrice1,
                    productId,
                    productPriceId,
                    userId
                }
            })
        }

        if (+discountPromotion !== +newDiscountPromotion) {
            await this.prismaService.logProductsPrice.create({
                data: {
                    alterFieldId: 2,
                    originalValue: discountPromotion,
                    newValue: newDiscountPromotion,
                    productId,
                    productPriceId,
                    userId
                }
            })
        }

        if (+priceLiquid !== +newPriceLiquid) {
            await this.prismaService.logProductsPrice.create({
                data: {
                    alterFieldId: 3,
                    originalValue: priceLiquid,
                    newValue: newPriceLiquid,
                    productId,
                    productPriceId,
                    userId
                }
            })
        }

        if (+discountLimit !== +newDiscountLimit) {
            await this.prismaService.logProductsPrice.create({
                data: {
                    alterFieldId: 4,
                    originalValue: discountLimit,
                    newValue: newDiscountLimit,
                    productId,
                    productPriceId,
                    userId
                }
            })
        }
    }
}
