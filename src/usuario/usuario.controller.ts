import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {
  @Inject()
  private readonly usuarioService: UsuarioService;

  @Post()
  async create(@Body() body: CreateUsuarioDto) {
    await this.usuarioService.create(body);
  }
}
