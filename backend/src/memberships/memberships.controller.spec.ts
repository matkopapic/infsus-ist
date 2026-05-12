import { Test, TestingModule } from '@nestjs/testing';
import { MembershipsController } from './memberships.controller';
import { MembershipsMapper } from './memberships.mapper';
import { MembershipsService } from './memberships.service';

describe('MembershipsController', () => {
  let controller: MembershipsController;
  let service: jest.Mocked<MembershipsService>;
  let mapper: jest.Mocked<MembershipsMapper>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembershipsController],
      providers: [
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
        {
          provide: MembershipsMapper,
          useValue: {
            toListResponseDto: jest.fn(),
            toResponseDto: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(MembershipsController);
    service = module.get(MembershipsService);
    mapper = module.get(MembershipsMapper);
  });

  it('maps paginated membership list responses', async () => {
    const result = {
      data: [{ membershipId: '1', name: 'Standard', durationInDays: 30, price: 30 }],
      total: 1,
    };
    const mapped = {
      data: [{ membershipId: '1', name: 'Standard', durationInDays: 30, price: 30 }],
      total: 1,
    };

    service.findAll.mockResolvedValue(result as never);
    mapper.toListResponseDto.mockReturnValue(mapped as never);

    await expect(controller.findAll({ page: 1, limit: 25 })).resolves.toBe(mapped);
    expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 25 });
    expect(mapper.toListResponseDto).toHaveBeenCalledWith(result.data, result.total);
  });

  it('maps single membership responses', async () => {
    const membership = {
      membershipId: '1',
      name: 'Standard',
      durationInDays: 30,
      price: 30,
    };
    const mapped = {
      membershipId: '1',
      name: 'Standard',
      durationInDays: 30,
      price: 30,
    };

    service.findOne.mockResolvedValue(membership as never);
    mapper.toResponseDto.mockReturnValue(mapped as never);

    await expect(controller.findOne('1')).resolves.toBe(mapped);
    expect(service.findOne).toHaveBeenCalledWith('1');
    expect(mapper.toResponseDto).toHaveBeenCalledWith(membership);
  });

  it('maps created membership responses', async () => {
    const body = { name: 'Premium', durationInDays: 365, price: 270 };
    const membership = { membershipId: '2', ...body };
    const mapped = { membershipId: '2', ...body };

    service.create.mockResolvedValue(membership as never);
    mapper.toResponseDto.mockReturnValue(mapped as never);

    await expect(controller.create(body)).resolves.toBe(mapped);
    expect(service.create).toHaveBeenCalledWith(body);
    expect(mapper.toResponseDto).toHaveBeenCalledWith(membership);
  });
});
