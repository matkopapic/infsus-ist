import { Repository } from 'typeorm';
import { MemberMembership } from '../database/entities/MemberMembership';
import { Membership } from '../database/entities/Membership';
import { MembershipsRepository } from './memberships.repository';

type QueryBuilderMock = {
  andWhere: jest.Mock;
  orderBy: jest.Mock;
  skip: jest.Mock;
  take: jest.Mock;
  getManyAndCount: jest.Mock;
  innerJoin: jest.Mock;
  where: jest.Mock;
  getCount: jest.Mock;
};

const createQueryBuilderMock = (): QueryBuilderMock => {
  const queryBuilder = {
    andWhere: jest.fn(),
    orderBy: jest.fn(),
    skip: jest.fn(),
    take: jest.fn(),
    getManyAndCount: jest.fn(),
    innerJoin: jest.fn(),
    where: jest.fn(),
    getCount: jest.fn(),
  } as QueryBuilderMock;

  queryBuilder.andWhere.mockReturnValue(queryBuilder);
  queryBuilder.orderBy.mockReturnValue(queryBuilder);
  queryBuilder.skip.mockReturnValue(queryBuilder);
  queryBuilder.take.mockReturnValue(queryBuilder);
  queryBuilder.innerJoin.mockReturnValue(queryBuilder);
  queryBuilder.where.mockReturnValue(queryBuilder);

  return queryBuilder;
};

describe('MembershipsRepository', () => {
  let repository: MembershipsRepository;
  let membershipsRepository: jest.Mocked<Repository<Membership>>;
  let memberMembershipsRepository: jest.Mocked<Repository<MemberMembership>>;

  beforeEach(() => {
    membershipsRepository = {
      createQueryBuilder: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<Membership>>;

    memberMembershipsRepository = {
      createQueryBuilder: jest.fn(),
    } as unknown as jest.Mocked<Repository<MemberMembership>>;

    repository = new MembershipsRepository(
      membershipsRepository,
      memberMembershipsRepository,
    );
  });

  it('builds a paginated search query for memberships', async () => {
    const queryBuilder = createQueryBuilderMock();
    queryBuilder.getManyAndCount.mockResolvedValue([[{ membershipId: '1' }], 1]);
    membershipsRepository.createQueryBuilder.mockReturnValue(queryBuilder as never);

    const result = await repository.findPaged({ search: 'standard', page: 2, limit: 10 });

    expect(membershipsRepository.createQueryBuilder).toHaveBeenCalledWith('membership');
    expect(queryBuilder.andWhere).toHaveBeenCalledWith('membership.name ILIKE :search', {
      search: '%standard%',
    });
    expect(queryBuilder.orderBy).toHaveBeenCalledWith('membership.name', 'ASC');
    expect(queryBuilder.skip).toHaveBeenCalledWith(10);
    expect(queryBuilder.take).toHaveBeenCalledWith(10);
    expect(result).toEqual({ data: [{ membershipId: '1' }], total: 1 });
  });

  it('builds the usage count query', async () => {
    const queryBuilder = createQueryBuilderMock();
    queryBuilder.getCount.mockResolvedValue(3);
    memberMembershipsRepository.createQueryBuilder.mockReturnValue(queryBuilder as never);

    const result = await repository.countUsages('membership-1');

    expect(memberMembershipsRepository.createQueryBuilder).toHaveBeenCalledWith(
      'memberMembership',
    );
    expect(queryBuilder.where).toHaveBeenCalledWith(
      'memberMembership.membership = :membershipId',
      { membershipId: 'membership-1' },
    );
    expect(result).toBe(3);
  });

  it('delegates findByName to TypeORM repository', async () => {
    const membership = { membershipId: '1', name: 'Standard' } as Membership;
    membershipsRepository.findOneBy.mockResolvedValue(membership as never);

    await expect(repository.findByName('Standard')).resolves.toBe(membership);
    expect(membershipsRepository.findOneBy).toHaveBeenCalledWith({ name: 'Standard' });
  });
});
