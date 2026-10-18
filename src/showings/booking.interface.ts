import type { SeatPosition } from '../halls/hall.interface.js';

export interface Booking {
  id: string;
  showingId: string;
  seats: SeatPosition[];
  totalPrice: number;
}

export interface SeatStatus extends SeatPosition {
  isBooked: boolean;
}
