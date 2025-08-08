import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();


export async function openAI_RecipeService(request) {
  const { input } = await request.json();
  try {
    const client = new OpenAI();
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "genere una receta con los ingredientes ingresados. La receta debe tener 3 secciones: ingredientes, instrucciones y notas." },
        { role: "user", content: input },
      ],
    });
    return new Response(JSON.stringify({
      status: 200,
      output: response.choices[0].message.content
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in OpenAI request:", error);
    return new Response(JSON.stringify({ error: "Error al generar la receta" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
