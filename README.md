# 🦜 Nido de Impa • Monitor de Incubación de Ninfas (*Nymphicus hollandicus*)

Una aplicación web interactiva, moderna y visualmente atractiva diseñada para monitorizar el desarrollo individual de los huevos de la ninfa **Impa** (*Nymphicus hollandicus* / Carolina).

Desarrollada en HTML5, CSS3 moderno (con estética dark glassmorphic inspirada en ninfas) y Vanilla JavaScript, **100% lista para desplegarse de inmediato en GitHub Pages** sin servidores ni compilaciones complejas.

---

## ✨ Características Principales

1. **Monitoreo Individual por Huevo**:
   - Registro de fecha y hora exacta/aproximada de cada puesta.
   - Cálculo automático de días y horas de incubación en tiempo real.
   - Cuenta regresiva hacia los hitos críticos:
     - 🔦 **Día 5**: *Ovoscopia / Miraje* para confirmación inequívoca de fertilidad (araña vascular y latido).
     - 💧 **Día 18**: *Picaje Interno* (respiración en cámara de aire, momento de elevar humedad al 65%-75%).
     - 🐣 **Día 21**: *Fecha estimada de eclosión*.
   - Estados configurables: *Pendiente de ovoscopia*, *Fértil confirmado*, *No fértil / Claro*, *Detenido* y *¡Eclosionado!*.

2. **Predicción del Próximo Huevo**:
   - Las ninfas suelen poner un huevo cada 48 horas en promedio. La aplicación calcula la fecha y hora estimada de la siguiente puesta de Impa y muestra una cuenta regresiva.

3. **Visor Interactivo de Desarrollo Embrionario (*Nymphicus hollandicus*)**:
   - Selector interactivo día por día (0 al 21).
   - **Vista de Ovoscopia**: Simulación realista de inspección con linterna en habitación oscura (muestra la cámara de aire, red de vasos sanguíneos, opacidad y latido cardíaco con micro-animaciones).
   - **Esquema Anatómico**: Medidas estimadas, formación del diamante del pico, cresta y plumón amarillo.
   - Fichas biológicas detalladas por etapa y consejos de manejo para cada día.

4. **Recordatorios para tu Calendario (.ics)**:
   - Descarga directa de archivo de calendario compatible con Google Calendar, Apple Calendar y Outlook con las alarmas del Día 5, Día 18 y Día 21.

5. **Guía de Cuidados y Parámetros del Nido**:
   - Temperatura y humedad óptima según la fase.
   - Recomendaciones de nutrición y aporte de calcio para la madre.
   - Signos de alarma durante el nacimiento.

6. **Sin Pérdida de Datos**:
   - Guarda automáticamente todo en el navegador con `localStorage`.
   - Botón de **Respaldar** (descarga JSON) y **Restaurar** para cambiar de dispositivo o hacer copias de seguridad.

---

## 🚀 Cómo publicar esta web en GitHub Pages (en 2 minutos)

Sigue estos sencillos pasos para tener la app funcionando en internet accesible desde cualquier teléfono o computadora:

### Paso 1: Inicializar el repositorio Git local
Abre tu terminal en la carpeta del proyecto:

```bash
cd /Users/jjaroll/.gemini/antigravity-ide/scratch/impa-egg-tracker
git init
git add .
git commit -m "feat: Monitor de incubación de huevos de Impa para GitHub Pages"
```

### Paso 2: Crear un repositorio en GitHub
1. Entra a [github.com/new](https://github.com/new).
2. Nómbralo por ejemplo `impa-egg-tracker` (puedes marcarlo como público).
3. **No** selecciones inicializar con README ni `.gitignore` (ya los tienes creados).
4. Haz clic en **Create repository**.

### Paso 3: Subir tu código a GitHub
```bash
git branch -M main
git remote add origin https://github.com/JJaroll/impa-egg-tracker.git
git push -u origin main
```

### Paso 4: Activar GitHub Pages
1. En tu repositorio [github.com/JJaroll/impa-egg-tracker](https://github.com/JJaroll/impa-egg-tracker), ve a la pestaña **Settings** (Configuración).
2. En la barra lateral izquierda, haz clic en **Pages**.
3. En la sección **Build and deployment**:
   - **Source**: Selecciona `Deploy from a branch`.
   - **Branch**: Selecciona `main` y la carpeta `/ (root)`.
4. Haz clic en **Save**.

¡Listo! En unos 60 segundos tu sitio estará activo en:
**`https://jjaroll.github.io/impa-egg-tracker/`**

---

## 💻 Cómo probar la app localmente ahora mismo

Puedes abrir directamente el archivo `index.html` en tu navegador favorito, o si prefieres correr un servidor local ligero:

```bash
# Con Python 3:
cd /Users/jjaroll/.gemini/antigravity-ide/scratch/impa-egg-tracker
python3 -m http.server 8080

# Luego abre en tu navegador:
# http://localhost:8080
```
