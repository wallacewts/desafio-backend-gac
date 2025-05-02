import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {} from 'express';
import { Usuario } from 'src/usuario/entity/usuario.entity';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LogInDTO } from './dto/log-in.dto';

@Controller('auth')
export class AuthController {
  @Inject()
  private readonly authService: AuthService;

  @Post('login')
  logIn(@Body() logInDTO: LogInDTO) {
    return this.authService.logIn(logInDTO.email, logInDTO.senha);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: Request & { usuario: Usuario }) {
    return req.usuario;
  }
}
