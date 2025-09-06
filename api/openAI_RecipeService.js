import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Maneja una solicitud HTTP para generar una receta usando el modelo GPT de OpenAI.
 *
 * Lee el cuerpo de la solicitud manualmente (compatible con Vercel serverless), analiza los ingredientes recibidos
 * y los envía a la API de chat completions de OpenAI para generar una receta. La receta incluye cuatro secciones:
 * nombre, ingredientes, calorías e instrucciones.
 *
 * @async
 * @function
 * @param {import('http').IncomingMessage} req - Objeto de solicitud HTTP.
 * @param {import('http').ServerResponse} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con un objeto JSON que contiene la receta generada o un mensaje de error.
 */
export default async function openAI_RecipeService(req, res) {
  // Leer body manualmente (entorno serverless)
  let body = '';
  try {
    for await (const chunk of req) body += chunk;
  } catch (e) {
    return res.status(400).json({ error: 'Error leyendo el cuerpo de la petición' });
  }

  if (!body || !body.trim()) {
    return res.status(400).json({ error: 'Cuerpo vacío' });
  }

  let data;
  try {
    data = JSON.parse(body);
  } catch (e) {
    // Error de parseo esperado en pruebas: devolver 400 para diferenciar de errores internos
    if (process.env.NODE_ENV !== 'test') {
      console.warn('[openAI_RecipeService] JSON inválido recibido');
    }
    return res.status(400).json({ error: 'JSON inválido en el cuerpo de la petición' });
  }

  // Validación mínima del payload
  if (data == null || typeof data !== 'object') {
    return res.status(400).json({ error: 'Payload debe ser un objeto JSON' });
  }

  const input = data.input;
  if (typeof input !== 'string' && !Array.isArray(input)) {
    return res.status(400).json({ error: 'El campo "input" debe ser string o array' });
  }

  try {
    const client = new OpenAI();
    const result = await client.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: 'Eres un asistente culinario que debe crear una receta vegana usando SOLO los ingredientes que te doy (puedes añadir agua y sal si es imprescindible). RESPONDE ÚNICAMENTE con JSON VÁLIDO (sin explicaciones, sin markdown, sin texto antes o después, sin comillas simples). Formato EXACTO de ejemplo: {"nombre":"Nombre de la receta","ingredientes":["ingrediente 1 con cantidad","ingrediente 2 con cantidad"],"calorias":123,"instrucciones":["paso 1","paso 2"]}. Asegúrate de: 1) usar comillas dobles en claves y strings 2) calorias número entero 3) instrucciones array de strings 4) ingredientes array de strings con cantidades. NO devuelvas nada más.'
            }
          ]
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: Array.isArray(input) ? input.join(', ') : String(input)
            }
          ]
        }
      ]
    });

    const output = result?.choices?.[0]?.message?.content || '';
    // Respuesta uniforme
    return res.status(200).json({ status: 200, output });
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('[openAI_RecipeService] Error interno:', error);
    }
    return res.status(500).json({ error: 'Error interno generando la receta' });
  }
}
