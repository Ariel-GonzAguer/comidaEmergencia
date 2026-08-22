/**
 * @file Tests de la capa de datos de la CLI (`cli/store.js`).
 * Mockea `fs/promises` para no tocar archivos reales en disco.
 */

import { describe, it, expect, vi } from 'vitest';

vi.mock('fs/promises');
import fs from 'fs/promises';

import {
  actualizarInsumo,
  agregarCategoria,
  agregarSimbolo,
  crearInsumo,
  eliminarCategoria,
  eliminarInsumo,
  eliminarSimbolo,
  escribirMD,
  filtrarInsumos,
  guardar,
  leerDB,
  normalizarFecha,
  validarCalorias,
  validarFecha,
  validarProteina,
} from './store.js';

const insumoBase = {
  id: 'uuid-1',
  nombre: 'Arroz',
  cantidad: '5',
  unidad: 'kg',
  categoria: 'alimentos',
  vencimiento: '06-2027',
  calorias: 150,
  proteina: 3,
  notas: '',
  simbolos: [],
  creadoEn: '2026-01-01T00:00:00.000Z',
  actualizadoEn: '2026-01-01T00:00:00.000Z',
};

const dbBase = {
  insumos: [{ ...insumoBase }],
  categorias: ['alimentos', 'especias', 'higiene'],
  simbolos: [
    { codigo: 'V', descripcion: 'Ya vencido' },
    { codigo: '*', descripcion: 'Vence este año' },
  ],
};

function mockDB(override = {}) {
  const db = {
    insumos: [...dbBase.insumos.map(i => ({ ...i }))],
    categorias: [...dbBase.categorias],
    simbolos: [...dbBase.simbolos],
    ...override,
  };
  fs.readFile.mockResolvedValue(JSON.stringify(db));
  fs.writeFile.mockResolvedValue();
  fs.rename.mockResolvedValue();
  return db;
}

describe('leerDB', () => {
  it('lee y parsea db.json', async () => {
    mockDB();
    const db = await leerDB();
    expect(db.insumos).toHaveLength(1);
    expect(db.categorias).toContain('alimentos');
  });

  it('lanza error si el archivo no existe', async () => {
    fs.readFile.mockRejectedValue({ code: 'ENOENT' });
    await expect(leerDB()).rejects.toThrow('db.json no encontrado');
  });
});

describe('filtrarInsumos', () => {
  const insumos = [
    { ...insumoBase, id: '1', nombre: 'Arroz blanco', categoria: 'alimentos' },
    { ...insumoBase, id: '2', nombre: 'Jabón', categoria: 'higiene', simbolos: ['V'] },
  ];

  it('filtra por categoría exacta', () => {
    const res = filtrarInsumos(insumos, { categoria: 'higiene' });
    expect(res).toHaveLength(1);
    expect(res[0].nombre).toBe('Jabón');
  });

  it('filtra por texto en nombre (case-insensitive)', () => {
    const res = filtrarInsumos(insumos, { texto: 'arroz' });
    expect(res).toHaveLength(1);
    expect(res[0].nombre).toBe('Arroz blanco');
  });

  it('filtra por símbolo', () => {
    const res = filtrarInsumos(insumos, { texto: 'V' });
    expect(res).toHaveLength(1);
    expect(res[0].nombre).toBe('Jabón');
  });

  it('no filtra si no hay criterios', () => {
    expect(filtrarInsumos(insumos)).toHaveLength(2);
  });
});

describe('validaciones', () => {
  it('validarFecha acepta formatos válidos', () => {
    expect(validarFecha('4/2027').valido).toBe(true);
    expect(validarFecha('04-2027').valido).toBe(true);
    expect(validarFecha('no vence').valido).toBe(true);
    expect(validarFecha('').valido).toBe(true);
  });

  it('validarFecha rechaza formatos inválidos', () => {
    expect(validarFecha('13-2027').valido).toBe(false);
    expect(validarFecha('2027-04').valido).toBe(false);
    expect(validarFecha('abril').valido).toBe(false);
  });

  it('normalizarFecha convierte a MM-AAAA', () => {
    expect(normalizarFecha('4/2027')).toBe('04-2027');
    expect(normalizarFecha('04-2027')).toBe('04-2027');
    expect(normalizarFecha('no vence')).toBe('no vence');
  });

  it('validarCalorias y validarProteina', () => {
    expect(validarCalorias('150').valido).toBe(true);
    expect(validarCalorias('-1').valido).toBe(false);
    expect(validarCalorias('1.5').valido).toBe(false);
    expect(validarCalorias('').valido).toBe(true);
    expect(validarProteina('7.5').valido).toBe(true);
    expect(validarProteina('250').valido).toBe(false);
  });
});

