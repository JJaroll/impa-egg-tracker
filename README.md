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

### 2. ⏹️ Control de Fin de Puesta (Detener / Reanudar Puesta)
- **Botón `[ DETENER PUESTA ]`**: Permite al dueño indicar cuando Impa ha concluido su ciclo de puesta, pausando el contador regresivo de 48 horas y fijando la nidada como cerrada y en incubación/crianza plena.
- **Botón `[ REANUDAR PUESTA ]`**: En caso de que Impa ponga un huevo inesperado o continúe la puesta, el dueño puede reabrir el cálculo de ventana en cualquier momento con un solo clic.

### 3. 🐣 Marcado Directo de Eclosión (`¡Eclosionó!`)
- Botón directo en la tarjeta de cada huevo no eclosionado (`[ 🐣 ¡Eclosionó! ]`).
- Modal interactivo con prellenado automático:
  - Fecha y hora exacta de nacimiento.
  - Peso al nacer (4.5g por defecto, calibrado para ninfas).
  - Número de anilla federada reglamentaria (4.5 mm).
  - Mutación esperada (hijo/a de Impa, mutación perlada).
  - Creación inmediata de la ficha individual en el sistema de seguimiento de pollitos.
- En huevos ya eclosionados, el botón conmuta a `[ 🐥 VER POLLO ]`, llevando al usuario directamente a la ficha del pichón.

### 4. 🐥 Esquema y Seguimiento de Pollos (Día 0 al Mes de Vida)
Nueva sección principal **POLLOS** dedicada al crecimiento y cuidados de los pichones nacidos:
- **Mis Pollitos (Fichas en Vivo)**:
  - Cronómetro de edad en tiempo real (`X días, Y horas`).
  - Barra de progreso del primer mes (0 a 30 días).
  - Parámetros biológicos diarios según la edad exacta: temperatura del nido requerida, frecuencia y volumen de tomas, capacidad del buche.
  - Estado del anillado: advertencia visual activa durante la ventana crítica (Días 6 a 8).
  - Registro de pesajes diarios con comparativa frente al rango promedio saludable (*Healthy Weight Range*).
- **Esquema Interactivo Día 0 a 30**:
  - Selector de días (0 al 30) con 6 fases morfológicas detalladas en SVG vectorial (Neonato, Primera semana/Anillado, Ojos y cañones, Fase erizo/desvainado, Emplume con cresta, Fledgling de 1 mes).
  - Gráfico interactivo SVG de **Curva de Crecimiento** que contrasta la curva de peso estándar de *Nymphicus hollandicus* contra los pesajes reales ingresados por el dueño.
- **Guías Críticas de Crianza**:
  1. *Anillado Reglamentario*: Instrucciones paso a paso para anillas de 4.5 mm entre los días 6 y 8.
  2. *Prevención de Patas de Rana (Splay Leg)*: Manejo de cama de viruta y corrección con esponja/anillas.
  3. *Estasis de Buche (Buche Parado)*: Causas térmicas, papilla a 39°C y masaje de evacuación.
  4. *Destete Natural*: Introducción de panizo en rama y transición gradual a mixtura/vegetales.

### 5. 👥 Separación de Roles: Modo Lectura vs Modo Dueño
- **Modo Visitante (Solo Lectura por defecto)**:
  - Consulta pública de la nidada, fichas de pollos, edad en vivo, visor de embrión, esquema 0-30D y guías sin riesgo de alterar información.
  - Controles de edición, pesaje y administración ocultos.
- **Modo Dueño de Impa (Administrador)**:
  - Acceso mediante botón `[ 🔑 ACCESO DUEÑO ]` con clave de seguridad y validación SHA-256.
  - Permite detener/reanudar puesta, marcar eclosión, registrar pesajes de pollos, editar y eliminar registros.

### 6. 📅 Descarga de Recordatorios para Calendario (.ics)
- Recordatorios individuales y archivo iCal maestro de la nidada completa compatible con Google Calendar, Apple Calendar y Outlook.

### 7. 🔬 Visor Interactivo de Desarrollo Embrionario (Días 0 al 21)
- Modos de visualización de **Ovoscopia (Candling)** y **Anatomía (Corte Transversal)** con latido cardíaco animado y detalles día por día.

### 8. 🎨 Sistema de Diseño Cicada (UX-UI)
- Interfaz inspirada en Cicada iPod Click-Wheel, totalmente responsive (Desktop y Mobile), temas Claro/Oscuro con alto contraste y colores de acento.

---

## 📂 Estructura del Proyecto

```plaintext
impa-egg-tracker/
├── index.html              # Estructura SPA y vistas (Nidada, Embrión, Pollos, Guía)
├── styles.css              # Estilos personalizados, animaciones y glassmorphism
├── tokens.css              # Tokens del sistema de diseño Cicada (colores, tipografía)
├── app.js                  # Lógica de la app, roles, seguimiento de huevos y pollos, exportador
├── chicks-data.js          # Base de datos biológica del pichón (Días 0-30, pesos, cuidados, guías)
├── chicks-visualizer.js    # Visualizador SVG de 30 días, morfología y gráfica de peso
├── embryo-visualizer.js    # Motor SVG de desarrollo embrionario (ovoscopia y anatomía)
├── embryo-data.js          # Base de datos biológica de 22 días de incubación
├── data/
│   └── nest.json           # Fuente de datos canónica de la nidada y pollos para visitantes
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
