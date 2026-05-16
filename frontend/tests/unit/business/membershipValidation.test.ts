import { describe, it, expect } from 'vitest';
import {
  validateMembershipForm,
  isMembershipFormValid,
} from '../../../src/pages/membershipValidation';

const VALID_VALUES = {
  name: 'Mjesečno',
  durationInDays: '30',
  price: '35.50',
};

describe('validateMembershipForm (poslovni sloj)', () => {
  it('prihvaca validne vrijednosti', () => {
    const errors = validateMembershipForm(VALID_VALUES);
    expect(errors).toEqual({});
    expect(isMembershipFormValid(VALID_VALUES)).toBe(true);
  });

  describe('naziv', () => {
    it('odbija prazan naziv', () => {
      const errors = validateMembershipForm({ ...VALID_VALUES, name: '' });
      expect(errors.name).toBe('Naziv je obavezan');
    });

    it('odbija naziv samo s razmacima', () => {
      const errors = validateMembershipForm({ ...VALID_VALUES, name: '   ' });
      expect(errors.name).toBe('Naziv je obavezan');
    });

    it('odbija naziv duzi od 255 znakova', () => {
      const errors = validateMembershipForm({
        ...VALID_VALUES,
        name: 'A'.repeat(256),
      });
      expect(errors.name).toBe('Naziv smije imati najviše 255 znakova');
    });

    it('prihvaca naziv tocno 255 znakova', () => {
      const errors = validateMembershipForm({
        ...VALID_VALUES,
        name: 'A'.repeat(255),
      });
      expect(errors.name).toBeUndefined();
    });
  });

  describe('trajanje (durationInDays)', () => {
    it('odbija prazno trajanje', () => {
      const errors = validateMembershipForm({
        ...VALID_VALUES,
        durationInDays: '',
      });
      expect(errors.durationInDays).toBe('Trajanje je obavezno');
    });

    it('odbija nulu i negativne brojeve', () => {
      expect(
        validateMembershipForm({ ...VALID_VALUES, durationInDays: '0' })
          .durationInDays
      ).toBe('Trajanje mora biti cijeli broj veći od 0');
      expect(
        validateMembershipForm({ ...VALID_VALUES, durationInDays: '-5' })
          .durationInDays
      ).toBe('Trajanje mora biti cijeli broj veći od 0');
    });

    it('odbija decimalne brojeve', () => {
      const errors = validateMembershipForm({
        ...VALID_VALUES,
        durationInDays: '7.5',
      });
      expect(errors.durationInDays).toBe(
        'Trajanje mora biti cijeli broj veći od 0'
      );
    });
  });

  describe('cijena (price)', () => {
    it('odbija praznu cijenu', () => {
      const errors = validateMembershipForm({ ...VALID_VALUES, price: '' });
      expect(errors.price).toBe('Cijena je obavezna');
    });

    it('odbija cijenu manju ili jednaku 0', () => {
      expect(
        validateMembershipForm({ ...VALID_VALUES, price: '0' }).price
      ).toBe('Cijena mora biti veća od 0');
      expect(
        validateMembershipForm({ ...VALID_VALUES, price: '-10' }).price
      ).toBe('Cijena mora biti veća od 0');
    });

    it('prihvaca decimalne cijene', () => {
      const errors = validateMembershipForm({
        ...VALID_VALUES,
        price: '29.99',
      });
      expect(errors.price).toBeUndefined();
    });
  });

  it('vraca sve greske odjednom kada vise polja nije valjano', () => {
    const errors = validateMembershipForm({
      name: '',
      durationInDays: '',
      price: '',
    });
    expect(errors.name).toBeDefined();
    expect(errors.durationInDays).toBeDefined();
    expect(errors.price).toBeDefined();
    expect(isMembershipFormValid({ name: '', durationInDays: '', price: '' })).toBe(
      false
    );
  });
});
