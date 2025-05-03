import { IsNotEmpty, IsUUID } from 'class-validator';

export class ReverterDTO {
  @IsNotEmpty()
  @IsUUID()
  idTransacao: string;
}
