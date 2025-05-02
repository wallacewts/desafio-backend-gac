import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class AuthService {
  @Inject()
  private readonly usuarioService: UsuarioService;
  @Inject()
  private readonly jwtService: JwtService;

  async logIn(email: string, pass: string): Promise<any> {
    const user = await this.usuarioService.findOneByEmail(email);
    const passwordMatch = await compare(pass, user?.senha ?? '');

    if (!user || !passwordMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const { senha: _, ...result } = user;

    return {
      access_token: await this.jwtService.signAsync(result),
    };
  }
}
