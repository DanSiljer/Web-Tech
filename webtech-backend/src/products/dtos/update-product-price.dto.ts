import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsNumber, IsNumberString, IsPositive, IsString, Length, MaxLength, ValidateNested } from "class-validator";
import { CreateProductPriceDto } from "./create-product-price.dto";
import { UpdateProductDto } from "./update-product.dto";

export class UpdateProductPriceDto extends PartialType(CreateProductPriceDto) { }