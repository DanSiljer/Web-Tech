import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashSync } from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(user: Prisma.UserCreateInput): Promise<void> {
    const userExist = await this.prismaService.user.findUnique({
      where: {
        email: user.email
      }
    })

    if (userExist) throw new ConflictException("Este email já existe");

    const password = hashSync(user.password, 10);

    await this.prismaService.user.create({ data: { ...user, password } })
  }

  async findAll(): Promise<any> {
    return await this.prismaService.user.findMany({
      select:
      {
        id: true,
        name: true,
        email: true,
        admin: true,
        deleted: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findFirst({
      where: { id: id }
    })

    if (!user) throw new BadRequestException("Usuário não existe")

    const { password, ...result } = user;

    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.prismaService.user.findUnique({ where: { id } })

    if (!user) throw new BadRequestException("Usuário não existe")

    await this.prismaService.user.update({ data: { ...updateUserDto }, where: { id } })
  }

  async remove(id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException("Usuário não existe");
    await this.prismaService.user.update({ where: { id }, data: { deleted: true } })
  }
}
