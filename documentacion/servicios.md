# Servicios en ComidaEmergencia

## ¿Qué es un servicio?
En el contexto de desarrollo de software, un servicio es cualquier módulo que provee funcionalidad reutilizable y centralizada, como validación, acceso a datos, lógica de negocio, etc.

El uso de servicios permite separar la lógica de negocio de la lógica de acceso a datos, facilitando el mantenimiento y la reutilización del código.

## ¿Dónde están los servicios?
En este proyecto, los servicios principales se encuentran en la carpeta:

```
src/servicios/
├── esquemasZod.js 
└── firebaseService.js
```

## ¿Para qué se usan?
- Para interactuar con la base de datos de Firebase Firestore.
- Para manejar la autenticación y persistencia de datos.
- Para centralizar la lógica de acceso y actualización de los datos remotos.

## Funciones principales en `firebaseService.js`
- `getData()`: Obtiene todos los datos principales del documento de Firestore.
- `agregarElementoFB(elemento, key)`: Agrega un nuevo elemento a la colección correspondiente en Firestore.
- `eliminarElementoFB(key, id)`: Elimina un elemento de la colección correspondiente en Firestore.
- `actualizarElementoFB(key, id, nuevoElemento)`: Actualiza un elemento existente en Firestore.
- `keysArray`: Lista de claves válidas para las colecciones principales.

## Ejemplo de uso
Suponga que desea agregar un nuevo alimento a Firestore:

```js
import { agregarElementoFB } from "../servicios/firebaseService";

const nuevoAlimento = { /* ... */ };
await agregarElementoFB(nuevoAlimento, "alimentos");
```

## Ventajas de usar servicios
- Permiten centralizar y reutilizar la lógica de acceso a datos.
- Facilitan el mantenimiento y la escalabilidad del proyecto.
- Mejoran la organización y separación de responsabilidades en el código.

---

**En resumen:** Los servicios en ComidaEmergencia son módulos que gestionan la comunicación con Firebase y otros recursos externos, permitiendo que el resto de la aplicación se mantenga limpia, modular y fácil de mantener.
