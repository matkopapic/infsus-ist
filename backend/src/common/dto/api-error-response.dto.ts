import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  @ApiProperty({ example: 409 })
  statusCode: number;

  @ApiProperty({ example: 'Trener već ima trening u tom terminu' })
  message: string;

  @ApiProperty({ example: 'Conflict' })
  error: string;
}
