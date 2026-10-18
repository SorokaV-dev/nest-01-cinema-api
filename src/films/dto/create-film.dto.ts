import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateFilmDto {
  @ApiProperty({ example: 'Interstellar' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 169, minimum: 1 })
  @IsInt()
  @Min(1)
  durationMinutes!: number;

  @ApiProperty({ example: 2014 })
  @IsInt()
  releaseYear!: number;
}
