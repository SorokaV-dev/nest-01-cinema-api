import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min, ValidateIf } from 'class-validator';

export class UpdateFilmDto {
  @ApiPropertyOptional({ example: 'Interstellar' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({ example: 169, minimum: 1 })
  @ValidateIf((_object, value) => value !== undefined)
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @ApiPropertyOptional({ example: 2014 })
  @ValidateIf((_object, value) => value !== undefined)
  @IsInt()
  releaseYear?: number;
}
