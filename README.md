# 🦜 Nido de Impa • Monitor de Incubación de Ninfas (*Nymphicus hollandicus*)

Una aplicación web progresiva, moderna e interactiva diseñada para el seguimiento y monitoreo día a día de la incubación de los huevos de **Impa**, una ninfa carolina hembra (*Nymphicus hollandicus*, mutación perlada).

Desarrollada en HTML5 semántico, Vanilla CSS3 (sistema de diseño Cicada con modo oscuro, glassmorphism y temas) y Vanilla JavaScript sin dependencias ni compiladores, **alojada y desplegada automáticamente en GitHub Pages**.

🔗 **Sitio en vivo**: [https://jjaroll.github.io/impa-egg-tracker/](https://jjaroll.github.io/impa-egg-tracker/)

---

## ✨ Características Principales

### 1. 🥚 Monitoreo Individual y Cronograma Biológico
- **Registro individual de cada huevo**: Fecha y hora exacta de puesta, estado de fertilidad y notas de seguimiento.
- **Relojes en tiempo real**: Contador regresivo y progreso continuo hacia los hitos críticos:
  - 🔦 **Día 5**: *Ovoscopia / Miraje*: Confirmación de fertilidad al trasluz (red capilar y latido cardíaco).
  - 💧 **Día 18**: *Picaje Interno*: El polluelo perfora la cámara de aire; señal para elevar la humedad del nido al 65%-75%.
  - 🐣 **Día 21**: *Fecha estimada de eclosión*.
- **Estimación de la siguiente puesta**: Cálculo automático del intervalo de ~48 horas entre huevos con temporizador regresivo.

### 2. 👥 Separación de Roles: Modo Lectura vs Modo Dueño
- **Modo Visitante (Solo Lectura por defecto)**:
  - Cualquier persona que ingrese al enlace puede consultar el estado de la nidada, explorar el visor de desarrollo y leer la guía sin riesgo de alterar o borrar información.
  - Los controles de registro, edición y eliminación permanecen completamente ocultos.
- **Modo Dueño de Impa (Administrador)**:
  - Acceso mediante el botón `[ 🔑 ACCESO DUEÑO ]` con clave de seguridad.
  - **Validación criptográfica SHA-256**: La clave no se almacena en texto plano en el repositorio.
  - Habilita registrar nuevos huevos, cambiar estados (Pendiente, Fértil, Infértil, Detenido, Eclosionado), editar fechas y notas.
  - Opción de recordar sesión en el navegador habitual.

### 3. 📅 Descarga de Recordatorios para Calendario (.ics)
- Compatible con Google Calendar, Apple Calendar, Microsoft Outlook y aplicaciones móviles:
  - **Recordatorio individual**: Descarga los hitos de un huevo específico con alarmas automáticas previas.
  - **Nidada completa**: Botón `[ RECORDATORIOS DE LA NIDADA (.ICS) ]` que genera un archivo iCal maestro con todos los eventos y alarmas de todos los huevos en un solo clic.

### 4. 🔬 Visor Interactivo de Desarrollo Embrionario (Días 0 al 21)
Selector dinámico día a día con dos modos de visualización basados en la biología de *Nymphicus hollandicus*:
- **🔦 Vista de Ovoscopia (Candling)**:
  - Simulación de inspección con linterna LED en habitación oscura.
  - Latido cardíaco sincronizado y centrado mediante animaciones SVG SMIL nativas y ondas de pulso arterial.
  - **Días 18 a 20**: Transiluminación perimetral realista a través de la cáscara y membranas, silueta anatómica del pichón acurrucado, picaje interno (pico en cámara de aire), picaje externo (grietas) y rotación circular de eclosión (*zipping*).
  - **Día 21 (Eclosión)**: Ilustración del pichón de ninfa recién nacido (pico ganchudo con cera/narinas, cresta de plumón amarillo, patas zigodáctilas, piel altricial) descansando **fuera del cascarón** sobre viruta de nido junto a los cascarones rotos vacíos.
- **📐 Vista de Anatomía (Corte Transversal Dinámico)**:
  - 8 fases biológicas con cortes longitudinales que revelan la yema, chalazas suspensorias, disco germinativo, saco amniótico, alantoides respiratorio, vasos vitelinos y la absorción celómica de la yema.
  - Marcadores anatómicos interactivos con líneas guía y fichas técnicas por día.

### 5. 📖 Guía de Incubación y Cría de Ninfas
- Parámetros ideales de temperatura (37.2 °C – 37.5 °C) y humedad relativa según la fase.
- Recomendaciones de nutrición materna (calcio, germinados, pasta de cría).
- Pautas de manejo del nido y advertencias críticas de eclosión.

### 6. 🎨 Sistema de Diseño Cicada (UX-UI)
- Interfaz moderna con estética dark glassmorphic inspirada en ninfas y aves exóticas.
- Retrato oficial de Impa con su plumaje perlado real (*Pearl Cockatiel*).
- Personalización de temas (Oscuro / Claro) y colores de acento (Naranja Ninfa, Verde, Azul, Púrpura, Rosa).
- Soporte bilingüe (Español / Inglés).

---

## 📂 Estructura del Proyecto

```plaintext
impa-egg-tracker/
├── index.html              # Estructura SPA y modales (Nidada, Embrión, Guía)
├── styles.css              # Estilos personalizados, animaciones y glassmorphism
├── tokens.css              # Tokens del sistema de diseño Cicada (colores, tipografía)
├── app.js                  # Lógica de la app, roles, timers, exportador ICS y sync
├── embryo-visualizer.js    # Motor generador de gráficos SVG (ovoscopia y anatomía)
├── embryo-data.js          # Base de datos biológica de 22 días para Nymphicus hollandicus
├── data/
│   └── nest.json           # Fuente de datos canónica de la nidada para visitantes
├── assets/
│   └── impa.jpg            # Retrato oficial de Impa (Ninfa perlada en su nido)
└── .github/
    └── workflows/
        └── deploy.yml      # Flujo de integración continua para GitHub Pages
```

---

## 🔒 Seguridad y Sincronización de Datos

1. **Fuente Pública de Verdad (`data/nest.json`)**:
   - Los visitantes que ingresan a GitHub Pages leen automáticamente la información publicada en este archivo.
2. **Publicación desde el Navegador**:
   - Como dueño, tras realizar cambios en tu navegador, el botón `[ PUBLICAR ]` en la cabecera te permite descargar el archivo `nest.json` actualizado para subirlo a la carpeta `data/` del repositorio, o copiar el JSON al portapapeles.
3. **Respaldo Local**:
   - Puedes exportar e importar copias completas de seguridad en formato `.json` en cualquier momento.

---

## 🛠️ Ejecución Local

Para probar o modificar la aplicación en tu computadora:

```bash
# Clonar el repositorio
git clone https://github.com/JJaroll/impa-egg-tracker.git
cd impa-egg-tracker

# Iniciar un servidor web ligero (Python 3)
python3 -m http.server 8080

# Abrir en el navegador:
# http://localhost:8080
```

También puedes abrir directamente el archivo `index.html` en cualquier navegador moderno.

---

## 📜 Ficha de la Especie

| Parámetro | Valor para *Nymphicus hollandicus* |
| :--- | :--- |
| **Nombre común** | Ninfa / Carolina / Cockatiel |
| **Familia** | Cacatuidae (Psitácida) |
| **Periodo de incubación** | 19 a 21 días (promedio 21 días) |
| **Día de ovoscopia clave** | Día 5 (araña vascular visible) |
| **Día de picaje interno** | Día 18 (inicio de respiración aérea) |
| **Intervalo entre puestas** | ~48 horas (2 días) |
| **Tamaño de nidada habitual** | 4 a 6 huevos |
| **Temperatura ideal** | 37.2 °C – 37.5 °C |
| **Humedad normal** | 50% – 55% |
| **Humedad en eclosión** | 65% – 75% (Días 18 al 21) |

---

*Desarrollado con cariño para Impa y sus futuros pichones.* 💛🐣
