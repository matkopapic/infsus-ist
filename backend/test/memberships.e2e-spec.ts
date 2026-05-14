import { INestApplication, RequestMethod, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  applyTestDatabaseEnv,
  ensureTestDatabaseExists,
  resetTestDatabase,
} from './utils/postgres-test-db';

describe('Memberships module (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    applyTestDatabaseEnv();
    await ensureTestDatabaseExists();
  });

  beforeEach(async () => {
    await resetTestDatabase();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1', {
      exclude: [{ path: '/api', method: RequestMethod.GET }],
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/v1/memberships returns the mapped list payload', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/memberships')
      .expect(200)
      .expect(({ body }) => {
        expect(body.total).toBe(2);
        expect(body.data).toHaveLength(2);
        expect(body.data[0]).toMatchObject({
          name: 'Standard 1 month',
          durationInDays: 30,
          price: 30,
        });
        expect(body.data[1]).toMatchObject({
          name: 'Standard 1 year',
          durationInDays: 365,
          price: 270,
        });
      });

    expect(response.body.data[0].membershipId).toBeTruthy();
    expect(response.body.data[1].membershipId).toBeTruthy();
  });

  it('POST /api/v1/memberships returns 409 for duplicate membership names', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/memberships')
      .send({ name: 'Standard 1 month', durationInDays: 30, price: 30 })
      .expect(409)
      .expect({
        statusCode: 409,
        message: 'Članstvo s tim nazivom već postoji',
        error: 'Conflict',
      });
  });
});
