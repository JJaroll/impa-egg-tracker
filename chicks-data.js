/**
 * Base de datos biológica del desarrollo y crecimiento del Pollo de Ninfa / Carolina (Nymphicus hollandicus)
 * Periodo de seguimiento neonatal y crianza: Día 0 (Eclosión) al Día 30 (Primer mes de vida).
 */

const CHICK_STAGES = [
  {
    day: 0,
    title: "Eclosión y Nacimiento (Neonato)",
    stage: "Fase 1: Neonato Crítico (Días 0 - 3)",
    svgPhase: "stage_0_neonate",
    weightMin: 3.5,
    weightMax: 5.2,
    weightAvg: 4.5,
    cropCapacity: "0.5 - 1.0 ml",
    temperature: "36.5°C - 37.0°C",
    feedingFrequency: "Primeras 8-12h no alimentar (absorbe vitelo). Luego cada 2 a 3 horas.",
    summary: "El pichón rompe la cáscara tras 24-48h de picaje. Nace mojado, ciego y con escaso plumón amarillo.",
    milestones: [
      "Eclosión completa sin romper vasos sanguíneos",
      "Absorción del saco vitelino en el abdomen",
      "Presencia del diente de huevo (punta córnea en el pico)",
      "Primer secado del plumón bajo el pecho de los padres"
    ],
    careTips: "El calor continuo es de vida o muerte: el pollo no puede regular su temperatura. No forzar comida las primeras horas; su prioridad absoluta es calor estricto e hidratación.",
    warning: "Si el ombligo presenta sangrado o restos de yema sin cerrar, desinfectar suavemente con clorhexidina diluida y mantener esterilidad."
  },
  {
    day: 1,
    title: "Primer Día de Vida Activa",
    stage: "Fase 1: Neonato Crítico (Días 0 - 3)",
    svgPhase: "stage_0_neonate",
    weightMin: 4.2,
    weightMax: 6.0,
    weightAvg: 5.0,
    cropCapacity: "0.8 - 1.2 ml",
    temperature: "36.5°C - 37.0°C",
    feedingFrequency: "Cada 2.5 - 3 horas (6 a 7 tomas al día). Pausa nocturna máxima de 5 horas.",
    summary: "El plumón amarillo ya está esponjoso. El buche es traslúcido y se aprecia el contenido que le dan sus padres.",
    milestones: [
      "Primer embuche exitoso de 'leche de buche' por los padres",
      "El buche se vacía completamente entre tomas (digestión activa)",
      "Movimientos de cabeza pidiendo calor y alimento"
    ],
    careTips: "Revisar que el buche se vacíe por completo al menos una vez al día (normalmente de madrugada) para evitar fermentaciones de papilla.",
    warning: "Buche estancado: si la comida no avanza en 4 horas, masajear con suavidad con agua tibia y verificar que la temperatura del nido no haya caído."
  },
  {
    day: 2,
    title: "Digestión y Reflejo de Succión",
    stage: "Fase 1: Neonato Crítico (Días 0 - 3)",
    svgPhase: "stage_0_neonate",
    weightMin: 5.5,
    weightMax: 7.8,
    weightAvg: 6.5,
    cropCapacity: "1.0 - 1.5 ml",
    temperature: "36.0°C - 36.5°C",
    feedingFrequency: "Cada 3 horas (6 tomas al día).",
    summary: "Aumento notable de la movilidad y reflejo de deglución. La piel sigue siendo rosada y muy transparente.",
    milestones: [
      "Respuesta refleja al contacto táctil en el pico",
      "Incremento diario de peso del 15% al 20%",
      "Heces firmes y bien hidratadas con uratos blancos"
    ],
    careTips: "Mantener el sustrato del nido (viruta de pino no tratada) limpio y seco para que las patitas apoyen con firmeza y no resbalen.",
    warning: "Nunca utilizar serrín fino o polvo de madera; puede obstruir las fosas nasales y los ojos del neonato."
  },
  {
    day: 3,
    title: "Consolidación Metabólica",
    stage: "Fase 1: Neonato Crítico (Días 0 - 3)",
    svgPhase: "stage_0_neonate",
    weightMin: 7.0,
    weightMax: 10.0,
    weightAvg: 8.5,
    cropCapacity: "1.2 - 2.0 ml",
    temperature: "35.5°C - 36.0°C",
    feedingFrequency: "Cada 3 - 3.5 horas (5 a 6 tomas al día).",
    summary: "El pichón casi duplica su peso de nacimiento. Se distingue la masa muscular del cuello y tarsos.",
    milestones: [
      "Duplicación del peso inicial respecto a la eclosión",
      "Inicio del desarrollo de folículos primarios bajo la dermis",
      "Saco vitelino 100% reabsorbido sin cicatriz visible"
    ],
    careTips: "Pesar al pichón todos los días a la misma hora (preferiblemente por la mañana antes de la primera toma) para verificar la ganancia de gramos.",
    warning: "Un pichón que pierde peso o se estanca dos días consecutivos requiere revisión urgente de nutrición y temperatura."
  },
  {
    day: 4,
    title: "Inicio del Crecimiento Acelerado",
    stage: "Fase 2: Primera Semana (Días 4 - 7)",
    svgPhase: "stage_1_early",
    weightMin: 9.0,
    weightMax: 13.0,
    weightAvg: 11.0,
    cropCapacity: "1.5 - 2.5 ml",
    temperature: "35.0°C - 35.5°C",
    feedingFrequency: "Cada 3.5 horas (5 tomas al día).",
    summary: "Las extremidades y tarsos se alargan. La cabeza se vuelve más erguida y los párpados comienzan a marcar una hendidura.",
    milestones: [
      "Hendidura de los párpados claramente visible",
      "Engrosamiento de los dedos y almohadillas plantares",
      "Caída natural del diente de huevo en el pico"
    ],
    careTips: "Vigilar la postura de las patas: deben estar flexionadas debajo del abdomen, nunca abiertas hacia los lados (prevención de patas de rana).",
    warning: "Si el sustrato está resbaladizo, colocar de inmediato un fondo cóncavo de madera con viruta densa."
  },
  {
    day: 5,
    title: "Aparición de Puntos Foliculares",
    stage: "Fase 2: Primera Semana (Días 4 - 7)",
    svgPhase: "stage_1_early",
    weightMin: 12.0,
    weightMax: 17.0,
    weightAvg: 14.5,
    cropCapacity: "2.0 - 3.0 ml",
    temperature: "34.5°C - 35.0°C",
    feedingFrequency: "Cada 3.5 - 4 horas (5 tomas al día).",
    summary: "Se aprecian pequeños puntitos oscuros o claros bajo la piel en los bordes de las alas: los futuros cañones de plumas.",
    milestones: [
      "Puntos foliculares alares visibles bajo la piel",
      "Capacidad de erguir el cuello con firmeza durante el embuche",
      "Voz con tono audible más marcado"
    ],
    careTips: "Preparar las anillas oficiales federadas (diámetro estándar ninfa: 4.5 mm) para el anillado en los próximos días.",
    warning: "No demorar la preparación de anillas: después del día 8 puede ser doloroso o imposible anillar sin dañar la articulación."
  },
  {
    day: 6,
    title: "Ventana de Anillado Oficial (Inicio)",
    stage: "Fase 2: Primera Semana (Días 4 - 7)",
    svgPhase: "stage_1_early",
    weightMin: 15.0,
    weightMax: 22.0,
    weightAvg: 18.5,
    cropCapacity: "2.5 - 3.5 ml",
    temperature: "34.0°C - 34.5°C",
    feedingFrequency: "Cada 4 horas (5 tomas al día).",
    summary: "Los ojos empiezan a abrir una fina rendija. Comienza la ventana ideal para el anillado reglamentario.",
    milestones: [
      "Inicio de apertura ocular en forma de ranura",
      "Tamaño articular de la pata ideal para anilla de 4.5 mm",
      "Tracción fuerte de las garras sobre el nido"
    ],
    careTips: "Procedimiento de anillado: juntar los 3 dedos delanteros, pasar la anilla hacia atrás, y estirar suavemente el dedo trasero con un palillo romo con vaselina neutra.",
    warning: "Verificar a las 3 horas de anillar que la madre o el padre no hayan intentado quitar la anilla ni se haya salido sola."
  },
  {
    day: 7,
    title: "Anillado Óptimo y Apertura de Ojos",
    stage: "Fase 2: Primera Semana (Días 4 - 7)",
    svgPhase: "stage_1_early",
    weightMin: 19.0,
    weightMax: 27.0,
    weightAvg: 23.0,
    cropCapacity: "3.0 - 4.0 ml",
    temperature: "33.5°C - 34.0°C",
    feedingFrequency: "Cada 4 horas (5 tomas al día).",
    summary: "Los ojos se abren progresivamente revelando el iris oscuro. La anilla queda fijada de por vida.",
    milestones: [
      "Ojos entreabiertos al 50%",
      "Anillado federado completado con éxito (4.5 mm)",
      "Triplica con creces el peso de nacimiento (~23g vs 4.5g)"
    ],
    careTips: "Limpiar suavemente cualquier suciedad seca de los párpados con suero fisiológico templado si fuera necesario.",
    warning: "Nunca forzar la apertura de los párpados con los dedos; deben abrirse de manera espontánea por hidratación natural."
  },
  {
    day: 8,
    title: "Ojos Abiertos y Cañones Alares",
    stage: "Fase 3: Cañones y Ojos (Días 8 - 14)",
    svgPhase: "stage_2_quills",
    weightMin: 23.0,
    weightMax: 32.0,
    weightAvg: 27.5,
    cropCapacity: "3.5 - 4.5 ml",
    temperature: "33.0°C - 33.5°C",
    feedingFrequency: "Cada 4 horas (4 a 5 tomas al día).",
    summary: "Los ojos están completamente abiertos. Asoman las puntas de los primeros cañones alares y caudales.",
    milestones: [
      "Ojos abiertos al 100%, mirada atenta a la luz",
      "Cañones alares despuntando a través de la piel",
      "Reconocimiento auditivo de los padres"
    ],
    careTips: "El pollo ya mira a su alrededor y empieza a enfocar. Evitar ruidos bruscos o luces directas cegadoras cerca de la caja nido.",
    warning: "Último día prudencial para anillar si no se hizo antes. Si el tarso ya no entra, no forzar."
  },
  {
    day: 9,
    title: "Emergencia de Cañones en Cresta",
    stage: "Fase 3: Cañones y Ojos (Días 8 - 14)",
    svgPhase: "stage_2_quills",
    weightMin: 27.0,
    weightMax: 37.0,
    weightAvg: 32.0,
    cropCapacity: "4.0 - 5.0 ml",
    temperature: "32.5°C - 33.0°C",
    feedingFrequency: "Cada 4 horas (4 tomas al día).",
    summary: "Aparecen pequeños cañoncitos en la coronilla: la inconfundible cresta de la ninfa comienza a brotar.",
    milestones: [
      "Brote de los cañones de la cresta en la cabeza",
      "Cañones dorsales alineados en el tracto espinal",
      "Reflejo de silbido defensivo si se abre la tapa del nido"
    ],
    careTips: "El silbido sibilante ('hissing') es una conducta natural de autodefensa del pollo de ninfa: demuestra vigor y buen estado neurológico.",
    warning: "Asegurar que los padres reciben suficiente calcio y proteína (pasta de cría y huevo cocido) para nutrir la rápida síntesis de queratina."
  },
  {
    day: 10,
    title: "Los Cañones se Oscurecen",
    stage: "Fase 3: Cañones y Ojos (Días 8 - 14)",
    svgPhase: "stage_2_quills",
    weightMin: 32.0,
    weightMax: 43.0,
    weightAvg: 37.5,
    cropCapacity: "4.5 - 6.0 ml",
    temperature: "32.0°C - 32.5°C",
    feedingFrequency: "Cada 4.5 horas (4 tomas al día).",
    summary: "Se empieza a intuir la mutación: cañones oscuros (ancestral/gris) o cañones claros/amarillentos (perlado/lutino).",
    milestones: [
      "Pigmentación visible en el interior de los cañones",
      "El pichón se apoya firmemente sobre ambos tarsos",
      "Consumo de buche rápido y eficiente"
    ],
    careTips: "Impa es una ninfa perlada: sus pichones mostrarán un tono de cañones claro o contrastado con amarillo.",
    warning: "No tocar los cañones con fuerza: son 'plumas de sangre' muy vascularizadas; si se rompen pueden sangrar intensamente."
  },
  {
    day: 11,
    title: "Desarrollo del Tracto Pterilario",
    stage: "Fase 3: Cañones y Ojos (Días 8 - 14)",
    svgPhase: "stage_2_quills",
    weightMin: 37.0,
    weightMax: 49.0,
    weightAvg: 43.0,
    cropCapacity: "5.0 - 6.5 ml",
    temperature: "31.5°C - 32.0°C",
    feedingFrequency: "Cada 4.5 - 5 horas (4 tomas al día).",
    summary: "Los cañones de la cola (timoneras) y de las alas (remeras primarias y secundarias) crecen varios milímetros por día.",
    milestones: [
      "Remeras y timoneras creciendo rápidamente en tubo",
      "Grosor óseo del pico casi duplicado",
      "Acicalamiento incipiente entre hermanos de nidada"
    ],
    careTips: "Mantener una buena ventilación sin corrientes de aire en la habitación del nido para renovar el oxígeno.",
    warning: "Humedad ideal recomendada en el ambiente: 50% - 60% para que los cañones no se resequen."
  },
  {
    day: 12,
    title: "Interacción Auditiva y Social",
    stage: "Fase 3: Cañones y Ojos (Días 8 - 14)",
    svgPhase: "stage_2_quills",
    weightMin: 42.0,
    weightMax: 54.0,
    weightAvg: 48.0,
    cropCapacity: "5.5 - 7.0 ml",
    temperature: "31.0°C - 31.5°C",
    feedingFrequency: "Cada 5 horas (4 tomas al día).",
    summary: "El pollo ya emite el típico gorjeo de ninfa al notar presencia humana o de los padres.",
    milestones: [
      "Vocalizaciones diferenciadas de hambre y de satisfacción",
      "Pesa cerca de 50 gramos (mitad del peso de un adulto)",
      "Capacidad de estirar las alas de forma coordinada"
    ],
    careTips: "Hablarle con voz suave y tranquila ayuda a familiarizar al pichón con el contacto humano respetuoso.",
    warning: "Evitar tomas demasiado líquidas si se ayuda con papilla: una papilla con textura de yogur suave a 38°C - 39°C es lo óptimo."
  },
  {
    day: 13,
    title: "Espesamiento del Plumón Secundario",
    stage: "Fase 3: Cañones y Ojos (Días 8 - 14)",
    svgPhase: "stage_2_quills",
    weightMin: 46.0,
    weightMax: 60.0,
    weightAvg: 53.0,
    cropCapacity: "6.0 - 7.5 ml",
    temperature: "30.5°C - 31.0°C",
    feedingFrequency: "Cada 5 horas (4 tomas al día).",
    summary: "Un plumón grisáceo/blanquecino secundario cubre el cuerpo entre los cañones, proporcionando aislamiento.",
    milestones: [
      "Plumón secundario denso bajo las axilas y abdomen",
      "Cresta con cañones de más de 8 mm de longitud",
      "Mantenimiento de temperatura corporal durante periodos breves"
    ],
    careTips: "Cambiar o reforzar la viruta del nido si está húmeda por las heces abundantes de esta etapa de rápido crecimiento.",
    warning: "La humedad excesiva por heces en el nido propicia hongos y bacterias que pueden afectar a las patas y cloaca."
  },
  {
    day: 14,
    title: "Cierre de la Segunda Semana (55g+)",
    stage: "Fase 3: Cañones y Ojos (Días 8 - 14)",
    svgPhase: "stage_2_quills",
    weightMin: 50.0,
    weightMax: 65.0,
    weightAvg: 58.0,
    cropCapacity: "6.5 - 8.0 ml",
    temperature: "30.0°C - 30.5°C",
    feedingFrequency: "Cada 5 - 5.5 horas (4 tomas al día).",
    summary: "Hito crucial: 2 semanas de vida. El pollo supera el 50%-60% del peso corporal adulto y muestra enorme vitalidad.",
    milestones: [
      "Cumplidas 2 semanas exactas de vida",
      "Peso de referencia saludable: 55 a 65 gramos",
      "Preparado para la espectacular fase de desvainado"
    ],
    careTips: "A partir de este momento el crecimiento es principalmente de pluma y hueso; mantener rica la dieta de los progenitores con semillas variadas y brócoli fresco.",
    warning: "Cuidado con cambios bruscos de temperatura ambiental si se retira a los pollos del nido para inspección."
  },
  {
    day: 15,
    title: "La Fascinante Fase 'Erizo'",
    stage: "Fase 4: Fase Erizo y Cresta (Días 15 - 21)",
    svgPhase: "stage_3_porcupine",
    weightMin: 55.0,
    weightMax: 70.0,
    weightAvg: 62.5,
    cropCapacity: "7.0 - 8.5 ml",
    temperature: "29.5°C - 30.0°C",
    feedingFrequency: "Cada 5.5 horas (3 a 4 tomas al día).",
    summary: "El pollo parece un pequeño puercoespín o erizo cubierto de cientos de cañones de queratina.",
    milestones: [
      "Aspecto de 'erizo' en su máxima expresión",
      "Los extremos de los cañones alares comienzan a afinarse para abrirse",
      "Movimiento voluntario de la cresta hacia adelante y atrás"
    ],
    careTips: "No intentar desprender las vainas duras a mano; el propio pollo y sus padres las desvainarán con el acicalamiento natural.",
    warning: "Si un cañón sangra por un golpe, aplicar un toque de almidón de maíz (maicena) o polvo hemostático y presionar suavemente 1 minuto."
  },
  {
    day: 16,
    title: "Primer Desvainado (Puntas de Pluma)",
    stage: "Fase 4: Fase Erizo y Cresta (Días 15 - 21)",
    svgPhase: "stage_3_porcupine",
    weightMin: 59.0,
    weightMax: 74.0,
    weightAvg: 66.5,
    cropCapacity: "7.5 - 9.0 ml",
    temperature: "29.0°C - 29.5°C",
    feedingFrequency: "Cada 6 horas (3 tomas al día).",
    summary: "Las puntas de los cañones se abren como pinceles. Se asoma el primer color real de las plumas.",
    milestones: [
      "Aparición del pincel de pluma en la punta de los cañones",
      "Se definen los tonos de la cresta (amarillo vibrante en perlados)",
      "Primeros estiramientos de patas y alas a la vez ('yoga aviario')"
    ],
    careTips: "El polvillo blanco de queratina que desprenden las vainas al romperse es normal y señal de desarrollo excelente.",
    warning: "Asegurar que la habitación esté bien ventilada por el polvillo de queratina que se produce en esta etapa."
  },
  {
    day: 17,
    title: "La Cresta se Despliega",
    stage: "Fase 4: Fase Erizo y Cresta (Días 15 - 21)",
    svgPhase: "stage_3_porcupine",
    weightMin: 63.0,
    weightMax: 78.0,
    weightAvg: 70.0,
    cropCapacity: "8.0 - 9.5 ml",
    temperature: "28.5°C - 29.0°C",
    feedingFrequency: "Cada 6 horas (3 tomas al día).",
    summary: "La cresta de la ninfa se abre en un penacho vistoso. Las mejillas muestran pequeños cañoncitos anaranjados.",
    milestones: [
      "Penacho de la cresta claramente visible y eréctil",
      "Color anaranjado brotando en las cobertoras de los oídos (mejillas)",
      "El pichón se sienta erguido con elegancia"
    ],
    careTips: "La expresión facial ya es inconfundible de una ninfa joven. Los lazos de apego con sus cuidadores se consolidan.",
    warning: "No bañar ni mojar directamente al pollo todavía; el plumón debe abrirse en seco."
  },
  {
    day: 18,
    title: "Alas en Abanico Perlado",
    stage: "Fase 4: Fase Erizo y Cresta (Días 15 - 21)",
    svgPhase: "stage_3_porcupine",
    weightMin: 67.0,
    weightMax: 82.0,
    weightAvg: 74.0,
    cropCapacity: "8.0 - 10.0 ml",
    temperature: "28.0°C - 28.5°C",
    feedingFrequency: "Cada 6 horas (3 tomas al día).",
    summary: "Las plumas de las alas se abren en un tercio de su longitud. En hijos de Impa se revelan los bordes nacarados/perla.",
    milestones: [
      "Patrón de alas definido al 50%",
      "Termorregulación casi completa (ya no necesita calor constante de los padres de día)",
      "El buche tolera tomas más espaciadas y consistentes"
    ],
    careTips: "A esta edad los padres a menudo salen del nido durante el día y solo entran a cebar y a dormir por la noche.",
    warning: "Si la temperatura ambiente de la sala baja de 22°C, mantener fuente de calor suave en el nido."
  },
  {
    day: 19,
    title: "Curiosidad y Exploración del Nido",
    stage: "Fase 4: Fase Erizo y Cresta (Días 15 - 21)",
    svgPhase: "stage_3_porcupine",
    weightMin: 70.0,
    weightMax: 85.0,
    weightAvg: 77.0,
    cropCapacity: "8.5 - 10.5 ml",
    temperature: "27.5°C - 28.0°C",
    feedingFrequency: "Cada 6 a 7 horas (3 tomas al día).",
    summary: "El pollo camina con agilidad dentro de la caja nido. Asoma el pico hacia la entrada cuando escucha pasos.",
    milestones: [
      "Marcha firme sobre los dedos sin tambaleo",
      "Respuesta visual inmediata a estímulos móviles",
      "Picos pequeños contra las paredes del nido por curiosidad"
    ],
    careTips: "Ofrecer ramas de panizo en el fondo del nido: el pollo empezará a picotearlo por juego, preparando el destete.",
    warning: "Comprobar que la abertura del nido no tenga astillas que puedan enganchar plumas nuevas."
  },
  {
    day: 20,
    title: "Plumaje Pectoral y Cola",
    stage: "Fase 4: Fase Erizo y Cresta (Días 15 - 21)",
    svgPhase: "stage_3_porcupine",
    weightMin: 73.0,
    weightMax: 88.0,
    weightAvg: 80.0,
    cropCapacity: "9.0 - 11.0 ml",
    temperature: "27.0°C - 27.5°C",
    feedingFrequency: "3 tomas al día (mañana, tarde y noche).",
    summary: "El pecho y abdomen se cubren de plumas suaves. La cola se alarga notablemente.",
    milestones: [
      "Pecho completamente emplumado sin zonas desnudas",
      "Cola alcanzando 3-4 cm de longitud",
      "Alcanza los 80 gramos de peso (80-85% del peso adulto)"
    ],
    careTips: "Dejar que el pollo interactúe fuera del nido unos minutos al día sobre una toalla limpia estimula su desarrollo sensorial.",
    warning: "Vigilar caídas desde alturas: el pollo aún no vuela y un golpe pectoral puede ser grave."
  },
  {
    day: 21,
    title: "¡3 Semanas Cumplidas! (21 Días)",
    stage: "Fase 4: Fase Erizo y Cresta (Días 15 - 21)",
    svgPhase: "stage_3_porcupine",
    weightMin: 75.0,
    weightMax: 90.0,
    weightAvg: 82.5,
    cropCapacity: "9.0 - 11.0 ml",
    temperature: "26.5°C - 27.0°C",
    feedingFrequency: "3 tomas al día (cada 7 horas aprox).",
    summary: "Hito crucial: La incubación de un huevo dura 21 días, ¡y tu pollo ya lleva 21 días viviendo fuera del cascarón!",
    milestones: [
      "3 semanas de vida completadas con éxito",
      "Termorregulación autónoma completada",
      "Aleteos enérgicos en el fondo del nido para muscular"
    ],
    careTips: "Colocar un comedero bajo con semillas de mijo blanco y pienso triturado en el nido.",
    warning: "Mantener la constancia en el peso: a partir del día 25-28 es normal que bajen 2-4g al afinarse para volar."
  },
  {
    day: 22,
    title: "Ejercicios de Aleteo y Musculación",
    stage: "Fase 5: Emplume y 1er Mes (Días 22 - 30)",
    svgPhase: "stage_4_feathered",
    weightMin: 77.0,
    weightMax: 92.0,
    weightAvg: 84.0,
    cropCapacity: "9.0 - 11.5 ml",
    temperature: "25.0°C - 26.0°C (temperatura ambiente cálida)",
    feedingFrequency: "3 tomas al día.",
    summary: "El pichón bate fuertemente sus alas agarrándose al fondo del nido con las garras para fortalecer sus pectorales.",
    milestones: [
      "Sesiones de aleteo vigoroso en el nido",
      "Plumaje dorsal cerrado en un 80%",
      "Se rasca la cabeza por encima del ala con destreza"
    ],
    careTips: "El pollo ya puede tolerar temperatura ambiente estándar (23°C - 25°C) si no hay corrientes de aire.",
    warning: "No apresurar el destete: aunque coma semillas, sigue necesitando el aporte nutritivo de sus padres o papilla."
  },
  {
    day: 23,
    title: "Asomando la Cabeza al Exterior",
    stage: "Fase 5: Emplume y 1er Mes (Días 22 - 30)",
    svgPhase: "stage_4_feathered",
    weightMin: 79.0,
    weightMax: 94.0,
    weightAvg: 85.5,
    cropCapacity: "9.0 - 11.5 ml",
    temperature: "24.0°C - 25.5°C",
    feedingFrequency: "3 tomas al día.",
    summary: "El pichón trepa hacia el orificio de salida de la caja nido para observar el mundo exterior.",
    milestones: [
      "Asoma el pico y la cresta por la piquera del nido",
      "Picoteo activo de granos de mijo en rama",
      "Mayor agudeza visual y respuesta a nombres o llamadas"
    ],
    careTips: "Poner un palo de madera suave dentro del nido a baja altura para que aprenda a posarse ('perching').",
    warning: "Asegurar que la jaula principal tenga barrotes con separación adecuada (máximo 1.5 cm) para que no meta la cabeza."
  },
  {
    day: 24,
    title: "Plumas Remeras Desvainadas",
    stage: "Fase 5: Emplume y 1er Mes (Días 22 - 30)",
    svgPhase: "stage_4_feathered",
    weightMin: 80.0,
    weightMax: 95.0,
    weightAvg: 87.0,
    cropCapacity: "9.0 - 11.5 ml",
    temperature: "24.0°C - 25.0°C",
    feedingFrequency: "3 tomas al día.",
    summary: "Las plumas de vuelo de las alas ya están abiertas al 85%. Los patrones de color se ven nítidos y hermosos.",
    milestones: [
      "Superficie alar completamente sustentadora",
      "Cola con plumas largas y bien alineadas",
      "Digestión completa de semillas blandas en heces"
    ],
    careTips: "Ofrecer verduras seguras como hojas de espinaca, acelga o zanahoria rallada para enriquecer su paladar.",
    warning: "Alimentos tóxicos prohibidos para aves: aguacate (palta), cebolla, ajo, chocolate, café y semillas de manzana."
  },
  {
    day: 25,
    title: "Primeros Pasos Fuera de la Caja Nido",
    stage: "Fase 5: Emplume y 1er Mes (Días 22 - 30)",
    svgPhase: "stage_4_feathered",
    weightMin: 81.0,
    weightMax: 96.0,
    weightAvg: 88.0,
    cropCapacity: "9.0 - 12.0 ml",
    temperature: "23.0°C - 24.5°C",
    feedingFrequency: "2 a 3 tomas al día (mañana y noche imprescindibles).",
    summary: "El pichón sale por primera vez de la caja nido al suelo de la jaula o parque de juegos.",
    milestones: [
      "Primera salida voluntaria del nido",
      "Posado firme sobre perchas de madera natural",
      "Primeros saltos con planeo hacia el suelo"
    ],
    careTips: "Colocar toallas en el suelo de la habitación durante los primeros vuelos para amortiguar aterrizajes torpes.",
    warning: "Cerrar ventanas, espejos y puertas; alejar recipientes con agua donde pueda caer accidentalmente."
  },
  {
    day: 26,
    title: "Coordinación de Vuelo y Destete",
    stage: "Fase 5: Emplume y 1er Mes (Días 22 - 30)",
    svgPhase: "stage_4_feathered",
    weightMin: 81.0,
    weightMax: 96.0,
    weightAvg: 87.5,
    cropCapacity: "8.0 - 11.0 ml",
    temperature: "22.0°C - 24.0°C",
    feedingFrequency: "2 tomas al día (mañana y noche).",
    summary: "Breves vuelos horizontales de medio metro a un metro. Descascarilla sus primeras semillas de mijo.",
    milestones: [
      "Descascarillado exitoso de granos de mijo blanco",
      "Planeos controlados de percha a percha",
      "Bebe pequeñas gotas de agua por imitación"
    ],
    careTips: "Poner bebedero plano poco profundo (tapa de frasco o plato pequeño) con agua fresca limpia.",
    warning: "No utilizar bebederos profundos donde el pichón pueda sumergirse y ahogarse."
  },
  {
    day: 27,
    title: "Plumaje Completo y Elegante",
    stage: "Fase 5: Emplume y 1er Mes (Días 22 - 30)",
    svgPhase: "stage_5_fledgling",
    weightMin: 80.0,
    weightMax: 95.0,
    weightAvg: 86.5,
    cropCapacity: "8.0 - 10.0 ml",
    temperature: "22.0°C - 24.0°C",
    feedingFrequency: "2 tomas al día.",
    summary: "Prácticamente no quedan cañones cerrados. Su aspecto es el de una ninfa adulta en miniatura con expresión juvenil.",
    milestones: [
      "Cuerpo cubierto de plumas sedosas al 95%",
      "Cresta larga, móvil y muy expresiva",
      "Afinamiento de peso típico pre-vuelo independiente"
    ],
    careTips: "Es completamente normal que el peso baje 2 a 4 gramos en estos días: su organismo pierde grasa y agua para facilitar el vuelo.",
    warning: "Si la pérdida supera el 10% de su peso máximo, reforzar la toma nocturna de papilla."
  },
  {
    day: 28,
    title: "Independencia Motora y Vuelo Guiado",
    stage: "Fase 5: Emplume y 1er Mes (Días 22 - 30)",
    svgPhase: "stage_5_fledgling",
    weightMin: 80.0,
    weightMax: 95.0,
    weightAvg: 86.0,
    cropCapacity: "7.0 - 10.0 ml",
    temperature: "21.0°C - 23.5°C",
    feedingFrequency: "2 tomas al día (o 1 toma nocturna si come abundante semilla).",
    summary: "Vuelos de varios metros aterrizando sobre perchas y sobre el hombro de su cuidador con precisión.",
    milestones: [
      "Vuelo libre con aterrizaje preciso sobre perchas",
      "Comer por sí mismo panizo, alpiste y pienso blando",
      "Acicalamiento minucioso de alas, cola y patas"
    ],
    careTips: "Felicitar al pollo con caricias suaves en la nuca cuando vuele hacia tu mano; afianza una relación de confianza eterna.",
    warning: "Cuidado con cables eléctricos y plantas tóxicas del hogar durante sus ratos de vuelo libre."
  },
  {
    day: 29,
    title: "Víspera del Primer Mes",
    stage: "Fase 5: Emplume y 1er Mes (Días 22 - 30)",
    svgPhase: "stage_5_fledgling",
    weightMin: 81.0,
    weightMax: 96.0,
    weightAvg: 87.0,
    cropCapacity: "7.0 - 9.0 ml",
    temperature: "20.0°C - 23.0°C (temperatura ambiente)",
    feedingFrequency: "1 a 2 tomas al día (destete progresivo).",
    summary: "El pichón ya es un volantón ágil, cariñoso y despierto. Su buche almacena semillas descascarilladas.",
    milestones: [
      "Autonomía alimentaria del 70% al 80%",
      "Respuesta vocal a silbidos y llamadas",
      "Excelente fuerza de agarre en dedos y tarsos"
    ],
    careTips: "Pesar tanto por la mañana como por la noche para confirmar que está comiendo suficiente semilla por sí solo.",
    warning: "No retirar la toma nocturna de apoyo hasta comprobar que el buche no se queda vacío antes de dormir."
  },
  {
    day: 30,
    title: "¡PRIMER MES DE VIDA! (30 Días)",
    stage: "Fase 5: Emplume y 1er Mes (Días 22 - 30)",
    svgPhase: "stage_5_fledgling",
    weightMin: 82.0,
    weightMax: 98.0,
    weightAvg: 88.5,
    cropCapacity: "6.0 - 8.0 ml (toma de refuerzo)",
    temperature: "Ambiente normal (20°C - 24°C)",
    feedingFrequency: "1 toma nocturna de consuelo/refuerzo o destete completado.",
    summary: "¡Objetivo cumplido! El pollo de Impa ha superado con éxito su primer mes crítico. Es un ejemplar juvenil hermoso, sano y fuerte.",
    milestones: [
      "¡1er Mes de vida cumplido con éxito!",
      "Plumaje juvenil completo y brillante",
      "Vuelo pleno y dominio del espacio",
      "Come mixtura, pienso extrusionado, panizo y verduras",
      "Personalidad propia formada y gran apego familiar"
    ],
    careTips: "¡Felicidades por completar el primer mes! Tu ninfa ya es un juvenil sano. Puedes continuar el registro de peso semanal durante los próximos meses hasta su primera muda a los 6-8 meses.",
    warning: "La primera muda ocurrirá entre los 6 y 9 meses, donde los machos perderán las perlas en el dorso y las hembras mantendrán el patrón nacarado de Impa."
  }
];

