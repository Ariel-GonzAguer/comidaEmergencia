import OpenAI from "openai";
import dotenv from "dotenv";
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
  try {
    // Log: inicio de función
    // console.log("[openAI_RecipeService] Inicio");

    // Leer el body manualmente (Vercel serverless)
    let body = "";
    for await (const chunk of req) {
      body += chunk;
    }
    // console.log("[openAI_RecipeService] Body recibido:", body);
    const data = JSON.parse(body);
    // console.log("[openAI_RecipeService] Data parseada:", data);

    const client = new OpenAI();
    // console.log("[openAI_RecipeService] Cliente OpenAI creado");
    const result = await client.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        { role: "system", content: [{ type: "text", text: "Eres un asistente culinario que debe crear una receta vegana usando solo los ingredientes que te doy. No agregues ningún ingrediente extra excepto sal y agua si es necesario. La receta debe devolverse en formato JSON exactamente así, sin texto extra:{'nombre': 'Nombre de la receta','ingredientes': ['ingrediente 1 con cantidad','ingrediente 2 con cantidad',...],'calorias': número entero aproximado,'instrucciones': ['paso 1','paso 2',...]}" }] },
        { role: "user", content: [{ type: "text", text: Array.isArray(data.input) ? data.input.join(", ") : String(data.input) }] },
      ],
    });
    // console.log("[openAI_RecipeService] Receta generada:", result.choices[0].message.content);
    res.status(200).json({
      status: 200,
      output: result.choices[0].message.content
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
}
