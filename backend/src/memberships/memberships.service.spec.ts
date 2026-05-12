import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MembershipsRepository } from './memberships.repository';
import { MembershipsService } from './memberships.service';

describe('MembershipsService', () => {
  let service: MembershipsService;
  let repository: jest.Mocked<MembershipsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipsService,
        {
          provide: MembershipsRepository,
          useValue: {
            findPaged: jest.fn(),
            findById: jest.fn(),
            findByName: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            merge: jest.fn(),
            countActiveUsages: jest.fn(),
            deleteById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(MembershipsService);
    repository = module.get(MembershipsRepository);
  });

  it('throws when membership is missing', async () => {
    repository.findById.mockResolvedValue(null as never);

    await expect(service.findOne('missing-id')).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.findById).toHaveBeenCalledWith('missing-id');
  });

  it('throws conflict when creating a duplicate membership name', async () => {
    repository.findByName.mockResolvedValue({ membershipId: '1' } as never);

    await expect(
      service.create({ name: 'Standard', durationInDays: 30, price: 30 }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('throws conflict when deleting a membership that is in active use', async () => {
    repository.findById.mockResolvedValue({ membershipId: '1' } as never);
    repository.countActiveUsages.mockResolvedValue(2 as never);

    await expect(service.remove('1')).rejects.toBeInstanceOf(ConflictException);
    expect(repository.deleteById).not.toHaveBeenCalled();
  });
});
