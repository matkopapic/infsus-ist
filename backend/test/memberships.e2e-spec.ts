import { ConflictException, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { MembershipsController } from '../src/memberships/memberships.controller';
import { MembershipsMapper } from '../src/memberships/memberships.mapper';
import { MembershipsService } from '../src/memberships/memberships.service';

describe('Memberships module (e2e)', () => {
  let app: INestApplication;
  let service: jest.Mocked<MembershipsService>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [MembershipsController],
      providers: [
        MembershipsMapper,
        {
          provide: MembershipsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();

    service = moduleFixture.get(MembershipsService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/v1/memberships returns the mapped list payload', async () => {
    service.findAll.mockResolvedValue({
      data: [
        {
          membershipId: 'membership-1',
          name: 'Standard 1 month',
          durationInDays: 30,
          price: 30,
        },
      ],
      total: 1,
    } as never);

    await request(app.getHttpServer())
      .get('/api/v1/memberships')
      .expect(200)
      .expect({
        data: [
          {
            membershipId: 'membership-1',
            name: 'Standard 1 month',
            durationInDays: 30,
            price: 30,
          },
        ],
        total: 1,
      });
  });

  it('POST /api/v1/memberships returns 409 for duplicate membership names', async () => {
    service.create.mockRejectedValue(
      new ConflictException('Članstvo s tim nazivom već postoji'),
    );

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
