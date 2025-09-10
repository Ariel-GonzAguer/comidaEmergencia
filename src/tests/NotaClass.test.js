/* eslint-env vitest */
import { describe, it, expect, vi } from 'vitest';
import Nota from '../clases/NotaClass.js';

describe('Nota Class', () => {
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

  const nombre = 'Lista de Emergencia';
  const contenido =
    'Verificar botiquín de primeros auxilios, revisar fechas de vencimiento de medicamentos, contactar proveedores.';

  let nota;

  it('debería crear una instancia válida con campos correctos', () => {
    nota = Nota.crearNota(nombre, contenido);

    // Verificar propiedades básicas
    expect(nota).toBeInstanceOf(Nota);
    expect(nota.nombre).toBe(nombre);
    expect(nota.contenido).toBe(contenido);
    expect(nota.id).toBe(`${nombre}-mock-uuid`);

    // Verificar que el id contiene el nombre y un UUID
    expect(nota.id).toContain(nombre + '-');

    // Verificar que tiene fecha
    expect(nota.fecha).toBeDefined();
    expect(typeof nota.fecha).toBe('string');
  });

  it('debería generar fecha en formato español automáticamente', () => {
    // Verificar formato de fecha española
    const formatoFechaRegex = /\d{1,2} de [a-z]+ de \d{4}/;
    expect(nota.fecha).toMatch(formatoFechaRegex);
  });

  it('getNota debería retornar un objeto con los datos correctos', () => {
    const notaData = nota.getNota();

    expect(notaData).toEqual({
      nombre: nombre,
      contenido: contenido,
      fecha: nota.fecha,
    });

    // Verificar que es un objeto plano (sin métodos)
    expect(typeof notaData).toBe('object');
    expect(notaData.getNota).toBeUndefined();
  });

  it('debería crear una instancia con constructor directo', () => {
    const notaDirecta = new Nota('Nota de prueba', 'Contenido de prueba');

    expect(notaDirecta).toBeInstanceOf(Nota);
    expect(notaDirecta.nombre).toBe('Nota de prueba');
    expect(notaDirecta.contenido).toBe('Contenido de prueba');
    expect(notaDirecta.id).toBe('Nota de prueba-mock-uuid');
    expect(notaDirecta.fecha).toBeDefined();
  });

  it('debería generar IDs únicos para diferentes instancias', () => {
    const nota1 = new Nota('Nota1', 'Contenido1');
    const nota2 = new Nota('Nota2', 'Contenido2');

    expect(nota1.id).not.toBe(nota2.id);
    expect(nota1.id).toContain('Nota1-');
    expect(nota2.id).toContain('Nota2-');
  });

  it('debería manejar contenido largo y caracteres especiales', () => {
    const nombreEspecial = 'Protocolo de Emergencia #1';
    const contenidoLargo =
      'Este es un contenido muy largo que incluye múltiples líneas y caracteres especiales como: áéíóú, ñ, ¿?, ¡!, @#$%^&*()';
    const notaEspecial = Nota.crearNota(nombreEspecial, contenidoLargo);

    expect(notaEspecial.nombre).toBe(nombreEspecial);
    expect(notaEspecial.contenido).toBe(contenidoLargo);
    expect(notaEspecial.id).toContain('Protocolo de Emergencia #1-');

    const dataEspecial = notaEspecial.getNota();
    expect(dataEspecial.contenido).toBe(contenidoLargo);
  });

  it('debería manejar contenido vacío', () => {
    const notaVacia = Nota.crearNota('Nota vacía', '');

    expect(notaVacia.contenido).toBe('');
    expect(notaVacia.getNota().contenido).toBe('');
  });
});
