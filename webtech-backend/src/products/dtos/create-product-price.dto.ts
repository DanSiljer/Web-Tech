import { IsDate, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Length, Max, MaxLength } from "class-validator";

export class CreateProductPriceDto {
    @IsNotEmpty()
    @IsNumberString()
    @MaxLength(2)
    codTabPriceId: string;

    @IsOptional()
    @IsString()
    @Length(12, 12)
    productProduct?: string;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    price1: number;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 5 })
    discountLimit: number;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 5 })
    discountPromotion: number;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    priceLiquid: number;

    @IsOptional()
    @IsDate()
    updatedAt?: Date;

    @IsOptional()
    @IsDate()
    createdAt?: Date;
}