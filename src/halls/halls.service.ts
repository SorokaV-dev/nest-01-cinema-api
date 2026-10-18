import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { CreateHallDto } from './dto/create-hall.dto.js';
import type { Hall, HallWithSeats, SeatPosition } from './hall.interface.js';
import { ShowingsService } from '../showings/showings.service.js';

@Injectable()
export class HallsService {
  private readonly halls: Hall[] = [];

  constructor(
    @Inject(forwardRef(() => ShowingsService))
    private readonly showingsService: Pick<ShowingsService, 'usesHall'>,
  ) {}

  create(dto: CreateHallDto): Hall {
    const name = dto.name.trim();
    if (this.halls.some((hall) => hall.name === name)) {
      throw new ConflictException(`Зал з назвою "${name}" уже існує`);
    }

    const hall: Hall = { id: randomUUID(), ...dto, name };
    this.halls.push(hall);
    return { ...hall };
  }

  findAll(): Hall[] {
    return this.halls.map((hall) => ({ ...hall }));
  }

  findById(id: string): Hall {
    return { ...this.requireHall(id) };
  }

  has(id: string): boolean {
    return this.halls.some((hall) => hall.id === id);
  }

  findWithSeats(id: string): HallWithSeats {
    const hall = this.findById(id);
    return { ...hall, seats: this.createSeatMap(hall) };
  }

  getSeats(id: string): SeatPosition[] {
    return this.createSeatMap(this.findById(id));
  }

  remove(id: string): void {
    const hall = this.requireHall(id);
    if (this.showingsService.usesHall(id)) {
      throw new ConflictException('Зал використовується в сеансі');
    }
    this.halls.splice(this.halls.indexOf(hall), 1);
  }

  private requireHall(id: string): Hall {
    const hall = this.halls.find((item) => item.id === id);
    if (!hall) throw new NotFoundException(`Зал ${id} не знайдено`);
    return hall;
  }

  private createSeatMap(hall: Hall): SeatPosition[] {
    return Array.from({ length: hall.rows * hall.seatsPerRow }, (_, index) => ({
      row: Math.floor(index / hall.seatsPerRow) + 1,
      seat: (index % hall.seatsPerRow) + 1,
    }));
  }
}
