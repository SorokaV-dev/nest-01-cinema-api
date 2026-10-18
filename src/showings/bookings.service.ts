import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { HallsService } from '../halls/halls.service.js';
import type { SeatPosition } from '../halls/hall.interface.js';
import type { CreateBookingDto } from './dto/create-booking.dto.js';
import type { Booking, SeatStatus } from './booking.interface.js';
import { ShowingsService } from './showings.service.js';

@Injectable()
export class BookingsService {
  private readonly bookings: Booking[] = [];

  constructor(
    private readonly showingsService: ShowingsService,
    private readonly hallsService: HallsService,
  ) {}

  findAll(): Booking[] {
    return this.bookings.map((booking) => this.copyBooking(booking));
  }

  create(showingId: string, dto: CreateBookingDto): Booking {
    const showing = this.showingsService.findRawById(showingId);
    const hall = this.hallsService.findById(showing.hallId);
    const seats = dto.seats.map(({ row, seat }) => ({ row, seat }));

    if (seats.length === 0) {
      throw new BadRequestException('Потрібно вказати хоча б одне місце');
    }

    for (const position of seats) {
      if (position.row > hall.rows || position.seat > hall.seatsPerRow) {
        throw new BadRequestException(
          `Місце ${position.row}:${position.seat} не існує в цьому залі`,
        );
      }
      if (this.isBooked(showingId, position)) {
        throw new ConflictException(
          `Місце ${position.row}:${position.seat} уже заброньоване`,
        );
      }
    }

    const booking: Booking = {
      id: randomUUID(),
      showingId,
      seats,
      totalPrice: seats.length * showing.price,
    };
    this.bookings.push(booking);
    return this.copyBooking(booking);
  }

  findForShowing(showingId: string): Booking[] {
    this.showingsService.findRawById(showingId);
    return this.bookings
      .filter((booking) => booking.showingId === showingId)
      .map((booking) => this.copyBooking(booking));
  }

  getSeatStatuses(showingId: string): SeatStatus[] {
    const showing = this.showingsService.findRawById(showingId);
    return this.hallsService.getSeats(showing.hallId).map((position) => ({
      ...position,
      isBooked: this.isBooked(showingId, position),
    }));
  }

  remove(id: string): void {
    const index = this.bookings.findIndex((booking) => booking.id === id);
    if (index === -1)
      throw new NotFoundException(`Бронювання ${id} не знайдено`);
    this.bookings.splice(index, 1);
  }

  private isBooked(showingId: string, position: SeatPosition): boolean {
    return this.bookings.some(
      (booking) =>
        booking.showingId === showingId &&
        booking.seats.some(
          (seat) => seat.row === position.row && seat.seat === position.seat,
        ),
    );
  }

  private copyBooking(booking: Booking): Booking {
    return { ...booking, seats: booking.seats.map((seat) => ({ ...seat })) };
  }
}
