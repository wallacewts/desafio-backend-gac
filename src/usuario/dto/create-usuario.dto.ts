import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @MaxLength(60)
  nome!: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @IsEmail()
  @MaxLength(100)
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  senha!: string;
}
