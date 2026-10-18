import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service.js';
import { CreateShowingDto } from './dto/create-showing.dto.js';
import { FindShowingsQueryDto } from './dto/find-showings-query.dto.js';
import { ShowingsService } from './showings.service.js';

@ApiTags('showings')
@Controller('showings')
export class ShowingsController {
  constructor(
    private readonly showingsService: ShowingsService,
    private readonly bookingsService: BookingsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Створити сеанс' })
  @ApiCreatedResponse({ description: 'Сеанс створено' })
  @ApiBadRequestResponse({
    description: 'Некоректна дата, ціна або ID фільму/залу',
  })
  create(@Body() dto: CreateShowingDto) {
    return this.showingsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати сеанси з фільтрами' })
  @ApiQuery({ name: 'filmId', required: false, format: 'uuid' })
  @ApiQuery({ name: 'date', required: false, example: '2035-01-01' })
  @ApiOkResponse({ description: 'Список сеансів у стабільному порядку' })
  @ApiBadRequestResponse({ description: 'Некоректний фільтр' })
  findAll(@Query() filters: FindShowingsQueryDto) {
    return this.showingsService.findAll(filters);
  }

  @Get(':id/seats')
  @ApiOperation({ summary: 'Перевірити стан місць на сеансі' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Місця з ознакою isBooked' })
  @ApiBadRequestResponse({ description: 'ID має бути UUID v4' })
  @ApiNotFoundResponse({ description: 'Сеанс або зал не знайдено' })
  getSeats(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.bookingsService.getSeatStatuses(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати сеанс за ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Сеанс із назвами фільму та залу' })
  @ApiBadRequestResponse({ description: 'ID має бути UUID v4' })
  @ApiNotFoundResponse({ description: 'Сеанс не знайдено' })
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.showingsService.findById(id);
  }
}
