/* eslint-env vitest */
import { describe, it, expect, vi } from 'vitest';
import Receta from '../clases/RecetaClass.js';

describe('Receta Class', () => {
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

  const nombre = 'Paella Vegana';
  const ingredientes = { arroz: '400g', garbanzos: '200g', verduras: '200g' };
  const calorias = 420;
  const instrucciones = 'Sofreír las verduras, añadir arroz, garbanzos y caldo vegetal. Cocinar 20 minutos.';

  let receta;

  it('debería crear una instancia válida con campos correctos', () => {
    receta = Receta.crearReceta(nombre, ingredientes, calorias, instrucciones);

    // Verificar propiedades básicas
    expect(receta).toBeInstanceOf(Receta);
    expect(receta.getNombre()).toBe(nombre);
    expect(receta.getIngredientes()).toEqual(ingredientes);
    expect(receta.getCalorias()).toBe(calorias);
    expect(receta.getInstrucciones()).toBe(instrucciones);
    expect(receta.id).toBe(`${nombre}-mock-uuid`);

    // Verificar que el id contiene el nombre y un UUID
    expect(receta.id).toContain(nombre + '-');
  });

  it('debería crear una instancia con ingredientes vacíos por defecto', () => {
    const recetaSinIngredientes = new Receta(nombre, undefined, calorias, instrucciones);

    expect(recetaSinIngredientes.getIngredientes()).toEqual({});
  });

  it('getNombre debería retornar el nombre de la receta', () => {
    expect(receta.getNombre()).toBe(nombre);
  });

  it('getIngredientes debería retornar los ingredientes de la receta', () => {
    expect(receta.getIngredientes()).toEqual(ingredientes);
  });

  it('getInstrucciones debería retornar las instrucciones de la receta', () => {
    expect(receta.getInstrucciones()).toBe(instrucciones);
  });

  it('getCalorias debería retornar las calorías de la receta', () => {
    expect(receta.getCalorias()).toBe(calorias);
  });

  it('setCalorias debería actualizar las calorías de la receta', () => {
    const nuevasCalorias = 500;
    receta.setCalorias(nuevasCalorias);

    expect(receta.getCalorias()).toBe(nuevasCalorias);
  });

  it('getReceta debería retornar un objeto con todos los datos de la receta', () => {
    const recetaCompleta = receta.getReceta();

    expect(recetaCompleta).toEqual({
      nombre: nombre,
      ingredientes: ingredientes,
      calorias: receta.getCalorias(), // usa la caloria actualizada del test anterior
      instrucciones: instrucciones,
      id: `${nombre}-mock-uuid`,
    });
  });
});