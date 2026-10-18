import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FilmsService } from '../films/films.service.js';
import { HallsService } from '../halls/halls.service.js';
import type { FindShowingsQueryDto } from './dto/find-showings-query.dto.js';
import type { CreateShowingDto } from './dto/create-showing.dto.js';
import type { Showing, ShowingResponse } from './showing.interface.js';

@Injectable()
export class ShowingsService {
  private readonly showings: Showing[] = [];

  constructor(
    @Inject(forwardRef(() => FilmsService))
    private readonly filmsService: Pick<FilmsService, 'has' | 'findById'>,
    @Inject(forwardRef(() => HallsService))
    private readonly hallsService: Pick<HallsService, 'has' | 'findById'>,
  ) {}

  create(dto: CreateShowingDto): ShowingResponse {
    if (!this.filmsService.has(dto.filmId)) {
      throw new BadRequestException(`Фільм ${dto.filmId} не існує`);
    }
    if (!this.hallsService.has(dto.hallId)) {
      throw new BadRequestException(`Зал ${dto.hallId} не існує`);
    }
    const film = this.filmsService.findById(dto.filmId);
    const hall = this.hallsService.findById(dto.hallId);
    const start = new Date(dto.startsAt);

    if (Number.isNaN(start.getTime())) {
      throw new BadRequestException(
        'startsAt має бути коректною датою ISO 8601',
      );
    }
    if (start.getTime() <= Date.now()) {
      throw new BadRequestException('Дата сеансу має бути в майбутньому');
    }

    const showing: Showing = {
      id: randomUUID(),
      filmId: film.id,
      hallId: hall.id,
      startsAt: start.toISOString(),
      price: dto.price,
    };
    this.showings.push(showing);
    return this.toResponse(showing);
  }

  findAll(filters: FindShowingsQueryDto): ShowingResponse[] {
    let results = [...this.showings];

    if (filters.filmId) {
      results = results.filter((showing) => showing.filmId === filters.filmId);
    }
    if (filters.date) {
      const day = new Date(`${filters.date}T00:00:00.000Z`);
      if (
        Number.isNaN(day.getTime()) ||
        day.toISOString().slice(0, 10) !== filters.date
      ) {
        throw new BadRequestException(
          'date має бути реальною датою у форматі YYYY-MM-DD',
        );
      }
      results = results.filter(
        (showing) => showing.startsAt.slice(0, 10) === filters.date,
      );
    }

    return results
      .sort((left, right) => {
        const byStart = left.startsAt.localeCompare(right.startsAt);
        return byStart || left.id.localeCompare(right.id);
      })
      .map((showing) => this.toResponse(showing));
  }

  findById(id: string): ShowingResponse {
    return this.toResponse(this.requireShowing(id));
  }

  findRawById(id: string): Showing {
    return { ...this.requireShowing(id) };
  }

  usesFilm(filmId: string): boolean {
    return this.showings.some((showing) => showing.filmId === filmId);
  }

  usesHall(hallId: string): boolean {
    return this.showings.some((showing) => showing.hallId === hallId);
  }

  private requireShowing(id: string): Showing {
    const showing = this.showings.find((item) => item.id === id);
    if (!showing) throw new NotFoundException(`Сеанс ${id} не знайдено`);
    return showing;
  }

  private toResponse(showing: Showing): ShowingResponse {
    const film = this.filmsService.findById(showing.filmId);
    const hall = this.hallsService.findById(showing.hallId);
    return {
      id: showing.id,
      startsAt: showing.startsAt,
      price: showing.price,
      filmName: film.title,
      hallName: hall.name,
    };
  }
}
