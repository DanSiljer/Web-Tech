import { Type } from "class-transformer";
import { IsByteLength, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength, ValidateNested } from "class-validator";
import { CreateProductPriceDto } from "./create-product-price.dto";


export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    @Length(12, 12)
    product: string;

    @IsString()
    @Length(10, 100)
    name: string;

    @IsString()
    @Length(20, 1000)
    description: string;

    @IsString()
    @MaxLength(6)
    collection: string;

    @IsString()
    @MaxLength(25)
    grife: string;

    @IsString()
    @MaxLength(15)
    @IsOptional()
    category: string;

    @IsByteLength(0, 1)
    @Matches(/^0|1/, { message: 'available must contain 0 or 1' })
    available: string;

    @ValidateNested()
    @Type(() => CreateProductPriceDto)
    productPrice: CreateProductPriceDto;
}
