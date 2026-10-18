import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';

describe('Cinema API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /films returns a collection', () => {
    return request(app.getHttpServer())
      .get('/films')
      .expect(200)
      .expect((response) => expect(Array.isArray(response.body)).toBe(true));
  });

  afterEach(async () => {
    await app?.close();
  });
});
