import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
import { CreateHallDto } from './dto/create-hall.dto.js';
import { HallsService } from './halls.service.js';

@ApiTags('halls')
@Controller('halls')
export class HallsController {
  constructor(private readonly hallsService: HallsService) {}

  @Post()
  @ApiOperation({ summary: 'Додати зал' })
  @ApiCreatedResponse({ description: 'Зал створено' })
  @ApiBadRequestResponse({ description: 'Некоректні поля' })
  @ApiConflictResponse({ description: 'Назва залу вже використовується' })
  create(@Body() dto: CreateHallDto) {
    return this.hallsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати список залів' })
  @ApiOkResponse({ description: 'Список залів' })
  findAll() {
    return this.hallsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати зал зі списком місць' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Зал і всі його місця' })
  @ApiBadRequestResponse({ description: 'ID має бути UUID v4' })
  @ApiNotFoundResponse({ description: 'Зал не знайдено' })
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.hallsService.findWithSeats(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Видалити зал' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Зал видалено' })
  @ApiBadRequestResponse({ description: 'ID має бути UUID v4' })
  @ApiNotFoundResponse({ description: 'Зал не знайдено' })
  @ApiConflictResponse({ description: 'Зал використовується в сеансі' })
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): void {
    this.hallsService.remove(id);
  }
}
