import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import { membershipsApi } from '../../../src/api/memberships.api';
import apiClient from '../../../src/api/client';

const mockedClient = apiClient as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe('membershipsApi (DAL)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('list', () => {
    it('salje GET /memberships sa query parametrima i vraca data', async () => {
      const response = {
        data: {
          data: [
            { membershipId: '1', name: 'Mjesecno', durationInDays: 30, price: 35 },
          ],
          total: 1,
        },
      };
      mockedClient.get.mockResolvedValueOnce(response);

      const result = await membershipsApi.list({ search: 'mj', page: 1, limit: 10 });

      expect(mockedClient.get).toHaveBeenCalledWith('/memberships', {
        params: { search: 'mj', page: 1, limit: 10 },
      });
      expect(result).toEqual(response.data);
    });

    it('koristi prazan query kada nije proslijedjen', async () => {
      mockedClient.get.mockResolvedValueOnce({ data: { data: [], total: 0 } });

      await membershipsApi.list();

      expect(mockedClient.get).toHaveBeenCalledWith('/memberships', {
        params: {},
      });
    });
  });

  describe('getById', () => {
    it('salje GET /memberships/:id', async () => {
      const membership = { membershipId: '42', name: 'Godisnje', durationInDays: 365, price: 300 };
      mockedClient.get.mockResolvedValueOnce({ data: membership });

      const result = await membershipsApi.getById('42');

      expect(mockedClient.get).toHaveBeenCalledWith('/memberships/42');
      expect(result).toEqual(membership);
    });
  });

  describe('create', () => {
    it('salje POST /memberships s payloadom', async () => {
      const payload = { name: 'Tjedno', durationInDays: 7, price: 12 };
      const created = { membershipId: '99', ...payload };
      mockedClient.post.mockResolvedValueOnce({ data: created });

      const result = await membershipsApi.create(payload);

      expect(mockedClient.post).toHaveBeenCalledWith('/memberships', payload);
      expect(result).toEqual(created);
    });
  });

  describe('update', () => {
    it('salje PUT /memberships/:id s djelomicnim payloadom', async () => {
      const payload = { price: 40 };
      const updated = { membershipId: '1', name: 'Mjesecno', durationInDays: 30, price: 40 };
      mockedClient.put.mockResolvedValueOnce({ data: updated });

      const result = await membershipsApi.update('1', payload);

      expect(mockedClient.put).toHaveBeenCalledWith('/memberships/1', payload);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('salje DELETE /memberships/:id', async () => {
      mockedClient.delete.mockResolvedValueOnce({ data: undefined });

      await membershipsApi.remove('1');

      expect(mockedClient.delete).toHaveBeenCalledWith('/memberships/1');
    });
  });

  it('propagira greske iz API klijenta', async () => {
    const apiError = { statusCode: 404, message: 'Nije pronadjeno' };
    mockedClient.get.mockRejectedValueOnce(apiError);

    await expect(membershipsApi.getById('nepostojeci')).rejects.toEqual(apiError);
  });
});