describe('crearInsumo', () => {
  it('crea un insumo y persiste', async () => {
    const db = mockDB();
    const nuevo = await crearInsumo(db, {
      nombre: 'Fideo',
      cantidad: '3',
      unidad: 'kg',
      categoria: 'alimentos',
      vencimiento: '12-2027',
      calorias: 120,
      proteina: 4,
    });

    expect(nuevo.id).toBeDefined();
    expect(nuevo.creadoEn).toBeDefined();
    expect(db.insumos).toHaveLength(2);
    expect(fs.writeFile).toHaveBeenCalled();
    expect(fs.rename).toHaveBeenCalled();
  });

  it('lanza error si falta el nombre', async () => {
    const db = mockDB();
    await expect(crearInsumo(db, {})).rejects.toThrow(/nombre/i);
    expect(db.insumos).toHaveLength(1);
  });

  it('usa "alimentos" como categoría por defecto', async () => {
    const db = mockDB();
    const nuevo = await crearInsumo(db, { nombre: 'Sal' });
    expect(nuevo.categoria).toBe('alimentos');
  });
});

describe('actualizarInsumo', () => {
  it('actualiza parcialmente y conserva el resto', async () => {
    const db = mockDB();
    const actualizado = await actualizarInsumo(db, 'uuid-1', { nombre: 'Arroz integral', calorias: 180 });

    expect(actualizado.nombre).toBe('Arroz integral');
    expect(actualizado.calorias).toBe(180);
    expect(actualizado.unidad).toBe('kg');
    expect(actualizado.actualizadoEn).not.toBe('2026-01-01T00:00:00.000Z');
  });

  it('devuelve null si el id no existe', async () => {
    const db = mockDB();
    expect(await actualizarInsumo(db, 'no-existe', { nombre: 'X' })).toBeNull();
  });
});

describe('eliminarInsumo', () => {
  it('elimina el insumo y persiste', async () => {
    const db = mockDB();
    const eliminado = await eliminarInsumo(db, 'uuid-1');
    expect(eliminado.id).toBe('uuid-1');
    expect(db.insumos).toHaveLength(0);
  });

  it('devuelve null si el id no existe', async () => {
    const db = mockDB();
    expect(await eliminarInsumo(db, 'no-existe')).toBeNull();
  });
});

describe('categorías y símbolos', () => {
  it('agrega una categoría nueva y rechaza duplicados', async () => {
    const db = mockDB();
    expect(await agregarCategoria(db, 'bebidas')).toBe(true);
    expect(db.categorias).toContain('bebidas');
    expect(await agregarCategoria(db, 'bebidas')).toBe(false);
  });

  it('elimina una categoría existente', async () => {
    const db = mockDB();
    expect(await eliminarCategoria(db, 'especias')).toBe(true);
    expect(db.categorias).not.toContain('especias');
    expect(await eliminarCategoria(db, 'no-existe')).toBe(false);
  });

  it('agrega un símbolo y rechaza códigos duplicados', async () => {
    const db = mockDB();
    expect(await agregarSimbolo(db, 'AB', 'Aviso')).toBe(true);
    expect(db.simbolos).toHaveLength(3);
    expect(await agregarSimbolo(db, 'AB', 'otro')).toBe(false);
  });

  it('elimina un símbolo existente', async () => {
    const db = mockDB();
    expect(await eliminarSimbolo(db, 'V')).toBe(true);
    expect(db.simbolos).toHaveLength(1);
  });
});

describe('guardar y escribirMD', () => {
  it('guardar escribe db.json y el markdown', async () => {
    const db = mockDB();
    await guardar(db);
    expect(fs.writeFile).toHaveBeenCalled();
    expect(fs.rename).toHaveBeenCalled();
  });

  it('escribirMD genera el markdown con símbolos', async () => {
    const db = mockDB();
    await escribirMD(db);
    const arg = fs.writeFile.mock.calls.at(-1);
    const md = arg[1];
    expect(md).toContain('## Alimentos');
    expect(md).toContain('Arroz');
    expect(md).toContain('`V`');
    expect(md).toContain('## Referencias');
  });
});