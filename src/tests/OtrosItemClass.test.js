/* eslint-env vitest */
import { describe, it, expect, vi } from 'vitest';
import OtrosItem from '../clases/OtrosItemClass.js';

describe('OtrosItem Class', () => {
  // Mock crypto.randomUUID
  const originalCrypto = global.crypto;
  beforeAll(() => {
    Object.defineProperty(global, 'crypto', {
      configurable: true,
      value: { randomUUID: vi.fn(() => 'mock-uuid') },
    });
  });
  afterAll(() => {
    Object.defineProperty(global, 'crypto', {
      configurable: true,
      value: originalCrypto,
    });
  });

  const nombre = 'Linterna';
  const uso = 'Iluminación de emergencia';

  let otrosItem;

  it('debería crear una instancia válida con campos correctos', () => {
    otrosItem = OtrosItem.crearOtrosItem(nombre, uso);

    // Verificar propiedades básicas
    expect(otrosItem).toBeInstanceOf(OtrosItem);
    expect(otrosItem.getNombre()).toBe(nombre);
    expect(otrosItem.getUso()).toBe(uso);
    expect(otrosItem.id).toBe(`${nombre}-mock-uuid`);

    // Verificar que el id contiene el nombre y un UUID
    expect(otrosItem.id).toContain(nombre + '-');
  });

  it('getNombre debería retornar el nombre del ítem', () => {
    expect(otrosItem.getNombre()).toBe(nombre);
  });

  it('getUso debería retornar el uso del ítem', () => {
    expect(otrosItem.getUso()).toBe(uso);
  });

  it('debería crear una instancia con constructor directo', () => {
    const itemDirecto = new OtrosItem('Martillo', 'Herramienta de emergencia');

    expect(itemDirecto).toBeInstanceOf(OtrosItem);
    expect(itemDirecto.getNombre()).toBe('Martillo');
    expect(itemDirecto.getUso()).toBe('Herramienta de emergencia');
    expect(itemDirecto.id).toBe('Martillo-mock-uuid');
  });

  it('debería generar IDs únicos para diferentes instancias', () => {
    const item1 = new OtrosItem('Item1', 'Uso1');
    const item2 = new OtrosItem('Item2', 'Uso2');

    expect(item1.id).not.toBe(item2.id);
    expect(item1.id).toContain('Item1-');
    expect(item2.id).toContain('Item2-');
  });

  it('debería manejar nombres con espacios y caracteres especiales', () => {
    const nombreEspecial = 'Kit de Primeros Auxilios';
    const usoEspecial = 'Atención médica de emergencia';
    const itemEspecial = OtrosItem.crearOtrosItem(nombreEspecial, usoEspecial);

    expect(itemEspecial.getNombre()).toBe(nombreEspecial);
    expect(itemEspecial.getUso()).toBe(usoEspecial);
    expect(itemEspecial.id).toContain('Kit de Primeros Auxilios-');
  });
});
