import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateUsuarioDTO } from './dto/create-usuario.dto';
import { Usuario } from './entity/usuario.entity';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {
  @Inject()
  private readonly usuarioService: UsuarioService;

  @Post()
  async create(
    @Body() body: CreateUsuarioDTO,
  ): Promise<Omit<Usuario, 'senha'>> {
    return this.usuarioService.create(body);
  }
}
