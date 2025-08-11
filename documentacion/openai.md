# Documentación para el uso de la API de OpenAI en este proyecto

Este proyecto utiliza la API de OpenAI para generar recetas de cocina de manera automática a partir de los ingredientes proporcionados por el usuario.

## ¿Dónde se utiliza?

- El servicio está implementado en el archivo `api/openAI_RecipeService.js`.
- El componente principal que consume la API es `GeneradorReceta.jsx`.

## Configuración necesaria

Para que la integración funcione correctamente, es necesario agregar la clave de OpenAI en el archivo `.env`:

```env
OPENAI_API_KEY=tu_clave_openai
```

> [!CAUTION]
> Nunca compartas tu clave de OpenAI en repositorios públicos. Agrega `.env` a tu `.gitignore`.

## Flujo de uso

1. El usuario ingresa los ingredientes en el formulario del componente `GeneradorReceta.jsx`.
2. Al enviar el formulario, se realiza una petición POST a `/api/openAI_RecipeService`.
3. El servicio toma los ingredientes, llama a la API de OpenAI y devuelve una receta generada.
4. La receta se muestra en pantalla y puede ser validada y guardada.

## Ejemplo de petición

```js
fetch('/api/openAI_RecipeService', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ input: ['arroz', 'pollo', 'zanahoria'] }),
});
```

## Cómo crear una cuenta y cargar saldo en OpenAI

1. **Crear una cuenta:**

   - Ve a https://platform.openai.com/signup
   - Regístrate con tu correo electrónico y sigue el proceso de verificación.

2. **Obtener tu clave de API:**

   - Una vez dentro, accede a https://platform.openai.com/api-keys
   - Haz clic en "Create new secret key" y copia la clave generada.

3. **Cargar saldo para tokens:**
   - Accede a https://platform.openai.com/account/billing/overview
   - Haz clic en "Add payment method" y agrega una tarjeta de crédito o débito.
   - Puedes recargar saldo o dejar que se cobre automáticamente según el uso.
   - Consulta el historial y los límites en https://platform.openai.com/account/usage
     > [!IMPORTANT]  
     > El uso de la API de OpenAI se cobra por tokens consumidos. Revisa los precios y monitorea tu saldo para evitar interrupciones.

## Ejemplo práctico: ¿Qué se puede hacer con $5 USD?

- **Precio promedio (GPT-3.5 Turbo):**

  - $0.0015 por cada 1,000 tokens generados (output)
  - $0.0005 por cada 1,000 tokens enviados (input)

- **Con $5 USD:**

  - Puedes generar aproximadamente **3,333,333 tokens** de salida (output)
  - Si cada receta generada por la IA utiliza unos 500 tokens (input + output), puedes obtener unas **6,000 recetas** en promedio.

- **Duración del saldo:**
  - El saldo no vence, pero se consume según el uso. Si generas 10 recetas por día, $5 USD te durarían aproximadamente **600 días**.

> [!NOTE]
> Los precios pueden variar según el modelo y el tipo de petición. Consulta siempre la [tabla oficial de precios](https://openai.com/pricing) para información actualizada.

## Recomendaciones

- La clave `OPENAI_API_KEY` debe estar disponible en el entorno donde se ejecuta el backend (Vercel, local, etc).
- Si usas Vercel, agrega la variable en el panel de configuración de entorno.
- Revisa los límites y costos de uso de la API en https://platform.openai.com/account/usage

## Recursos útiles

- [Documentación oficial de OpenAI API](https://platform.openai.com/docs/api-reference)
- [Guía de variables de entorno en Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

---

Si tienes dudas sobre la integración, revisa el archivo `api/openAI_RecipeService.js` para ver cómo se realiza la llamada y el manejo de errores.
