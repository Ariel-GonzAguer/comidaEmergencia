import { describe, it, expect, vi } from 'vitest';
import Alimento from '../../src/clases/AlimentoClass.js';

describe('Alimento Class', () => {
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

  const nombre = 'Manzana';
  const tipo = 'Fruta';
  const calorias = '52';
  const cantidad = '10';
  const fechaInput = '2025-01-01';
  const ubicacion = { id: 'despensa', nombre: 'Despensa' };

  let alimento;

  it('debería crear una instancia válida con campos correctos', () => {
    alimento = Alimento.crearAlimento(
      nombre,
      tipo,
      calorias,
      cantidad,
      fechaInput,
      ubicacion
    );

    // Verificar propiedades básicas
    expect(alimento).toBeInstanceOf(Alimento);
    expect(alimento.getNombre()).toBe(nombre);
    expect(alimento.getTipo()).toBe(tipo);
    expect(alimento.getCalorias()).toBe(Number(calorias));
    expect(alimento.getCantidad()).toBe(Number(cantidad));
    expect(alimento.getUbicacion()).toEqual(ubicacion);
    expect(alimento.id).toBe(`${nombre}-mock-uuid`);

    // Verificar formato de fecha de vencimiento
    const fechaDate = new Date(fechaInput);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const esperado = fechaDate.toLocaleDateString('es-ES', opciones);
    expect(alimento.getFechaVencimiento()).toBe(esperado);

    // Verificar que el id contiene el nombre y un UUID
    expect(alimento.id).toContain(nombre + '-');
  });

  it('debería actualizar la fecha de vencimiento con setFechaVencimiento', () => {
    const nuevaFecha = '2026-02-02';
    alimento.setFechaVencimiento(nuevaFecha);
    expect(alimento.getFechaVencimiento()).toBe(nuevaFecha);
  });
});
