/**
 * Base de datos biológica del desarrollo y crecimiento del Pollo de Ninfa / Carolina (Nymphicus hollandicus)
 * Periodo de seguimiento neonatal y crianza: Día 0 (Eclosión) al Día 30 (Primer mes de vida).
 * 
 * PROTOCOLO DE CRIANZA:
 * - SEMANAS 1 A 3 (Días 0 al 20): Crianza 100% natural con los padres (Impa y pareja). Los padres incuban,
 *   aportan calor corporal y regurgitan leche de buche y alimento enriquecido. El criador nutre a los padres,
 *   supervisa el nido, anilla entre el Día 6 y 8, y controla pesos diarios.
 * - SEMANA 4 EN ADELANTE (Día 21 al 30+): Inicio de la alimentación a mano con jeringa y papilla tibia (38.5°C - 39.5°C).
 *   Pichón con termorregulación autónoma, defensas de los padres adquiridas y plumas desvainando, troquelando
 *   con gran docilidad hacia el destete.
 */

const CHICK_STAGES = [
  {
    day: 0,
    title: "Eclosión y Nacimiento (Neonato)",
    stage: "Semana 1: Neonato Crítico (Días 0 - 6)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 1)",
    svgPhase: "stage_0_neonate",
    weightMin: 3.5,
    weightMax: 5.2,
    weightAvg: 4.5,
    cropCapacity: "0.5 - 1.0 ml",
    temperature: "36.5°C - 37.0°C (Calor corporal de Impa)",
    feedingType: "Leche de buche regurgitada por los padres",
    feedingFrequency: "Primeras 8-12h absorbe vitelo. Luego los padres embuchan cada 2 a 3 horas.",
    summary: "El pichón rompe la cáscara tras 24-48h de picaje. Nace ciego y mojado, secándose bajo el plumón de los padres en el nido.",
    milestones: [
      "Eclosión exitosa bajo el calor del pecho de Impa y pareja",
      "Absorción natural del saco vitelino en el abdomen",
      "Presencia del diente de huevo en la punta del pico",
      "Primer secado del plumón amarillo en el nido de madera"
    ],
    careTips: "Crianza con los padres: No intervenir en el embuche las primeras 12h. Dejar al pichón tranquilo bajo sus padres. Proveer a los progenitores pasta de cría fresca, agua limpia y mixtura.",
    warning: "Si el ombligo presenta restos de yema abierta o sangrado, desinfectar con suavidad con clorhexidina diluida y devolver de inmediato al calor del nido."
  },
  {
    day: 1,
    title: "Primer Día de Vida Activa",
    stage: "Semana 1: Neonato Crítico (Días 0 - 6)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 1)",
    svgPhase: "stage_0_neonate",
    weightMin: 4.2,
    weightMax: 6.0,
    weightAvg: 5.0,
    cropCapacity: "0.8 - 1.2 ml",
    temperature: "36.5°C - 37.0°C (Incubación continua de los padres)",
    feedingType: "Leche de buche materna/paterna con anticuerpos",
    feedingFrequency: "Embuche de padres cada 2.5 - 3 horas (6 a 7 veces al día con descanso nocturno).",
    summary: "El plumón amarillo ya está esponjoso. El buche es traslúcido y se aprecia la leche de buche que le administran sus padres.",
    milestones: [
      "Primer embuche exitoso de 'leche de buche' rica en inmunoglobulinas",
      "El buche se vacía completamente entre tomas (digestión activa)",
      "Movimientos reflejos de cabeza pidiendo alimento a los padres"
    ],
    careTips: "Revisar el nido una o dos veces al día cuando los padres salgan a comer. El buche debe verse repleto pero no tenso. Administrar a los padres huevo cocido rallado.",
    warning: "Si los padres no embuchan pasadas 18 horas de nacido o el pichón está frío, colocar bajo lámpara de calor y consultar soporte de emergencia."
  },
  {
    day: 2,
    title: "Digestión y Reflejo de Succión",
    stage: "Semana 1: Neonato Crítico (Días 0 - 6)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 1)",
    svgPhase: "stage_0_neonate",
    weightMin: 5.5,
    weightMax: 7.8,
    weightAvg: 6.5,
    cropCapacity: "1.0 - 1.5 ml",
    temperature: "36.0°C - 36.5°C (Calor natural en nido)",
    feedingType: "Embuche natural regurgitado por los padres",
    feedingFrequency: "Embuches cada 3 horas (6 tomas al día por Impa y su pareja).",
    summary: "Aumento notable de la movilidad y del reflejo de deglución. La piel sigue siendo rosada y muy transparente.",
    milestones: [
      "Respuesta refleja al contacto táctil en el pico",
      "Ganancia de peso del 15% al 20% respecto al día anterior",
      "Heces firmes y bien hidratadas con uratos blancos en el nido"
    ],
    careTips: "Mantener el fondo cóncavo del nido con una capa densa de viruta de pino no tratada limpia para que las patitas apoyen con firmeza y no resbalen.",
    warning: "Nunca utilizar serrín fino o viruta con polvo; puede obstruir las vías respiratorias y los ojos del neonato."
  },
  {
    day: 3,
    title: "Consolidación Metabólica",
    stage: "Semana 1: Neonato Crítico (Días 0 - 6)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 1)",
    svgPhase: "stage_0_neonate",
    weightMin: 7.0,
    weightMax: 10.0,
    weightAvg: 8.5,
    cropCapacity: "1.2 - 2.0 ml",
    temperature: "35.5°C - 36.0°C (Padres incuban por turnos)",
    feedingType: "Embuche natural paterno + pasta de cría predigerida",
    feedingFrequency: "Cada 3 a 3.5 horas (5 a 6 embuches al día).",
    summary: "El pichón casi duplica su peso de nacimiento. Se distingue la masa muscular del cuello y de los tarsos.",
    milestones: [
      "Duplicación del peso inicial respecto a la eclosión",
      "Inicio del desarrollo de folículos primarios bajo la dermis",
      "Saco vitelino 100% reabsorbido sin cicatriz visible"
    ],
    careTips: "Pesar al pichón todos los días a la misma hora (por la mañana) retirándolo del nido solo 1 minuto sobre un cuenco con servilleta tibia.",
    warning: "Un pichón que pierde peso dos días seguidos indica que los padres no lo están alimentando equitativamente si hay hermanos mayores."
  },
  {
    day: 4,
    title: "Inicio del Crecimiento Acelerado",
    stage: "Semana 1: Neonato Crítico (Días 0 - 6)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 1)",
    svgPhase: "stage_1_early",
    weightMin: 9.0,
    weightMax: 13.0,
    weightAvg: 11.0,
    cropCapacity: "1.5 - 2.5 ml",
    temperature: "35.0°C - 35.5°C (Calor de nido de madera)",
    feedingType: "Alimentación por los padres (semillas y pasta)",
    feedingFrequency: "Embuche paterno cada 3.5 horas (5 tomas al día).",
    summary: "Las extremidades y tarsos se alargan. La cabeza se vuelve más erguida y los párpados comienzan a marcar una hendidura.",
    milestones: [
      "Hendidura de los párpados claramente visible",
      "Engrosamiento de los dedos y almohadillas plantares",
      "Caída natural del diente de huevo en el pico"
    ],
    careTips: "Vigilar la postura de las patitas: deben permanecer flexionadas debajo del abdomen, nunca abiertas hacia los lados (prevención de patas de rana).",
    warning: "Si el sustrato del nido se vuelve resbaladizo, añadir viruta limpia para evitar displasia coxofemoral."
  },
  {
    day: 5,
    title: "Aparición de Puntos Foliculares",
    stage: "Semana 1: Neonato Crítico (Días 0 - 6)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 1)",
    svgPhase: "stage_1_early",
    weightMin: 12.0,
    weightMax: 17.0,
    weightAvg: 14.5,
    cropCapacity: "2.0 - 3.0 ml",
    temperature: "34.5°C - 35.0°C (Ambiente cálido en nido)",
    feedingType: "Embuche natural por Impa y pareja",
    feedingFrequency: "Cada 3.5 - 4 horas (5 tomas al día de los padres).",
    summary: "Se aprecian pequeños puntitos oscuros o claros bajo la piel en los bordes de las alas: los futuros cañones de plumas.",
    milestones: [
      "Puntos foliculares alares visibles bajo la piel",
      "Capacidad de erguir el cuello con firmeza durante el embuche",
      "Voz con tono audible más marcado al pedir comida a los padres"
    ],
    careTips: "Preparar las anillas oficiales federadas (diámetro estándar ninfa: 4.5 mm) para anillar entre mañana y el día 8.",
    warning: "Tener listas las anillas de 4.5 mm: si se deja pasar el día 8, el tarso engrosa y no se podrá anillar de forma indolora."
  },
  {
    day: 6,
    title: "Ventana de Anillado Oficial (Inicio)",
    stage: "Semana 1: Neonato Crítico (Días 0 - 6)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 1)",
    svgPhase: "stage_1_early",
    weightMin: 15.0,
    weightMax: 22.0,
    weightAvg: 18.5,
    cropCapacity: "2.5 - 3.5 ml",
    temperature: "34.0°C - 34.5°C (Nido protegido)",
    feedingType: "Embuche natural paterno",
    feedingFrequency: "Cada 4 horas (5 tomas al día administradas por los padres).",
    summary: "Los ojos empiezan a abrir una fina rendija. Comienza la ventana ideal para el anillado reglamentario mientras los padres salen a comer.",
    milestones: [
      "Inicio de apertura ocular en forma de ranura",
      "Tamaño articular de la pata ideal para anilla de 4.5 mm",
      "Tracción fuerte de las garras sobre el nido"
    ],
    careTips: "Procedimiento de anillado en nido: Juntar los 3 dedos delanteros, pasar la anilla hacia atrás con vaselina y liberar con cuidado el dedo posterior. Devolver enseguida al nido.",
    warning: "Comprobar a las 2 horas de anillar que los padres no hayan picado la anilla intentando retirarla."
  },
  {
    day: 7,
    title: "Anillado Óptimo y Fin de Semana 1",
    stage: "Semana 2: Crecimiento y Cañones (Días 7 - 13)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 2)",
    svgPhase: "stage_1_early",
    weightMin: 19.0,
    weightMax: 27.0,
    weightAvg: 23.0,
    cropCapacity: "3.0 - 4.0 ml",
    temperature: "33.5°C - 34.0°C (Padres incuban juntos)",
    feedingType: "Embuche paterno abundante",
    feedingFrequency: "Cada 4 horas (5 tomas al día de los progenitores).",
    summary: "Los ojos se abren progresivamente revelando el iris oscuro. La anilla federada queda fijada de por vida. Supera los 20g.",
    milestones: [
      "Ojos entreabiertos al 50%",
      "Anillado federado completado con éxito (4.5 mm)",
      "Triplica con creces el peso de nacimiento (~23g vs 4.5g)"
    ],
    careTips: "Limpiar suavemente cualquier suciedad seca de los párpados con suero fisiológico templado si fuera necesario.",
    warning: "Nunca forzar la apertura de los párpados con los dedos; deben abrirse de manera espontánea."
  },
  {
    day: 8,
    title: "Ojos Abiertos y Cañones Alares",
    stage: "Semana 2: Crecimiento y Cañones (Días 7 - 13)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 2)",
    svgPhase: "stage_2_quills",
    weightMin: 23.0,
    weightMax: 32.0,
    weightAvg: 27.5,
    cropCapacity: "3.5 - 4.5 ml",
    temperature: "33.0°C - 33.5°C (Calor natural en nido)",
    feedingType: "Embuche paterno con semillas predigeridas y pasta",
    feedingFrequency: "Cada 4 horas (4 a 5 tomas al día por los padres).",
    summary: "Los ojos están completamente abiertos. Asoman las puntas de los primeros cañones alares y caudales.",
    milestones: [
      "Ojos abiertos al 100%, mirada atenta a la luz",
      "Cañones alares despuntando a través de la piel",
      "Reconocimiento auditivo del reclamo de los padres"
    ],
    careTips: "El pichón ya enfoca y mira cuando se abre el nido. Evitar ruidos bruscos o luces directas cegadoras cerca de la caja nido.",
    warning: "Último día prudencial para anillar si no se hizo antes. Si el tarso ya no entra con facilidad, no forzar."
  },
  {
    day: 9,
    title: "Emergencia de Cañones en Cresta",
    stage: "Semana 2: Crecimiento y Cañones (Días 7 - 13)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 2)",
    svgPhase: "stage_2_quills",
    weightMin: 27.0,
    weightMax: 37.0,
    weightAvg: 32.0,
    cropCapacity: "4.0 - 5.0 ml",
    temperature: "32.5°C - 33.0°C (Nido de madera ventilado)",
    feedingType: "Embuche de padres (alta proteína)",
    feedingFrequency: "Cada 4 horas (4 tomas abundantes al día de los padres).",
    summary: "Aparecen pequeños cañoncitos en la coronilla: la inconfundible cresta de la ninfa comienza a brotar.",
    milestones: [
      "Brote de los cañones de la cresta en la cabeza",
      "Cañones dorsales alineados en el tracto espinal",
      "Reflejo de silbido defensivo si se abre la tapa del nido"
    ],
    careTips: "El silbido sibilante ('hissing') es una conducta natural de autodefensa del pollo de ninfa: demuestra vigor y excelente salud.",
    warning: "Asegurar que Impa y su pareja dispongan de jibia (hueso de sepia) y brócoli fresco para la síntesis de queratina de las plumas."
  },
  {
    day: 10,
    title: "Los Cañones se Oscurecen o Aclaran",
    stage: "Semana 2: Crecimiento y Cañones (Días 7 - 13)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 2)",
    svgPhase: "stage_2_quills",
    weightMin: 32.0,
    weightMax: 43.0,
    weightAvg: 37.5,
    cropCapacity: "4.5 - 6.0 ml",
    temperature: "32.0°C - 32.5°C (Calor de nido)",
    feedingType: "Embuche paterno denso",
    feedingFrequency: "Cada 4.5 horas (4 tomas al día de los padres).",
    summary: "Se empieza a intuir la mutación: cañones oscuros (ancestral/gris) o cañones claros/amarillentos (perlado de Impa).",
    milestones: [
      "Pigmentación visible en el interior de los cañones",
      "El pichón se apoya firmemente sobre ambos tarsos",
      "Consumo de buche rápido y digestión muy activa"
    ],
    careTips: "Impa es perlada: sus pichones mostrarán un tono de cañones claro o nacarado contrastado con amarillo.",
    warning: "No tocar los cañones con fuerza: son plumas de sangre muy vascularizadas; si se rompen pueden sangrar."
  },
  {
    day: 11,
    title: "Desarrollo del Tracto Pterilario",
    stage: "Semana 2: Crecimiento y Cañones (Días 7 - 13)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 2)",
    svgPhase: "stage_2_quills",
    weightMin: 37.0,
    weightMax: 49.0,
    weightAvg: 43.0,
    cropCapacity: "5.0 - 6.5 ml",
    temperature: "31.5°C - 32.0°C (Padres protegen el nido)",
    feedingType: "Embuche paterno regular",
    feedingFrequency: "Cada 4.5 - 5 horas (4 tomas al día de los padres).",
    summary: "Los cañones de la cola y alas crecen varios milímetros por día bajo el cuidado de los padres.",
    milestones: [
      "Remeras y timoneras creciendo en tubo rígido",
      "Grosor óseo del pico casi duplicado",
      "Acicalamiento incipiente entre hermanos de nidada"
    ],
    careTips: "Cambiar parcialmente la viruta sucia de la esquina del nido aprovechando un momento en que los padres salen a comer.",
    warning: "Mantener la habitación a 22°C - 24°C con humedad del 50%-60% para favorecer el crecimiento de la pluma."
  },
  {
    day: 12,
    title: "Interacción Auditiva en el Nido",
    stage: "Semana 2: Crecimiento y Cañones (Días 7 - 13)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 2)",
    svgPhase: "stage_2_quills",
    weightMin: 42.0,
    weightMax: 54.0,
    weightAvg: 48.0,
    cropCapacity: "5.5 - 7.0 ml",
    temperature: "31.0°C - 31.5°C (Aislamiento con plumón)",
    feedingType: "Embuche natural por los padres",
    feedingFrequency: "Cada 5 horas (4 tomas al día de los padres).",
    summary: "El pollo emite el gorjeo característico de ninfa al notar la presencia de Impa, de su pareja o de su cuidador.",
    milestones: [
      "Vocalizaciones diferenciadas de hambre y de satisfacción",
      "Pesa cerca de 50 gramos (la mitad del peso de un adulto)",
      "Capacidad de estirar las alas de forma coordinada"
    ],
    careTips: "Hablarle con voz suave y tranquila al abrir el nido ayuda a familiarizar al pichón con el contacto humano respetuoso.",
    warning: "Asegurarse de que los padres no estén estresados por visitas excesivas al nido; limitar las inspecciones a 2 veces al día."
  },
  {
    day: 13,
    title: "Espesamiento del Plumón Secundario",
    stage: "Semana 2: Crecimiento y Cañones (Días 7 - 13)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 2)",
    svgPhase: "stage_2_quills",
    weightMin: 46.0,
    weightMax: 60.0,
    weightAvg: 53.0,
    cropCapacity: "6.0 - 7.5 ml",
    temperature: "30.5°C - 31.0°C (Plumón secundario aislante)",
    feedingType: "Embuche paterno concentrado",
    feedingFrequency: "Cada 5 horas (4 tomas abundantes al día).",
    summary: "Un plumón grisáceo/blanquecino secundario cubre el cuerpo entre los cañones, proporcionando aislamiento térmico.",
    milestones: [
      "Plumón secundario denso bajo las axilas y abdomen",
      "Cresta con cañones de más de 8 mm de longitud",
      "Mantenimiento de temperatura corporal durante periodos breves"
    ],
    careTips: "Reforzar la viruta del nido si está húmeda por las heces abundantes de esta etapa de crecimiento explosivo.",
    warning: "La humedad acumulada en el nido propicia hongos y bacterias que pueden afectar a las patas y a la cloaca."
  },
  {
    day: 14,
    title: "Cierre de la Segunda Semana (55g+)",
    stage: "Semana 2: Crecimiento y Cañones (Días 7 - 13)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 2)",
    svgPhase: "stage_2_quills",
    weightMin: 50.0,
    weightMax: 65.0,
    weightAvg: 58.0,
    cropCapacity: "6.5 - 8.0 ml",
    temperature: "30.0°C - 30.5°C (Nido templado)",
    feedingType: "Embuche paterno con grano y pasta",
    feedingFrequency: "Cada 5 - 5.5 horas (4 tomas al día de los padres).",
    summary: "Hito crucial: 2 semanas completas con los padres. El pollo supera el 55% del peso adulto y muestra gran vitalidad.",
    milestones: [
      "Cumplidas 2 semanas exactas de vida con sus padres",
      "Peso saludable: 55 a 65 gramos",
      "Preparado para la espectacular fase de desvainado"
    ],
    careTips: "A partir de ahora el crecimiento es principalmente de pluma y hueso; seguir enriqueciendo la dieta de Impa con semillas y verduras.",
    warning: "Cuidado con corrientes de aire frío al sacar al pollo del nido para el pesaje matutino."
  },
  {
    day: 15,
    title: "La Fascinante Fase 'Erizo'",
    stage: "Semana 3: Fase Erizo y Cresta (Días 14 - 20)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 3)",
    svgPhase: "stage_3_porcupine",
    weightMin: 55.0,
    weightMax: 70.0,
    weightAvg: 62.5,
    cropCapacity: "7.0 - 8.5 ml",
    temperature: "29.5°C - 30.0°C (Padres cubren principalmente de noche)",
    feedingType: "Embuche paterno (3 a 4 veces al día)",
    feedingFrequency: "Cada 5.5 horas (3 a 4 embuches diarios muy cargados).",
    summary: "El pollo parece un pequeño puercoespín o erizo cubierto de cientos de cañones de queratina.",
    milestones: [
      "Aspecto de 'erizo' en su máxima expresión dentro del nido",
      "Los extremos de los cañones alares comienzan a afinarse para abrirse",
      "Movimiento voluntario de la cresta hacia adelante y atrás"
    ],
    careTips: "No intentar desprender las vainas duras a mano; los padres y el propio pichón las desvainarán con el acicalamiento natural.",
    warning: "Si un cañón sangra por un golpe en el nido, aplicar maicena o polvo hemostático y presionar suavemente 1 minuto."
  },
  {
    day: 16,
    title: "Primer Desvainado (Puntas de Pluma)",
    stage: "Semana 3: Fase Erizo y Cresta (Días 14 - 20)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 3)",
    svgPhase: "stage_3_porcupine",
    weightMin: 59.0,
    weightMax: 74.0,
    weightAvg: 66.5,
    cropCapacity: "7.5 - 9.0 ml",
    temperature: "29.0°C - 29.5°C (Aislamiento de pluma)",
    feedingType: "Embuche paterno regular",
    feedingFrequency: "Cada 6 horas (3 tomas al día de los progenitores).",
    summary: "Las puntas de los cañones se abren como pinceles. Se asoma el primer color real de las plumas de las alas y cresta.",
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
    stage: "Semana 3: Fase Erizo y Cresta (Días 14 - 20)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 3)",
    svgPhase: "stage_3_porcupine",
    weightMin: 63.0,
    weightMax: 78.0,
    weightAvg: 70.0,
    cropCapacity: "8.0 - 9.5 ml",
    temperature: "28.5°C - 29.0°C (Los padres entran a cebar y dormir)",
    feedingType: "Embuche natural por los padres",
    feedingFrequency: "Cada 6 horas (3 tomas al día administradas por los padres).",
    summary: "La cresta de la ninfa se abre en un penacho vistoso. Las mejillas muestran pequeños cañoncitos anaranjados.",
    milestones: [
      "Penacho de la cresta claramente visible y eréctil",
      "Color anaranjado brotando en las cobertoras de los oídos (mejillas)",
      "El pichón se sienta erguido con elegancia en el nido"
    ],
    careTips: "La expresión facial ya es inconfundible de una ninfa joven. Los padres ahora pasan ratos posados fuera del nido.",
    warning: "No mojar ni bañar al pollo todavía; el plumaje debe abrirse en seco."
  },
  {
    day: 18,
    title: "Alas en Abanico Perlado",
    stage: "Semana 3: Fase Erizo y Cresta (Días 14 - 20)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 3)",
    svgPhase: "stage_3_porcupine",
    weightMin: 67.0,
    weightMax: 82.0,
    weightAvg: 74.0,
    cropCapacity: "8.0 - 10.0 ml",
    temperature: "28.0°C - 28.5°C (Termorregulación casi completa)",
    feedingType: "Embuche de padres (tomas concentradas)",
    feedingFrequency: "Cada 6 horas (3 tomas al día de los padres).",
    summary: "Las plumas de las alas se abren en un tercio de su longitud. En hijos de Impa se revelan los bordes nacarados/perla.",
    milestones: [
      "Patrón de alas definido al 50%",
      "Termorregulación autónoma casi completa gracias al plumón denso",
      "El buche tolera tomas más espaciadas y consistentes"
    ],
    careTips: "A esta edad los padres a menudo salen del nido durante el día y solo entran a cebar y a dormir por la noche.",
    warning: "Si la temperatura ambiental de la sala baja de 22°C, asegurarse de que no haya corrientes frías sobre la jaula."
  },
  {
    day: 19,
    title: "Curiosidad y Exploración del Nido",
    stage: "Semana 3: Fase Erizo y Cresta (Días 14 - 20)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 3)",
    svgPhase: "stage_3_porcupine",
    weightMin: 70.0,
    weightMax: 85.0,
    weightAvg: 77.0,
    cropCapacity: "8.5 - 10.5 ml",
    temperature: "27.5°C - 28.0°C (Cálido y protegido)",
    feedingType: "Embuche paterno potente",
    feedingFrequency: "Cada 6 a 7 horas (3 tomas al día de los padres).",
    summary: "El pollo camina con agilidad dentro del nido. Asoma el pico hacia la entrada cuando escucha a Impa o a su cuidador.",
    milestones: [
      "Marcha firme sobre los dedos sin tambaleo",
      "Respuesta visual inmediata a estímulos móviles",
      "Picos pequeños contra las paredes del nido por curiosidad"
    ],
    careTips: "Preparar los materiales para la 4ª semana: comprar papilla comercial para psitácidos de calidad, jeringas de 10-20 ml con punta redondeada y termómetro digital de cocina.",
    warning: "Comprobar que la abertura del nido no tenga astillas que puedan enganchar plumas nuevas."
  },
  {
    day: 20,
    title: "Último Día de Crianza Exclusiva con Padres",
    stage: "Semana 3: Fase Erizo y Cresta (Días 14 - 20)",
    rearingType: "parents",
    rearingLabel: "🐣 Crianza con Padres (Semana 3)",
    svgPhase: "stage_3_porcupine",
    weightMin: 73.0,
    weightMax: 88.0,
    weightAvg: 80.0,
    cropCapacity: "9.0 - 11.0 ml",
    temperature: "27.0°C - 27.5°C (Aislamiento pluma avanzado)",
    feedingType: "Últimos embuches de los padres en el nido",
    feedingFrequency: "3 tomas al día administradas por los padres.",
    summary: "Culminan las 3 semanas de crianza natural con Impa y su pareja. El pichón cuenta con flora intestinal madura, defensas maternas y 80g de peso.",
    milestones: [
      "3 semanas de crianza natural completadas con éxito",
      "Inmunidad y flora bacteriana transmitida por los padres consolidada",
      "Alcanza los 80 gramos de peso (80-85% del peso adulto)"
    ],
    careTips: "Tener lista la fauna box o cajón de empapillado con papel de cocina absorbente y la papilla comercial para iniciar la alimentación a mano mañana a primera hora.",
    warning: "No retirar al pichón de noche; esperar a la mañana del Día 21 para que la primera toma de papilla coincida con el buche vacío de la mañana."
  },
  {
    day: 21,
    title: "¡INICIO DE ALIMENTACIÓN A MANO! (Día 21 / 3 Semanas Cumplidas)",
    stage: "Semana 4: Empapillado a Mano (Días 21 - 27)",
    rearingType: "hand_feeding",
    rearingLabel: "🥣 Alimentación a Mano (Semana 4)",
    svgPhase: "stage_3_porcupine",
    weightMin: 75.0,
    weightMax: 90.0,
    weightAvg: 82.5,
    cropCapacity: "9.0 - 11.0 ml",
    temperature: "25.0°C - 26.5°C (Fauna box templada, sin corrientes)",
    feedingType: "Papilla comercial de psitácidos con jeringa a 38.5°C - 39.5°C",
    feedingFrequency: "3 tomas al día (8 - 10 ml por toma): Mañana 08:00, Tarde 15:00, Noche 22:00.",
    summary: "¡HITO DORADO! Se retira al pichón a su fauna box para comenzar el empapillado a mano. Ya tiene defensas de sus padres y se troquela con gran docilidad.",
    milestones: [
      "Transición exitosa del nido a la fauna box de empapillado",
      "Primera toma de papilla con jeringa aceptada con éxito",
      "Termorregulación autónoma completada (ya no necesita calor directo materno)",
      "Aleteos enérgicos para fortalecer los músculos pectorales"
    ],
    careTips: "Temperatura estricta de la papilla: 38.5°C - 39.5°C medida con termómetro. Suministrar suavemente introduciendo la jeringa por la comisura izquierda del pico hacia el lado derecho de la garganta.",
    warning: "¡PELIGRO DE QUEMADURA O BUCHE PARADO!: Si la papilla supera los 41°C quema el buche; si está a menos de 37°C se estanca y fermenta. Nunca forzar si el buche aún tiene comida de la toma anterior."
  },
  {
    day: 22,
    title: "Adaptación Plena al Empapillado",
    stage: "Semana 4: Empapillado a Mano (Días 21 - 27)",
    rearingType: "hand_feeding",
    rearingLabel: "🥣 Alimentación a Mano (Semana 4)",
    svgPhase: "stage_4_feathered",
    weightMin: 77.0,
    weightMax: 92.0,
    weightAvg: 84.0,
    cropCapacity: "9.0 - 11.5 ml",
    temperature: "25.0°C - 26.0°C (Ambiente templado y cómodo)",
    feedingType: "Papilla tibia con jeringa (consistencia yogur suave)",
    feedingFrequency: "3 tomas al día de 9 a 11 ml (aprox 10% del peso corporal).",
    summary: "El pichón reconoce la jeringa y pide papilla meneando la cabeza con el reflejo de deglución. Los lazos de confianza humana se afianzan a gran velocidad.",
    milestones: [
      "Reconocimiento visual inmediato de la jeringa de papilla",
      "Plumaje dorsal cerrado en un 80%",
      "Se rasca la cabeza por encima del ala con destreza"
    ],
    careTips: "Limpiar siempre el pico y el cuello con una gasa humedecida en agua tibia justo al terminar la toma para que no se seque la papilla sobre las plumas.",
    warning: "Mantener una higiene escrupulosa: lavar y desinfectar la jeringa con agua hirviendo o solución esterilizante tras cada toma."
  },
  {
    day: 23,
    title: "Curiosidad y Primer Panizo",
    stage: "Semana 4: Empapillado a Mano (Días 21 - 27)",
    rearingType: "hand_feeding",
    rearingLabel: "🥣 Alimentación a Mano (Semana 4)",
    svgPhase: "stage_4_feathered",
    weightMin: 79.0,
    weightMax: 94.0,
    weightAvg: 85.5,
    cropCapacity: "9.0 - 11.5 ml",
    temperature: "24.0°C - 25.5°C (Habitación templada)",
    feedingType: "Papilla tibia a mano (3 tomas) + panizo para picoteo",
    feedingFrequency: "3 tomas al día (9 - 11 ml) + colocar una rama de panizo (mijo blanco) en el suelo.",
    summary: "El pichón asoma la cabeza fuera de la fauna box con curiosidad. Comienza a mordisquear ramitas de panizo por instinto de juego.",
    milestones: [
      "Interés activo por picotear semillas blandas de panizo",
      "Asoma con seguridad hacia la percha o borde de la fauna box",
      "Mayor agudeza visual y respuesta a la voz de su dueño"
    ],
    careTips: "Colocar un trozo de rama de panizo en el suelo de la fauna box. Su textura suave estimula el instinto natural de descascarillar semillas sin prisa.",
    warning: "No reducir todavía las tomas de papilla: el panizo en este momento es solo juego y estimulación sensorial, no nutrición principal."
  },
  {
    day: 24,
    title: "Plumas Remeras Desvainadas",
    stage: "Semana 4: Empapillado a Mano (Días 21 - 27)",
    rearingType: "hand_feeding",
    rearingLabel: "🥣 Alimentación a Mano (Semana 4)",
    svgPhase: "stage_4_feathered",
    weightMin: 80.0,
    weightMax: 95.0,
    weightAvg: 87.0,
    cropCapacity: "9.0 - 11.5 ml",
    temperature: "24.0°C - 25.0°C (Temperatura ambiente templada)",
    feedingType: "Papilla a mano con jeringa (consistencia yogur denso)",
    feedingFrequency: "3 tomas al día (10 - 11 ml por toma a 39°C).",
    summary: "Las plumas de vuelo de las alas ya están abiertas al 85%. Los patrones perlados nacarados de la herencia de Impa lucen nítidos y brillantes.",
    milestones: [
      "Superficie alar completamente sustentadora",
      "Cola con plumas largas y bien alineadas",
      "El pichón disfruta subirse a la mano y recibir caricias en la nuca"
    ],
    careTips: "Ofrecer pequeñas hojas de brócoli o zanahoria finamente rallada junto a la fauna box para que empiece a descubrir texturas y colores vegetales.",
    warning: "Alimentos tóxicos letales prohibidos para aves: aguacate (palta), chocolate, café, cebolla, ajo y semillas de manzana."
  },
  {
    day: 25,
    title: "Primeros Pasos Fuera de la Fauna Box",
    stage: "Semana 4: Empapillado a Mano (Días 21 - 27)",
    rearingType: "hand_feeding",
    rearingLabel: "🥣 Alimentación a Mano (Semana 4)",
    svgPhase: "stage_4_feathered",
    weightMin: 81.0,
    weightMax: 96.0,
    weightAvg: 88.0,
    cropCapacity: "9.0 - 12.0 ml",
    temperature: "23.0°C - 24.5°C (Ambiente doméstico)",
    feedingType: "Papilla a mano (2 a 3 tomas) + inicio de semillas",
    feedingFrequency: "2 a 3 tomas al día (mañana y noche obligatorias, mediodía opcional si picotea panizo).",
    summary: "El pichón sale de la fauna box sobre una mesa o parque de juegos. Aletea con fuerza y da pequeños saltos controlados.",
    milestones: [
      "Primera salida voluntaria a explorar el exterior",
      "Posado firme sobre los dedos del cuidador y sobre perchas de madera",
      "Primeros saltos con planeo hacia el suelo"
    ],
    careTips: "Colocar toallas en el suelo durante las sesiones de juego para amortiguar aterrizajes torpes de sus primeros intentos de vuelo.",
    warning: "Cerrar ventanas, puertas y cubrir espejos; alejar recipientes con agua o líquidos calientes donde pueda caer."
  },
  {
    day: 26,
    title: "Coordinación de Vuelo y Transición al Destete",
    stage: "Semana 4: Empapillado a Mano (Días 21 - 27)",
    rearingType: "hand_feeding",
    rearingLabel: "🥣 Alimentación a Mano (Semana 4)",
    svgPhase: "stage_4_feathered",
    weightMin: 81.0,
    weightMax: 96.0,
    weightAvg: 87.5,
    cropCapacity: "8.0 - 11.0 ml",
    temperature: "22.0°C - 24.0°C (Temperatura ambiente normal)",
    feedingType: "Papilla a mano (2 tomas: mañana y noche) + mixtura",
    feedingFrequency: "2 tomas de papilla al día (10 ml c/u) + comedero bajo con mixtura limpia y panizo.",
    summary: "Vuelos cortos horizontales de medio a un metro. Descascarilla sus primeros granos de mijo blanco de forma autónoma.",
    milestones: [
      "Descascarillado exitoso de granos de mijo en el comedero",
      "Planeos controlados de mano a mano",
      "Bebe pequeñas gotas de agua por curiosidad en un plato plano"
    ],
    careTips: "Poner un recipiente muy plano y poco profundo (como la tapa de un frasco de vidrio) con agua limpia fresca para que aprenda a beber sin riesgo.",
    warning: "No utilizar bebederos hondos donde el pichón pueda sumergirse y correr peligro de ahogamiento."
  },
  {
    day: 27,
    title: "Plumaje Completo y Elegante",
    stage: "Semana 4: Empapillado a Mano (Días 21 - 27)",
    rearingType: "hand_feeding",
    rearingLabel: "🥣 Alimentación a Mano (Semana 4)",
    svgPhase: "stage_5_fledgling",
    weightMin: 80.0,
    weightMax: 95.0,
    weightAvg: 86.5,
    cropCapacity: "8.0 - 10.0 ml",
    temperature: "22.0°C - 24.0°C (Ambiente normal)",
    feedingType: "Papilla a mano (2 tomas al día) + pienso mini y mixtura",
    feedingFrequency: "2 tomas al día (mañana ~8:30 y noche ~21:30 de 8 a 10 ml).",
    summary: "Prácticamente no quedan cañones cerrados. Su aspecto es el de una ninfa adulta en miniatura con expresión dulce y juvenil.",
    milestones: [
      "Cuerpo cubierto de plumas sedosas al 95%",
      "Cresta larga, móvil y muy expresiva",
      "Afinamiento fisiológico del peso típico antes de perfeccionar el vuelo"
    ],
    careTips: "Es completamente normal que baje 2 a 4 gramos en estos días: su organismo pierde exceso de grasa para afinarse y volar con ligereza.",
    warning: "Si la pérdida de peso supera el 10% del peso corporal máximo registrado, aumentar la toma nocturna de papilla a mano."
  },
  {
    day: 28,
    title: "Independencia Motora y Vuelo Guiado",
    stage: "Semana 5: Destete y 1er Mes (Días 28 - 30)",
    rearingType: "hand_feeding",
    rearingLabel: "🥣 Alimentación a Mano / Destete (Semana 5)",
    svgPhase: "stage_5_fledgling",
    weightMin: 80.0,
    weightMax: 95.0,
    weightAvg: 86.0,
    cropCapacity: "7.0 - 10.0 ml",
    temperature: "21.0°C - 23.5°C (Ambiente normal)",
    feedingType: "Papilla de apoyo (1 o 2 tomas) + dieta sólida principal",
    feedingFrequency: "1 a 2 tomas al día (toma nocturna imprescindible, mañana opcional según apetito).",
    summary: "Vuelos de varios metros aterrizando sobre perchas y sobre el hombro de su cuidador con gran precisión y confianza.",
    milestones: [
      "Vuelo libre con aterrizaje preciso en el hombro del dueño",
      "Alimentación autónoma con panizo, alpiste y pienso blando",
      "Acicalamiento minucioso de alas, cola y dedos"
    ],
    careTips: "Felicitar al pollo con caricias suaves en la nuca cuando vuele hacia tu mano; afianza una relación de compañerismo para toda la vida.",
    warning: "Cuidado con cables eléctricos descubiertos y plantas tóxicas del hogar durante sus ratos de vuelo en la habitación."
  },
  {
    day: 29,
    title: "Víspera del Primer Mes de Vida",
    stage: "Semana 5: Destete y 1er Mes (Días 28 - 30)",
    rearingType: "hand_feeding",
    rearingLabel: "🥣 Alimentación a Mano / Destete (Semana 5)",
    svgPhase: "stage_5_fledgling",
    weightMin: 81.0,
    weightMax: 96.0,
    weightAvg: 87.0,
    cropCapacity: "7.0 - 9.0 ml",
    temperature: "20.0°C - 23.0°C (Temperatura ambiente)",
    feedingType: "Papilla de refuerzo nocturna + sólidos autónomos",
    feedingFrequency: "1 toma nocturna de 7 - 9 ml antes de dormir.",
    summary: "El pichón ya es un volantón ágil, cariñoso y totalmente domesticado. Su buche almacena semillas descascarilladas por sí mismo.",
    milestones: [
      "Autonomía alimentaria alcanzando el 75% - 85%",
      "Respuesta vocal inmediata a silbidos y llamadas",
      "Excelente fuerza de agarre en dedos y tarsos"
    ],
    careTips: "Pesar tanto por la mañana como por la noche para confirmar que está comiendo suficiente semilla por sí solo.",
    warning: "No retirar la toma nocturna de apoyo hasta comprobar que el buche no se queda vacío antes de apagar las luces."
  },
  {
    day: 30,
    title: "¡PRIMER MES DE VIDA CUMPLIDO! (30 Días)",
    stage: "Semana 5: Destete y 1er Mes (Días 28 - 30)",
    rearingType: "hand_feeding",
    rearingLabel: "🥣 Alimentación a Mano / Destete (Semana 5)",
    svgPhase: "stage_5_fledgling",
    weightMin: 82.0,
    weightMax: 98.0,
    weightAvg: 88.5,
    cropCapacity: "6.0 - 8.0 ml (toma de consuelo)",
    temperature: "Ambiente normal (20°C - 24°C)",
    feedingType: "Destete culminando: toma nocturna de consuelo si la pide",
    feedingFrequency: "1 toma nocturna de apoyo o destete completo completado.",
    summary: "¡OBJETIVO CUMPLIDO! El pollo de Impa ha superado con éxito su primer mes crítico gracias a las 3 semanas con sus padres y el empapillado a mano en la 4ª semana. Es un ejemplar juvenil sano, dócil y hermoso.",
    milestones: [
      "¡1er Mes de vida cumplido con éxito total!",
      "Plumaje juvenil completo, brillante y lustroso",
      "Vuelo pleno y dominio total del espacio aéreo",
      "Come mixtura variada, pienso extrusionado, panizo y verduras frescas",
      "Vínculo afectivo inquebrantable con su familia humana"
    ],
    careTips: "¡Felicidades por completar el primer mes! Tu ninfa ya es un juvenil fuerte. Puedes continuar el registro de peso semanal durante los próximos meses hasta su primera muda a los 6-8 meses.",
    warning: "La primera muda ocurrirá entre los 6 y 9 meses, donde los machos perderán las perlas en el dorso y las hembras mantendrán el patrón nacarado característico de Impa."
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

// Guías de cuidados críticos del pollo adaptadas al protocolo de crianza mixta
const CHICK_CARE_GUIDES = [
  {
    id: "parents_rearing",
    title: "Crianza Natural con Padres (Semanas 1 a 3 / Días 0 al 20)",
    badge: "SEMANAS 1 A 3 (D0 - D20)",
    color: "emerald",
    icon: "favorite",
    desc: "Durante los primeros 21 días, Impa y su pareja crían directamente a los pichones en el nido de madera. Esta fase es vital para transferir flora bacteriana beneficiosa, enzimas digestivas e inmunidad natural materna.",
    steps: [
      "No intervenir en el embuche: Los padres producen 'leche de buche' los primeros días y luego predigieren mixtura y pasta de cría.",
      "Nutrición de los padres: Ofrecer a Impa y su pareja pasta de cría húmeda fresca al huevo a diario, brócoli, semillas germinadas, mixtura variada y bloque de calcio/jibia para evitar descalcificación.",
      "Supervisión del nido: Abrir la tapa con delicadeza 1 o 2 veces al día cuando los padres salgan a comer para verificar que los pichones tienen el buche lleno y heces hidratadas.",
      "Calor natural: Los padres se turnan para incubar y dar calor corporal (36.5°C - 37°C). No se requiere criadora externa si el ambiente de la habitación está entre 21°C y 24°C sin corrientes.",
      "Control de peso diario: Pesar al pichón por la mañana durante 1 minuto sobre una báscula con servilleta tibia para confirmar la curva de ganancia de gramos."
    ]
  },
  {
    id: "hand_feeding_transition",
    title: "Alimentación a Mano / Empapillado (Semana 4 / Día 21 en adelante)",
    badge: "SEMANA 4 EN ADELANTE (D21+)",
    color: "amber",
    icon: "restaurant",
    desc: "Al cumplir los 21 días (inicio de la 4ª semana), se retira al pichón a una fauna box limpia para alimentarlo con papilla comercial con jeringa. Es la edad dorada: pichón fuerte, con plumas y defensas maduras, logrando un ave 100% mansa y confiada.",
    steps: [
      "Temperatura estricta de la papilla: Entre 38.5°C y 39.5°C medida con termómetro digital. Papilla a menos de 37°C causa estasis de buche; a más de 41°C quema el buche de forma irreversible.",
      "Preparación y textura: Mezclar papilla comercial de alta calidad para psitácidos con agua hervida tibia hasta lograr consistencia de yogur suave sin grumos.",
      "Técnica de jeringa: Introducir la punta de la jeringa por la comisura izquierda del pico orientándola suavemente hacia el lado derecho de la garganta (respetando la tráquea central).",
      "Pauta de tomas: Día 21-24 (3 tomas/día de 8-10 ml); Día 25-27 (2 a 3 tomas/día de 9-11 ml + panizo); Día 28-30 (1-2 tomas/día de apoyo nocturno y semillas).",
      "Alojamiento en fauna box: Instalar al pichón en una caja ventilada o fauna box con papel de cocina absorbente cambiado a diario, a temperatura templada (24°C - 26°C).",
      "Higiene post-toma: Limpiar los restos de papilla del pico y del plumaje con una gasa humedecida en agua tibia para evitar endurecimiento y hongos."
    ]
  },
  {
    id: "banding_guide",
    title: "Protocolo de Anillado Oficial (4.5 mm)",
    badge: "DÍAS 6 A 8 (EN EL NIDO)",
    color: "sky",
    icon: "ring_volume",
    desc: "El diámetro reglamentario para Ninfas / Carolinas (Nymphicus hollandicus) es de 4.5 mm (anilla cerrada federada de aluminio o policarbonato). Se realiza mientras los pichones están con sus padres.",
    steps: [
      "Momento óptimo: Entre el Día 6 y Día 8. Antes se saldrá del pie; después de los 9 días la articulación no pasará sin riesgo de fractura.",
      "Desinfección y lubricante: Aplicar una gota de vaselina neutra o aceite de oliva templado en el tarso del pichón.",
      "Posición de los dedos: Juntar los 3 dedos delanteros (hacia el frente) y deslizar la anilla sobre ellos hasta superar la articulación.",
      "Extracción del dedo trasero: El dedo posterior quedará atrapado hacia atrás; tirar con extrema delicadeza usando un palillo romo lubricado hasta que quede libre.",
      "Inspección: Revisar a las 2 horas que los padres no intenten quitar la anilla ni se acumule edema."
    ]
  },
  {
    id: "splayed_legs",
    title: "Prevención de Patas de Rana (Splayed Legs)",
    badge: "PREVENCIÓN EN NIDO",
    color: "emerald",
    icon: "healing",
    desc: "Deformidad articular donde las patas se abren lateralmente por falta de agarre en el fondo del nido o peso excesivo de los padres.",
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
      "Causa #1: Temperatura baja: Si el nido o la fauna box baja de temperatura, el sistema digestivo del pichón se paraliza.",
      "Causa #2: Papilla fría o demasiado espesa: La papilla debe suministrarse siempre entre 38.5°C y 39.5°C medidos con termómetro.",
      "Protocolo de auxilio: Administrar 0.5 a 1 ml de infusión tibia de manzanilla o agua tibia con electrolitos y masajear con extrema suavidad el buche en sentido ascendente.",
      "Nunca dar más alimento sobre un buche lleno con papilla o comida fermentada previa."
    ]
  },
  {
    id: "weaning_guide",
    title: "Proceso de Destete Natural e Independencia",
    badge: "DÍAS 25 A 35 (SEMANAS 4 Y 5)",
    color: "purple",
    icon: "restaurant",
    desc: "Transición guiada y respetuosa desde el empapillado a mano hacia semillas sólidas, panizo en rama y vegetales frescos.",
    steps: [
      "Día 23-25: Introducir ramas de panizo (mijo blanco en espiga) en el fondo de la fauna box. Su textura suave estimula el picoteo instintivo.",
      "Día 26: Poner un comedero bajo con mixtura limpia de alpiste y mijo, pienso extrusionado mini y trocitos de brócoli o zanahoria.",
      "Reducción paulatina de papilla: Disminuir primero la toma del mediodía; mantener siempre la toma de la mañana y de la noche.",
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
