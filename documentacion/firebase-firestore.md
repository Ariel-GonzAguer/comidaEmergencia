# Documentación de configuración Firebase y Firestore

Esta aplicación utiliza Firebase y Firestore para el almacenamiento y gestión de datos. Es necesario configurar las credenciales en un archivo `.env` para que la conexión funcione correctamente.

## Pasos para configurar Firebase y Firestore

1. **Crear un proyecto en Firebase:**

   - Accede a https://console.firebase.google.com/
   - Crea un nuevo proyecto y agrega una aplicación web.

2. **Obtener las credenciales de configuración:**

   - En la sección de configuración del proyecto, busca el bloque de configuración para web.
   - Copia los siguientes valores:
     - `apiKey`
     - `authDomain`
     - `projectId`
     - `storageBucket`
     - `messagingSenderId`
     - `appId`
     - (Opcional) `measurementId`

3. **Agregar las variables al archivo `.env`:**
   - En la raíz del proyecto, crea un archivo llamado `.env` si no existe.
   - Agrega las siguientes líneas, reemplazando los valores por los de tu proyecto:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id # Opcional
```

> [!NOTE]
> Todas las variables deben comenzar con `VITE_` para que Vite las exponga correctamente en el frontend.

1. **Verificar la conexión:**
   - Asegúrate de que el archivo `.env` esté en la raíz del proyecto y que los valores sean correctos.
   - Reinicia el servidor de desarrollo si realizaste cambios en el `.env`.

## Recomendaciones de seguridad

- **No compartas el archivo `.env` ni sus valores en repositorios públicos.**
- Agrega `.env` a tu `.gitignore` para evitar que se suba a GitHub.

## Recursos útiles

- [Documentación oficial de Firebase](https://firebase.google.com/docs/web/setup)
- [Documentación de Firestore](https://firebase.google.com/docs/firestore)

---

Si tienes dudas sobre la configuración, revisa el archivo `src/firebase/firebaseConfig.js` para ver cómo se utilizan estas variables en el proyecto.
