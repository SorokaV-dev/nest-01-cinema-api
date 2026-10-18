export interface Showing {
  id: string;
  filmId: string;
  hallId: string;
  startsAt: string;
  price: number;
}

export interface ShowingResponse extends Omit<Showing, 'filmId' | 'hallId'> {
  filmName: string;
  hallName: string;
}
