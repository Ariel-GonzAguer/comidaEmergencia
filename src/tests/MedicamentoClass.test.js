/* eslint-env vitest */
import { describe, it, expect, vi } from 'vitest';
import Medicamento from '../clases/medicamentoClass.js';

describe('Medicamento', () => {
  // Mock crypto.randomUUID
  const originalCrypto = global.crypto;
  beforeAll(() => {
    Object.defineProperty(global, 'crypto', {
      configurable: true,
      value: { randomUUID: vi.fn(() => 'mock-uuid') }
    });
  });
  afterAll(() => {
    Object.defineProperty(global, 'crypto', {
      configurable: true,
      value: originalCrypto
    });
  });

  it('debería crear una instancia correctamente', () => {
    const med = new Medicamento('Paracetamol', 'Fiebre', 10, '2025-12-31');
    expect(med).toBeInstanceOf(Medicamento);
    expect(med.nombre).toBe('Paracetamol');
    expect(med.uso).toBe('Fiebre');
    expect(med.cantidad).toBe(10);
    expect(med.fechaVencimiento).toMatch(/2025/);
    expect(med.id).toBe('Paracetamol-mock-uuid');
  });

  it('debería formatear la fecha de vencimiento en español', () => {
    const med = new Medicamento('Ibuprofeno', 'Dolor', 5, new Date('2024-07-15'));
    // Verifica mes y año sin exigir día exacto (puede variar por zona horaria)
    expect(med.fechaVencimiento).toMatch(/julio de 2024/);
  });

  it('getNombre debe retornar el nombre', () => {
    const med = new Medicamento('Aspirina', 'Dolor de cabeza', 20, '2026-01-01');
    expect(med.getNombre()).toBe('Aspirina');
  });

  it('getUso debe retornar el uso', () => {
    const med = new Medicamento('Aspirina', 'Dolor de cabeza', 20, '2026-01-01');
    expect(med.getUso()).toBe('Dolor de cabeza');
  });

  it('getCantidad debe retornar la cantidad', () => {
    const med = new Medicamento('Aspirina', 'Dolor de cabeza', 20, '2026-01-01');
    expect(med.getCantidad()).toBe(20);
  });

  it('getFechaVencimiento debe retornar la fecha formateada', () => {
    const med = new Medicamento('Aspirina', 'Dolor de cabeza', 20, '2026-01-01');
    // Verifica formato general día-mes-año sin asumir día o mes exacto
    expect(med.getFechaVencimiento()).toMatch(/\d{1,2} de [a-z]+ de \d{4}/);
  });

  it('crearMedicamento debe crear una instancia correctamente', () => {
    const med = Medicamento.crearMedicamento('Amoxicilina', 'Infección', 15, '2027-05-10');
    expect(med).toBeInstanceOf(Medicamento);
    expect(med.nombre).toBe('Amoxicilina');
    expect(med.uso).toBe('Infección');
    expect(med.cantidad).toBe(15);
    expect(med.fechaVencimiento).toMatch(/2027/);
    expect(med.id).toBe('Amoxicilina-mock-uuid');
  });

  it('debería manejar fechas inválidas', () => {
    const med = new Medicamento('Test', 'Test', 1, 'fecha-invalida');
    // El resultado será "Invalid Date" formateado por toLocaleDateString
    expect(typeof med.fechaVencimiento).toBe('string');
  });
});
