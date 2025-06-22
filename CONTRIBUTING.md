# 🤝 Guía de Contribución

¡Gracias por su interés en contribuir a **Alimentos de Emergencia**! Este documento le guiará a través del proceso de contribución.

## 📋 Código de Conducta

Al participar en este proyecto, acepta mantener un ambiente respetuoso y constructivo. Esperamos:

- 🤝 Ser respetuoso con otros colaboradores
- 💬 Comunicación constructiva y profesional
- 🎯 Enfocarse en lo que es mejor para la comunidad
- 🌟 Mostrar empatía hacia otros miembros de la comunidad

## 🚀 Cómo Contribuir

### 🐛 Reportar Bugs

Antes de reportar un bug:
1. **Verifique** que no exista un issue similar
2. **Reproduzca** el problema en la última versión
3. **Recopile** información sobre su entorno

**Para reportar un bug:**
1. Vaya a [Issues](https://github.com/Ariel-GonzAguer/comidaEmergencia/issues)
2. Haga clic en "New Issue"
3. Seleccione "Bug Report"
4. Complete la plantilla con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplica
   - Información del entorno (OS, navegador, Node.js)

### 💡 Sugerir Features

**Para sugerir una nueva funcionalidad:**
1. Vaya a [Issues](https://github.com/Ariel-GonzAguer/comidaEmergencia/issues)
2. Haga clic en "New Issue"
3. Seleccione "Feature Request"
4. Describe:
   - ¿Qué problema resuelve?
   - ¿Cómo funcionaría?
   - ¿Por qué sería útil?

### 🔧 Contribuir con Código

#### 1. Fork y Setup

```bash
# Fork del repositorio en GitHub, luego:
git clone https://github.com/SU-USUARIO/comidaEmergencia.git
cd comidaEmergencia

# Agregar el repositorio original como remote
git remote add upstream https://github.com/Ariel-GonzAguer/comidaEmergencia.git

# Instalar dependencias
npm install
```

#### 2. Crear una Rama

```bash
# Actualizar su fork
git checkout main
git pull origin main

# Crear nueva rama
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/descripcion-del-fix
```

#### 3. Realizar Cambios

- **Mantenga** el código simple y legible
- **Siga** las convenciones existentes
- **Use** emojis consistentes en la UI
- **Añada** comentarios para lógica compleja
- **Pruebe** sus cambios localmente

#### 4. Commit y Push

```bash
# Agregar cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: agregar funcionalidad de X"
# o
git commit -m "fix: corregir problema con Y"

# Push a su fork
git push origin feature/nombre-descriptivo
```

#### 5. Pull Request

1. Vaya a su fork en GitHub
2. Haga clic en "Compare & pull request"
3. Complete la descripción:
   - **¿Qué** cambia este PR?
   - **¿Por qué** es necesario?
   - **¿Cómo** se puede probar?
4. Enlace issues relacionados

## 📏 Estándares de Código

### JavaScript
- Usar **ES6+** features
- **const/let** en lugar de var
- **Arrow functions** cuando sea apropiado
- **Destructuring** para objetos y arrays
- **Template literals** para strings

### Astro Components
- Un componente por archivo
- Props tipados en comentarios
- Estilos con Tailwind CSS
- Emojis en lugar de SVG cuando sea posible

### CSS/Tailwind
- Usar clases utilitarias de Tailwind
- Evitar CSS personalizado cuando sea posible
- Responsive design con prefijos móviles primero
- Consistencia en espaciado y colores

### Firebase
- Manejo de errores apropiado
- Validación de datos
- Reglas de seguridad actualizadas
- Optimización de consultas

## 🧪 Testing

Antes de enviar un PR:

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Verificar build
npm run build
npm run preview
```

**Pruebe manualmente:**
- ✅ Login/logout funciona
- ✅ CRUD de alimentos
- ✅ Filtros por categoría
- ✅ Alertas de vencimiento
- ✅ Responsividad móvil

## 📄 Licencia

Al contribuir, acepta que sus contribuciones serán licenciadas bajo la **AGPL-3.0**.

### Implicaciones AGPL-3.0

- Cualquier fork/modificación debe mantener la misma licencia
- Si despliega el software como servicio, debe proporcionar el código fuente
- Se debe preservar la información de copyright y licencia

## 🎯 Áreas de Contribución

### 🆘 Se Necesita Ayuda

- **Documentación**: Mejorar README, comentarios en código
- **UI/UX**: Accesibilidad
- **Features**: Nuevas funcionalidades (ver issues etiquetados como "enhancement")
- **Testing**: Agregar tests automatizados
- **Performance**: Optimizaciones de rendimiento
- **i18n**: Internacionalización para otros idiomas

### 🏷️ Labels de Issues

- `bug` - Problemas que necesitan corrección
- `enhancement` - Nuevas funcionalidades
- `documentation` - Mejoras en documentación
- `good first issue` - Ideal para nuevos contribuidores
- `help wanted` - Se necesita ayuda de la comunidad

## 💬 Comunicación

- **Issues**: Para bugs y features
- **Discussions**: Para preguntas generales
- **Pull Requests**: Para contribuciones de código

## 🙏 Reconocimiento

Todos los contribuidores serán reconocidos en el README y en las releases notes.

---

¡Gracias por hacer que **Alimentos de Emergencia** sea mejor! 🎉
