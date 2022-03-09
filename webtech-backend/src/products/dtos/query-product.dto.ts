import { IsByteLength, IsNumberString, IsOptional, IsString } from "class-validator";

export class QueryProductDto {
    @IsOptional()
    @IsNumberString()
    skip?: number;

    @IsOptional()
    @IsNumberString()
    take?: number;

    @IsOptional()
    @IsString()
    @IsByteLength(0, 1)
    available?: string;

    @IsOptional()
    @IsNumberString()
    collection?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    grife?: string;
}