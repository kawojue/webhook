import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BalanceDTO {
  @ApiProperty({
    example: 'SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM',
  })
  @IsString()
  @IsNotEmpty()
  address: string;
}