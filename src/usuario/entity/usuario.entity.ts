import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Transacao } from '../../transacao/entity/transacao.entity';

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
  })
  senha!: string;

  @Column('numeric', {
    nullable: false,
    default: 0,
    precision: 16,
    scale: 4,
  })
  saldo!: string;

  @OneToMany(() => Transacao, (transacao) => transacao.remetente)
  transferencias: Transacao[];

  @OneToMany(() => Transacao, (transacao) => transacao.destinatario)
  recebimentos: Transacao[];
}
