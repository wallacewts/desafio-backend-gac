import { PartialType } from '@nestjs/mapped-types';

import { CreateUsuarioDTO } from './create-usuario.dto';

export class UpdateUsuarioDTO extends PartialType(CreateUsuarioDTO) {}
