import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUsuarioDTO } from './dto/create-usuario.dto';
import { Usuario } from './entity/usuario.entity';

@Injectable()
export class UsuarioService {
  @InjectRepository(Usuario)
  private readonly repository: Repository<Usuario>;

  async create({
    nome,
    email,
    senha,
  }: CreateUsuarioDTO): Promise<Omit<Usuario, 'senha'>> {
    const userAlreadyExists = await this.repository.findOneBy({
      email,
    });

    if (userAlreadyExists) {
      throw new BadRequestException('E-mail já cadastrado');
    }

    const passwordHash = await hash(senha, 8);

    const usuario = this.repository.create({
      nome,
      email,
      senha: passwordHash,
    });

    const { senha: _, ...result } = await this.repository.save(usuario);

    return result;
  }

  async findOneByEmail(email: string): Promise<Usuario | null> {
    return this.repository.findOneBy({ email });
  }
}
