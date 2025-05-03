import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entity/usuario.entity';

@Entity({ name: 'transacao' })
export class Transacao {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.transferencias, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'idRemetente' })
  remetente!: Usuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.recebimentos, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'idDestinatario' })
  destinatario!: Usuario;

  @Column('numeric', {
    nullable: false,
    default: 0,
    precision: 16,
    scale: 4,
  })
  valor!: string;

  @CreateDateColumn()
  criadoEm: Date;
}
