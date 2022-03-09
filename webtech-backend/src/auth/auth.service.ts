import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string) {
        const user = await this.prismaService.user.findUnique({ where: { email } });

        if (user && !user.deleted) {
            const comparePassword = compareSync(pass, user.password);
            if (comparePassword) {
                const { password, ...result } = user;
                return result;
            }
        }
        return null
    }

    async login(user: any) {
        const payload = { id: user.id, email: user.email, name: user.name, admin: user.admin };
        return {
            token: this.jwtService.sign(payload),
        }
    }

    async profile(userId: number) {
        const user = await this.prismaService.user.findUnique({ where: { id: userId } });

        if (!user) {
            throw new BadRequestException();
        }

        const { password, ...result } = user;

        return result;
    }
}
