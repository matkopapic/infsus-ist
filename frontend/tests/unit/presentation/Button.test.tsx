import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../../../src/components/ui/Button';

describe('Button komponenta (prezentacijski sloj)', () => {
  it('prikazuje children kao tekst gumba', () => {
    render(<Button>Spremi</Button>);
    expect(screen.getByRole('button', { name: 'Spremi' })).toBeInTheDocument();
  });

  it('poziva onClick kada korisnik klikne gumb', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Klikni</Button>);
    await user.click(screen.getByRole('button', { name: 'Klikni' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('ne poziva onClick kada je gumb disablean', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );
    await user.click(screen.getByRole('button', { name: 'Disabled' }));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('primjenjuje primary varijantu po defaultu', () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/primary/);
  });

  it('primjenjuje danger varijantu', () => {
    render(<Button variant="danger">Obrisi</Button>);
    expect(screen.getByRole('button').className).toMatch(/danger/);
  });

  it('primjenjuje secondary varijantu', () => {
    render(<Button variant="secondary">Odustani</Button>);
    expect(screen.getByRole('button').className).toMatch(/secondary/);
  });
});
