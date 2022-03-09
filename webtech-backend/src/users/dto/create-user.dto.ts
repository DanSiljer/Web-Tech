import { IsBoolean, IsByteLength, IsEmail, IsOptional, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Senha muito fraca',
    })
    password: string;

    @ApiProperty({
        examples: ['0', '1']
    })
    @IsOptional()
    @IsByteLength(0, 1)
    admin?: string;

    @IsBoolean()
    @IsOptional()
    deleted?: boolean

    @IsOptional()
    createdAt?: Date;

    @IsOptional()
    updateAt?: Date;
}
