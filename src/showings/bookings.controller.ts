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
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@ApiTags('bookings')
@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('bookings')
  @ApiOperation({ summary: 'Отримати всі бронювання' })
  @ApiOkResponse({ description: 'Список бронювань або порожній масив' })
  findAll() {
    return this.bookingsService.findAll();
  }

  @Post('showings/:showingId/bookings')
  @ApiOperation({ summary: 'Забронювати місця на сеансі' })
  @ApiParam({ name: 'showingId', format: 'uuid' })
  @ApiCreatedResponse({ description: 'Бронювання створено' })
  @ApiBadRequestResponse({
    description: 'Порожній список, некоректні або недоступні місця',
  })
  @ApiNotFoundResponse({ description: 'Сеанс не знайдено' })
  @ApiConflictResponse({
    description: 'Одне або кілька місць уже заброньовані',
  })
  create(
    @Param('showingId', new ParseUUIDPipe({ version: '4' })) showingId: string,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.create(showingId, dto);
  }

  @Get('showings/:showingId/bookings')
  @ApiOperation({ summary: 'Отримати бронювання сеансу' })
  @ApiParam({ name: 'showingId', format: 'uuid' })
  @ApiOkResponse({ description: 'Список бронювань або порожній масив' })
  @ApiBadRequestResponse({ description: 'ID має бути UUID v4' })
  @ApiNotFoundResponse({ description: 'Сеанс не знайдено' })
  findForShowing(
    @Param('showingId', new ParseUUIDPipe({ version: '4' })) showingId: string,
  ) {
    return this.bookingsService.findForShowing(showingId);
  }

  @Delete('bookings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Скасувати бронювання' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Бронювання скасовано' })
  @ApiBadRequestResponse({ description: 'ID має бути UUID v4' })
  @ApiNotFoundResponse({ description: 'Бронювання не знайдено' })
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): void {
    this.bookingsService.remove(id);
  }
}
