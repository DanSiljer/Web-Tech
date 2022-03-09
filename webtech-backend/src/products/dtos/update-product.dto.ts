import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { CreateProductDto } from "./create-product.dto";
import { UpdateProductPriceDto } from "./update-product-price.dto";

export class UpdateProductDto extends PartialType(OmitType(CreateProductDto, ['productPrice'])) {

    @ValidateNested()
    @Type(() => UpdateProductPriceDto)
    productPrice: UpdateProductPriceDto;
}