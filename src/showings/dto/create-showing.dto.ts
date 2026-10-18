import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsUUID, Min } from 'class-validator';

export class CreateShowingDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID('4')
  filmId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID('4')
  hallId!: string;

  @ApiProperty({ example: '2035-01-01T18:00:00.000Z', format: 'date-time' })
  @IsDateString()
  startsAt!: string;

  @ApiProperty({ example: 15000, description: 'Ціна в копійках', minimum: 1 })
  @IsInt()
  @Min(1)
  price!: number;
}
