import { forwardRef, Module } from '@nestjs/common';
import { FilmsModule } from '../films/films.module.js';
import { HallsModule } from '../halls/halls.module.js';
import { BookingsController } from './bookings.controller.js';
import { BookingsService } from './bookings.service.js';
import { ShowingsController } from './showings.controller.js';
import { ShowingsService } from './showings.service.js';

@Module({
  imports: [forwardRef(() => FilmsModule), forwardRef(() => HallsModule)],
  controllers: [ShowingsController, BookingsController],
  providers: [ShowingsService, BookingsService],
  exports: [ShowingsService],
})
export class ShowingsModule {}
