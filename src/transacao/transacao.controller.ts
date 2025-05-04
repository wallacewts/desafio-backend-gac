import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Usuario } from '../usuario/entity/usuario.entity';
import { TransferirDTO } from './dto/transferir.dto';
import { TransacaoService } from './transacao.service';

@Controller('transacao')
export class TransacaoController {
  @Inject()
  private readonly transacaoService: TransacaoService;

  @UseGuards(AuthGuard)
  @Post('transferir')
  transferir(
    @Body() transferirDTO: TransferirDTO,
    @Request() request: Request & { usuario: Usuario },
  ) {
    return this.transacaoService.transferir(transferirDTO, request.usuario.id);
  }

  @UseGuards(AuthGuard)
  @Delete('reverter/:id')
  reverter(
    @Param('id') id: string,
    @Request() request: Request & { usuario: Usuario },
  ) {
    return this.transacaoService.reverter(id, request.usuario.id);
  }
}
