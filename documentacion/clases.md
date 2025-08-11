# Clases en ComidaEmergencia

## ¿Qué es una clase?

En programación orientada a objetos, una clase es una plantilla o molde que define las propiedades y métodos que tendrán los objetos creados a partir de ella. Permite organizar y reutilizar el código de manera estructurada.

En este proyecto, las clases representan los distintos tipos de elementos que se gestionan: alimentos, lugares, recetas, notas, medicamentos y otros.

## ¿Dónde están?

Las clases se encuentran en la carpeta:

```
src/clases/
├── AlimentoClass.js
├── MedicamentoClass.js
├── LugarClass.js
├── NotaClass.js
├── OtrosItemClass.js
└── RecetaClass.js
```

## ¿Para qué se usan?

- Para crear nuevos elementos con una estructura consistente.
- Para validar y transformar datos antes de guardarlos o mostrarlos.
- Para encapsular la lógica relacionada con cada tipo de elemento.

## Ejemplo de uso

Suponga que desea crear un nuevo alimento:

```js
import Alimento from '../clases/AlimentoClass';

const nuevoAlimento = Alimento.crearAlimento('Arroz', 'Grano', 200, 2, '31-12-2025', {
  id: 'lugar-123',
  nombre: 'Despensa',
});
```

Esto crea un objeto alimento con las propiedades necesarias, listo para ser guardado en el store o en Firebase.

## Ventajas de usar clases

- Garantizan que todos los elementos tengan la misma estructura.
- Facilitan la validación y transformación de datos.
- Permiten agregar métodos útiles para cada tipo de elemento.

## Notas importantes

- Las clases de este proyecto están diseñadas para trabajar con objetos planos (sin métodos) al guardar en Firestore, evitando errores de serialización.
- Siempre use los métodos estáticos de las clases (por ejemplo, `crearAlimento`) para crear nuevos objetos.

---

**En resumen:** Las clases en ComidaEmergencia ayudan a mantener el código organizado, seguro y fácil de mantener, representando cada tipo de recurso de manera clara y reutilizable.
