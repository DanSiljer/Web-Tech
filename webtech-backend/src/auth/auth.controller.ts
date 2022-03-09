import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('authentication')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post('auth/login')
    @ApiOperation({
        summary: 'Fazer login com um usuário e gerar um token'
      })
    async login(@Request() req) {
        return await this.authService.login(req.user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    @ApiOperation({
        summary: 'Retornar o usuário logado'
      })
      @ApiBearerAuth()
    async profile(@Request() req) {
        return await this.authService.profile(req.user?.id);
    }
}