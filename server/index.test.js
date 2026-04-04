/**
 * @file Tests de integración para la API REST del inventario de emergencia.
 * Usa supertest para hacer peticiones HTTP reales contra la app Express,
 * y mockea fs/promises para no tocar archivos reales en disco.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// ── Mock del módulo fs/promises antes de importar la app ────────────────────
vi.mock('fs/promises');
import fs from 'fs/promises';

// ── Datos de prueba ────────────────────────────────────────────────────────
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

// ── Importar app después de mockear fs ────────────────────────────────────
const { app } = await import('./index.js');

// ══════════════════════════════════════════════════════════════════════════
describe('GET /api/insumos', () => {
  beforeEach(() => mockDB());

  it('devuelve 200 con la lista completa', async () => {
    const res = await request(app).get('/api/insumos');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].nombre).toBe('Arroz');
  });

  it('filtra por categoría', async () => {
    mockDB({
      insumos: [
        { ...insumoBase, id: 'uuid-1', categoria: 'alimentos' },
        { ...insumoBase, id: 'uuid-2', nombre: 'Jabón', categoria: 'higiene' },
      ],
    });

    const res = await request(app).get('/api/insumos?categoria=alimentos');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].categoria).toBe('alimentos');
  });

  it('filtra por texto (nombre parcial, case-insensitive)', async () => {
    mockDB({
      insumos: [
        { ...insumoBase, id: 'uuid-1', nombre: 'Arroz blanco' },
        { ...insumoBase, id: 'uuid-2', nombre: 'Fideo' },
      ],
    });

    const res = await request(app).get('/api/insumos?texto=arr');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].nombre).toBe('Arroz blanco');
  });

  it('devuelve lista vacía si no hay coincidencias', async () => {
    const res = await request(app).get('/api/insumos?texto=zzz_inexistente');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════════════════
describe('GET /api/insumos/:id', () => {
  beforeEach(() => mockDB());

  it('devuelve 200 con el insumo correcto', async () => {
    const res = await request(app).get('/api/insumos/uuid-1');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('uuid-1');
    expect(res.body.data.nombre).toBe('Arroz');
  });

  it('devuelve 404 si el id no existe', async () => {
    const res = await request(app).get('/api/insumos/no-existe');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('error');
  });
});

// ══════════════════════════════════════════════════════════════════════════
describe('POST /api/insumos', () => {
  beforeEach(() => mockDB());

  it('crea un insumo y devuelve 201', async () => {
    const payload = {
      nombre: 'Fideo',
      cantidad: '3',
      unidad: 'kg',
      categoria: 'alimentos',
      vencimiento: '12-2027',
      calorias: 120,
      proteina: 4,
    };

    const res = await request(app).post('/api/insumos').send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.nombre).toBe('Fideo');
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.creadoEn).toBeDefined();
  });

  it('asigna "alimentos" como categoría por defecto', async () => {
    const res = await request(app).post('/api/insumos').send({ nombre: 'Sal' });

    expect(res.status).toBe(201);
    expect(res.body.data.categoria).toBe('alimentos');
  });

  it('devuelve 400 si falta el nombre', async () => {
    const res = await request(app).post('/api/insumos').send({ cantidad: '2' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/nombre/i);
  });

  it('devuelve 400 si el nombre es solo espacios', async () => {
    const res = await request(app).post('/api/insumos').send({ nombre: '   ' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/nombre/i);
  });

  it('guarda los símbolos correctamente', async () => {
    const res = await request(app)
      .post('/api/insumos')
      .send({ nombre: 'Atún', simbolos: ['V', '*'] });

    expect(res.status).toBe(201);
    expect(res.body.data.simbolos).toEqual(['V', '*']);
  });
});

// ══════════════════════════════════════════════════════════════════════════
describe('PUT /api/insumos/:id', () => {
  beforeEach(() => mockDB());

  it('actualiza los campos enviados y devuelve 200', async () => {
    const res = await request(app)
      .put('/api/insumos/uuid-1')
      .send({ nombre: 'Arroz integral', calorias: 180 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.nombre).toBe('Arroz integral');
    expect(res.body.data.calorias).toBe(180);
  });

  it('conserva los campos no enviados', async () => {
    const res = await request(app).put('/api/insumos/uuid-1').send({ nombre: 'Arroz integral' });

    expect(res.status).toBe(200);
    expect(res.body.data.unidad).toBe('kg');
    expect(res.body.data.categoria).toBe('alimentos');
  });

  it('actualiza actualizadoEn automáticamente', async () => {
    const res = await request(app).put('/api/insumos/uuid-1').send({ notas: 'Revisado' });

    expect(res.status).toBe(200);
    expect(res.body.data.actualizadoEn).not.toBe('2026-01-01T00:00:00.000Z');
  });

  it('devuelve 404 si el id no existe', async () => {
    const res = await request(app).put('/api/insumos/no-existe').send({ nombre: 'X' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('error');
  });
});

// ══════════════════════════════════════════════════════════════════════════
describe('DELETE /api/insumos/:id', () => {
  beforeEach(() => mockDB());

  it('elimina el insumo y devuelve success: true', async () => {
    const res = await request(app).delete('/api/insumos/uuid-1');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('uuid-1');
  });

  it('devuelve 404 si el id no existe', async () => {
    const res = await request(app).delete('/api/insumos/no-existe');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('error');
  });
});

// ══════════════════════════════════════════════════════════════════════════
describe('GET /api/categorias', () => {
  beforeEach(() => mockDB());

  it('devuelve 200 con el array de categorías', async () => {
    const res = await request(app).get('/api/categorias');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(['alimentos', 'especias', 'higiene']);
  });
});

// ══════════════════════════════════════════════════════════════════════════
describe('GET /api/simbolos', () => {
  beforeEach(() => mockDB());

  it('devuelve 200 con el array de símbolos', async () => {
    const res = await request(app).get('/api/simbolos');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0]).toHaveProperty('codigo');
    expect(res.body.data[0]).toHaveProperty('descripcion');
  });
});
