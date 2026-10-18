import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateFilmDto } from './dto/create-film.dto.js';
import { UpdateFilmDto } from './dto/update-film.dto.js';
import { FilmsService } from './films.service.js';

@ApiTags('films')
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  @ApiOperation({ summary: 'Додати фільм' })
  @ApiCreatedResponse({ description: 'Фільм створено' })
  @ApiBadRequestResponse({ description: 'Некоректні або відсутні поля' })
  create(@Body() dto: CreateFilmDto) {
    return this.filmsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати список фільмів' })
  @ApiOkResponse({ description: 'Список фільмів' })
  findAll() {
    return this.filmsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати фільм за ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Фільм знайдено' })
  @ApiBadRequestResponse({ description: 'ID має бути UUID v4' })
  @ApiNotFoundResponse({ description: 'Фільм не знайдено' })
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.filmsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити поля фільму' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Фільм оновлено' })
  @ApiBadRequestResponse({ description: 'Некоректний тип поля' })
  @ApiNotFoundResponse({ description: 'Фільм не знайдено' })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateFilmDto,
  ) {
    return this.filmsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Видалити фільм' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Фільм видалено' })
  @ApiBadRequestResponse({ description: 'ID має бути UUID v4' })
  @ApiNotFoundResponse({ description: 'Фільм не знайдено' })
  @ApiConflictResponse({ description: 'Фільм використовується в сеансі' })
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): void {
    this.filmsService.remove(id);
  }
}
