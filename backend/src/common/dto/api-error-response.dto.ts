import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'An error has occurred because reasons.' })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
