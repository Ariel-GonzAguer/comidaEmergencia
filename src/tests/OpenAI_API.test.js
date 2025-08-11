import { describe, it, expect, vi, beforeEach } from 'vitest';
import openAI_RecipeService from '../../api/openAI_RecipeService.js';

// Mock de OpenAI
vi.mock('openai', () => {
  return {
    default: class {
      chat = {
        completions: {
          create: vi.fn().mockImplementation(async (options) => {
            // Extraer el texto del mensaje del usuario
            let userMessage = options?.messages?.find(m => m.role === 'user');
            let ingredientes = [];
            if (userMessage && Array.isArray(userMessage.content)) {
              // El servicio envía el input como array con un objeto {type, text}
              let texto = userMessage.content.find(c => c.type === 'text')?.text || '';
              // Separar ingredientes por coma y agregar cantidad
              ingredientes = texto.split(',').map(i => i.trim() + ' 100g').filter(i => i.trim() !== '100g');
              ingredientes.push('sal al gusto', 'agua 10ml');
            } else {
              ingredientes = ['lechuga 100g', 'tomate 50g', 'sal al gusto', 'agua 10ml'];
            }
            return {
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      nombre: 'Ensalada personalizada',
                      ingredientes,
                      calorias: 120,
                      instrucciones: ['Lavar los ingredientes', 'Mezclar en un bol', 'Servir']
                    })
                  }
                }
              ]
            };
          })
        }
      }
    }
  };
});

// Mock de req y res
function createMockReq(bodyObj) {
  const bodyStr = JSON.stringify(bodyObj);
  let sent = false;
  return {
    [Symbol.asyncIterator]: function* () {
      if (!sent) {
        sent = true;
        yield bodyStr;
      }
    }
  };
}

function createMockRes() {
  return {
    statusCode: null,
    jsonData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.jsonData = data;
      return this;
    }
  };
}

describe('openAI_RecipeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe responder con una receta generada correctamente', async () => {
    const req = createMockReq({ input: ['lechuga', 'tomate'] });
    const res = createMockRes();

    await openAI_RecipeService(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.jsonData).toHaveProperty('output');
    const receta = JSON.parse(res.jsonData.output);
    expect(receta).toHaveProperty('nombre');
    expect(receta).toHaveProperty('ingredientes');
    expect(receta).toHaveProperty('calorias');
    expect(receta).toHaveProperty('instrucciones');
    expect(Array.isArray(receta.ingredientes)).toBe(true);
    expect(Array.isArray(receta.instrucciones)).toBe(true);
    expect(typeof receta.calorias).toBe('number');
  });

  it('debe manejar errores de parseo de JSON', async () => {
    // Simula un body inválido
    const req = {
      [Symbol.asyncIterator]: function* () {
        yield "{ input: [lechuga, tomate] "; // JSON inválido
      }
    };
    const res = createMockRes();

    await openAI_RecipeService(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.jsonData).toHaveProperty('error');
    expect(typeof res.jsonData.error).toBe('string');
  });

  it('debe manejar input como string', async () => {
    // Simula el uso real: input como string
    const req = createMockReq({ input: 'zanahoria' });
    const res = createMockRes();

    await openAI_RecipeService(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.jsonData).toHaveProperty('output');
    const receta = JSON.parse(res.jsonData.output);
    // El input se pasa como string, así que debe aparecer en los ingredientes
    expect(receta.ingredientes.some(i => i.includes('zanahoria'))).toBe(true);
  });

  it('debe manejar input como array', async () => {
    // Simula el uso real: input como array
    const req = createMockReq({ input: ['zanahoria', 'tomate'] });
    const res = createMockRes();

    await openAI_RecipeService(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.jsonData).toHaveProperty('output');
    const receta = JSON.parse(res.jsonData.output);
    // Ambos ingredientes deben aparecer en la receta
    expect(receta.ingredientes.some(i => i.includes('zanahoria'))).toBe(true);
    expect(receta.ingredientes.some(i => i.includes('tomate'))).toBe(true);
  });

  it('debe manejar input vacío', async () => {
    const req = createMockReq({ input: [] });
    const res = createMockRes();

    await openAI_RecipeService(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.jsonData).toHaveProperty('output');
    const receta = JSON.parse(res.jsonData.output);
    expect(Array.isArray(receta.ingredientes)).toBe(true);
  });
});