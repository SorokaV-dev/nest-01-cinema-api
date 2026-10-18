export interface SeatPosition {
  row: number;
  seat: number;
}

export interface Hall {
  id: string;
  name: string;
  rows: number;
  seatsPerRow: number;
}

export interface HallWithSeats extends Hall {
  seats: SeatPosition[];
}
