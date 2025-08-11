# Validación de datos con Zod en ComidaEmergencia

## ¿Qué es Zod?

Zod es una librería de validación y tipado de datos para JavaScript y TypeScript. Permite definir esquemas que aseguran que los datos recibidos en formularios, servicios y APIs cumplen con la estructura y reglas esperadas.

## ¿Por qué usamos Zod?

- Evita errores por datos mal formateados o incompletos.
- Mejora la seguridad y confiabilidad del código.
- Facilita el mantenimiento y la colaboración en proyectos Open Source.
- Permite mostrar mensajes de error claros al usuario.

## ¿Dónde se usa Zod en el proyecto?

- En el archivo `src/servicios/esquemasZod.js` se definen los esquemas para alimentos, lugares, notas, recetas, medicamentos y otros.
- Los esquemas se usan en componentes como `AgregarModal.jsx` para validar los datos antes de agregarlos al store o enviarlos a Firestore.

## Ejemplo de uso

```js
import { recetaSchema } from '../servicios/esquemasZod';

const datos = {
  nombre: 'Café con leche',
  ingredientes: 'café, leche vegetal, azúcar',
  calorias: 150,
  instrucciones: 'Mezclar y servir caliente.',
};

const validacion = recetaSchema.safeParse(datos);
if (!validacion.success) {
  // Mostrar errores
  console.error(validacion.error.format());
} else {
  // Usar datos validados
  guardarReceta(validacion.data);
}
```

## Esquemas disponibles

- alimentoSchema
- lugarSchema
- notaSchema
- recetaSchema
- medicamentoSchema
- otrosSchema

## Buenas prácticas

- Valida siempre los datos antes de guardarlos o procesarlos.
- Usa los mensajes de error personalizados para mejorar la experiencia de usuario.
- Centraliza los esquemas en un solo archivo para facilitar su mantenimiento.

---

_Última actualización: 09/08/2025_
