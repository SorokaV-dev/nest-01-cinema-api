export interface Showing {
  id: string;
  filmId: string;
  hallId: string;
  startsAt: string;
  price: number;
}

export interface ShowingResponse extends Showing {
  filmName: string;
  hallName: string;
}
