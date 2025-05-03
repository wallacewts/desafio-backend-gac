import { IsNotEmpty, IsNumberString, IsUUID } from 'class-validator';

export class TransferirDTO {
  @IsNotEmpty()
  @IsUUID()
  idDestinatario: string;

  @IsNotEmpty()
  @IsNumberString()
  valor: string;
}