// Curva de peso estándar saludable (Día 0 a 30)
const CHICK_GROWTH_CURVE = [
  { day: 0, weight: 4.5 },
  { day: 2, weight: 6.5 },
  { day: 4, weight: 11.0 },
  { day: 6, weight: 18.5 },
  { day: 8, weight: 27.5 },
  { day: 10, weight: 37.5 },
  { day: 12, weight: 48.0 },
  { day: 14, weight: 58.0 },
  { day: 16, weight: 66.5 },
  { day: 18, weight: 74.0 },
  { day: 20, weight: 80.0 },
  { day: 22, weight: 84.0 },
  { day: 24, weight: 87.0 },
  { day: 26, weight: 87.5 },
  { day: 28, weight: 86.0 },
  { day: 30, weight: 88.5 }
];

// Guías de cuidados críticos del pollo
const CHICK_CARE_GUIDES = [
  {
    id: "banding_guide",
    title: "Protocolo de Anillado Oficial (4.5 mm)",
    badge: "DÍAS 6 A 8",
    color: "amber",
    icon: "ring_volume",
    desc: "El diámetro reglamentario para Ninfas / Carolinas (Nymphicus hollandicus) es de 4.5 mm (anilla cerrada federada de aluminio o policarbonato).",
    steps: [
      "Momento óptimo: Entre el Día 6 y Día 8. Antes se saldrá del pie; después de los 9 días la articulación no pasará sin riesgo de fractura.",
      "Desinfección y lubricante: Aplicar una gota de vaselina neutra o aceite de oliva templado en el tarso del pichón.",
      "Posición de los dedos: Juntar los 3 dedos delanteros (hacia el frente) y deslizar la anilla sobre ellos hasta superar la articulación.",
      "Extracción del dedo trasero: El dedo posterior quedará atrapado hacia atrás; tirar con extrema delicadeza usando un palillo romo con vaselina hasta que quede libre.",
      "Inspección: Revisar a las 2 horas que la madre no intente quitar la anilla ni se acumule edema."
    ]
  },
  {
    id: "splayed_legs",
    title: "Prevención de Patas de Rana (Splayed Legs)",
    badge: "PREVENCIÓN VITAL",
    color: "emerald",
    icon: "healing",
    desc: "Deformidad articular donde las patas se abren lateralmente por falta de agarre en el nido o exceso de peso de la madre.",
    steps: [
      "Sustrato adecuado: Usar fondo cóncavo de madera cubierto con viruta de pino no tratada limpia de al menos 3 cm de grosor.",
      "Nunca suelo liso: Cartón liso, plástico o periódicos lisos provocan que las patas resbalen y la articulación coxofemoral se desplace.",
      "Detección temprana: Si al día 5-10 las patas se abren en 'X' o hacia los lados, corregir de inmediato con una esponja de maquillaje perforada o una pequeña trabilla suave de espuma/hilo entre ambos tarsos.",
      "Tiempo de corrección: En pichones de menos de 12 días se corrige al 100% en 4 a 6 días gracias a la plasticidad ósea."
    ]
  },
  {
    id: "crop_stasis",
    title: "Buche Parado o Lento (Crop Stasis)",
    badge: "URGENCIA FRECUENTE",
    color: "red",
    icon: "warning",
    desc: "El buche no vacía su contenido en el tiempo habitual (4-6 horas), provocando fermentación ácida y proliferación de hongos (Candida).",
    steps: [
      "Causa #1: Temperatura baja: Si el nido o criadora baja de 30°C en pichones de menos de 15 días, el sistema digestivo se paraliza.",
      "Causa #2: Papilla fría o demasiado espesa: La papilla debe suministrarse siempre entre 38.5°C y 39.5°C medidos con termómetro.",
      "Protocolo de auxilio: Administrar 0.5 a 1 ml de infusión tibia de manzanilla o agua tibia con unas gotas de electrolitos y masajear con extrema suavidad el buche en sentido ascendente.",
      "Nunca dar más alimento sobre un buche lleno con comida fermentada."
    ]
  },
  {
    id: "weaning_guide",
    title: "Proceso de Destete Natural",
    badge: "DÍAS 25 A 35",
    color: "blue",
    icon: "restaurant",
    desc: "Transición guiada y respetuosa desde la alimentación de los padres o papilla hacia semillas y vegetales sólidos.",
    steps: [
      "Día 20-22: Introducir ramas de panizo (mijo blanco en espiga) en el fondo del nido. Su textura suave estimula el picoteo instintivo.",
      "Día 25: Poner un comedero bajo con mixtura limpia, pienso extrusionado mini y trocitos de brócoli o zanahoria.",
      "Reducción paulatina: Disminuir primero la toma del mediodía; mantener siempre la toma de la mañana y de la noche.",
      "Control estricto de báscula: Pesar a diario. El pichón está completamente destetado cuando mantiene su peso (>82g) durante 5 días seguidos sin tomas asistidas."
    ]
  }
];

if (typeof window !== 'undefined') {
  window.CHICK_STAGES = CHICK_STAGES;
  window.CHICK_GROWTH_CURVE = CHICK_GROWTH_CURVE;
  window.CHICK_CARE_GUIDES = CHICK_CARE_GUIDES;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CHICK_STAGES, CHICK_GROWTH_CURVE, CHICK_CARE_GUIDES };
}
