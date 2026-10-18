import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateFilmDto } from './dto/create-film.dto.js';
import { UpdateFilmDto } from './dto/update-film.dto.js';
import type { Film } from './film.interface.js';
import { ShowingsService } from '../showings/showings.service.js';

@Injectable()
export class FilmsService {
  private readonly films: Film[] = [];

  constructor(
    @Inject(forwardRef(() => ShowingsService))
    private readonly showingsService: Pick<ShowingsService, 'usesFilm'>,
  ) {}

  create(dto: CreateFilmDto): Film {
    const film: Film = { id: randomUUID(), ...dto };
    this.films.push(film);
    return { ...film };
  }

  findAll(): Film[] {
    return this.films.map((film) => ({ ...film }));
  }

  findById(id: string): Film {
    return { ...this.requireFilm(id) };
  }

  has(id: string): boolean {
    return this.films.some((film) => film.id === id);
  }

  update(id: string, dto: UpdateFilmDto): Film {
    const film = this.requireFilm(id);
    Object.assign(film, dto);
    return { ...film };
  }

  remove(id: string): void {
    const film = this.requireFilm(id);
    if (this.showingsService.usesFilm(id)) {
      throw new ConflictException('Фільм використовується в сеансі');
    }
    this.films.splice(this.films.indexOf(film), 1);
  }

  private requireFilm(id: string): Film {
    const film = this.films.find((item) => item.id === id);
    if (!film) throw new NotFoundException(`Фільм ${id} не знайдено`);
    return film;
  }
}
