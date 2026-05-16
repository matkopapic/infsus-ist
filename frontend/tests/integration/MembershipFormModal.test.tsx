import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('../../src/api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import MembershipFormModal from '../../src/pages/MembershipFormModal';
import apiClient from '../../src/api/client';

const mockedClient = apiClient as unknown as {
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
};

describe('Integracija: MembershipFormModal (presentation + validacija + DAL)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('kreiranje: popunjavanje forme -> validacija prolazi -> POST /memberships', async () => {
    const user = userEvent.setup();
    const onSaved = vi.fn();
    const onClose = vi.fn();

    mockedClient.post.mockResolvedValueOnce({
      data: {
        membershipId: 'novi-id',
        name: 'Tjedno',
        durationInDays: 7,
        price: 12.5,
      },
    });

    render(
      <MembershipFormModal
        isOpen
        onClose={onClose}
        onSaved={onSaved}
      />
    );

    await user.type(screen.getByLabelText('Naziv'), 'Tjedno');
    await user.type(screen.getByLabelText('Trajanje (dana)'), '7');
    await user.type(screen.getByLabelText('Cijena (€)'), '12.5');

    await user.click(screen.getByRole('button', { name: 'Spremi' }));

    await waitFor(() => {
      expect(mockedClient.post).toHaveBeenCalledWith('/memberships', {
        name: 'Tjedno',
        durationInDays: 7,
        price: 12.5,
      });
    });
    expect(onSaved).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('validacija ne dopusta submit s praznim poljima (business sloj blokira DAL)', async () => {
    const user = userEvent.setup();
    const onSaved = vi.fn();

    render(
      <MembershipFormModal isOpen onClose={() => {}} onSaved={onSaved} />
    );

    await user.click(screen.getByRole('button', { name: 'Spremi' }));

    expect(screen.getByText('Naziv je obavezan')).toBeInTheDocument();
    expect(screen.getByText('Trajanje je obavezno')).toBeInTheDocument();
    expect(screen.getByText('Cijena je obavezna')).toBeInTheDocument();

    expect(mockedClient.post).not.toHaveBeenCalled();
    expect(onSaved).not.toHaveBeenCalled();
  });

  it('editiranje postojeceg clanstva poziva PUT s id-em', async () => {
    const user = userEvent.setup();
    const onSaved = vi.fn();

    mockedClient.put.mockResolvedValueOnce({
      data: {
        membershipId: 'm1',
        name: 'Mjesečno PRO',
        durationInDays: 30,
        price: 45,
      },
    });

    render(
      <MembershipFormModal
        isOpen
        membership={{
          membershipId: 'm1',
          name: 'Mjesečno',
          durationInDays: 30,
          price: 35,
        }}
        onClose={() => {}}
        onSaved={onSaved}
      />
    );

    const nameInput = screen.getByLabelText('Naziv') as HTMLInputElement;
    expect(nameInput.value).toBe('Mjesečno');

    await user.clear(nameInput);
    await user.type(nameInput, 'Mjesečno PRO');

    const priceInput = screen.getByLabelText('Cijena (€)') as HTMLInputElement;
    await user.clear(priceInput);
    await user.type(priceInput, '45');

    await user.click(screen.getByRole('button', { name: 'Spremi' }));

    await waitFor(() => {
      expect(mockedClient.put).toHaveBeenCalledWith('/memberships/m1', {
        name: 'Mjesečno PRO',
        durationInDays: 30,
        price: 45,
      });
    });
    expect(onSaved).toHaveBeenCalled();
  });

  it('greska iz DAL-a se propagira u prezentaciju kao "general" error', async () => {
    const user = userEvent.setup();

    mockedClient.post.mockRejectedValueOnce({
      statusCode: 409,
      message: 'Članstvo s tim nazivom već postoji',
    });

    render(
      <MembershipFormModal
        isOpen
        onClose={() => {}}
        onSaved={() => {}}
      />
    );

    await user.type(screen.getByLabelText('Naziv'), 'Mjesečno');
    await user.type(screen.getByLabelText('Trajanje (dana)'), '30');
    await user.type(screen.getByLabelText('Cijena (€)'), '35');
    await user.click(screen.getByRole('button', { name: 'Spremi' }));

    await waitFor(() => {
      expect(
        screen.getByText('Članstvo s tim nazivom već postoji')
      ).toBeInTheDocument();
    });
  });
});
