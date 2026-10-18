import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { SeatDto } from './seat.dto.js';

export class CreateBookingDto {
  @ApiProperty({ type: [SeatDto], example: [{ row: 3, seat: 5 }] })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique((position: SeatDto) => `${position.row}:${position.seat}`)
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  seats!: SeatDto[];
}
