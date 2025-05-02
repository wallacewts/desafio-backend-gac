import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';

@Entity({ name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: 60, nullable: false })
  nome!: string;

  @Column('varchar', { length: 100, nullable: false, unique: true })
  email!: string;

  @Column('varchar', {
    length: 100,
    nullable: false,
    select: false,
  })
  senha!: string;

  @Column('numeric', {
    nullable: false,
    select: false,
    default: 0,
    precision: 16,
    scale: 4,
  })
  saldo!: string;

  constructor(createUsuarioDto: CreateUsuarioDto | UpdateUsuarioDto) {
    Object.assign(this, createUsuarioDto);
  }
}
