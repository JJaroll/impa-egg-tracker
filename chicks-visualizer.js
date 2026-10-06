/**
 * Visualizador y Esquema Interactivo de Crecimiento para Pichones de Ninfa (Nymphicus hollandicus)
 * Día 0 a Día 30 (Primer mes de vida)
 * Renderizado vectorial SVG de alta fidelidad para cada una de las fases morfológicas y curva de peso interactiva.
 */

class ChickVisualizer {
  constructor(containerId) {
    this.container = typeof document !== 'undefined' && containerId ? document.getElementById(containerId) : null;
    this.currentDay = 0;
    this.activeTab = 'morphology'; // 'morphology' | 'growth_chart'
    this.recordedWeights = []; // Puntos de peso reales de pollos registrados
  }

  setDay(day) {
    this.currentDay = Math.max(0, Math.min(30, Math.round(day)));
    this.render();
  }

  setTab(tab) {
    this.activeTab = tab;
    this.render();
  }

  setRecordedWeights(weights) {
    this.recordedWeights = weights || [];
    if (this.activeTab === 'growth_chart') {
      this.render();
    }
  }

  render() {
    if (!this.container) return;
    const day = this.currentDay;
    const stage = (typeof CHICK_STAGES !== 'undefined' && CHICK_STAGES[day]) ? CHICK_STAGES[day] : {
      title: `Día ${day} de vida`,
      stage: 'Crecimiento',
      weightAvg: 50,
      temperature: '28°C',
      feedingFrequency: '3 tomas/día',
      summary: 'Desarrollo progresivo del pollo.',
      milestones: ['Crecimiento activo']
    };

    const isMorphology = this.activeTab === 'morphology';

    this.container.innerHTML = `
      <div class="glass-card p-3 sm:p-5 flex flex-col gap-4 border-theme shadow-xl">
        
        <!-- Barra de Controles Superiores: Selector de Modo & Salto a Hitos -->
        <div class="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-theme">
          <div class="flex items-center gap-1.5 sm:gap-2 bg-input/50 p-1 rounded-xl border border-theme">
            <button type="button" 
                    class="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-label-caps font-bold transition-all ${isMorphology ? 'bg-accent text-white shadow-sm' : 'text-muted hover:text-main'}"
                    onclick="if(window.chickVis) window.chickVis.setTab('morphology')">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[15px]">biotech</span>
                <span>MORFOLOGÍA Y PLUMA</span>
              </span>
            </button>
            <button type="button" 
                    class="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-label-caps font-bold transition-all ${!isMorphology ? 'bg-accent text-white shadow-sm' : 'text-muted hover:text-main'}"
                    onclick="if(window.chickVis) window.chickVis.setTab('growth_chart')">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[15px]">monitoring</span>
                <span>CURVA DE PESO (0-30D)</span>
              </span>
            </button>
          </div>

          <!-- Indicador de Día Actual -->
          <div class="flex items-center gap-2">
            <button type="button" 
                    class="w-8 h-8 rounded-lg bg-input border border-theme flex items-center justify-center text-muted hover:text-main hover:border-accent disabled:opacity-30 disabled:pointer-events-none transition-all"
                    onclick="if(window.chickVis) window.chickVis.setDay(${day - 1})"
                    ${day <= 0 ? 'disabled' : ''}>
              <span class="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <div class="px-3 py-1 rounded-xl bg-accent/15 border border-accent/30 font-data font-bold text-accent text-xs sm:text-sm">
              DÍA ${day} DE 30
            </div>
            <button type="button" 
                    class="w-8 h-8 rounded-lg bg-input border border-theme flex items-center justify-center text-muted hover:text-main hover:border-accent disabled:opacity-30 disabled:pointer-events-none transition-all"
                    onclick="if(window.chickVis) window.chickVis.setDay(${day + 1})"
                    ${day >= 30 ? 'disabled' : ''}>
              <span class="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        <!-- Slider de Día y Botones Rápidos a Hitos Clave -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between text-xs font-label-caps">
            <span class="text-muted font-bold">${stage.stage}</span>
            <span class="text-accent font-data">${((day / 30) * 100).toFixed(0)}% del primer mes</span>
          </div>
          
          <input type="range" min="0" max="30" value="${day}" step="1" 
                 class="w-full accent-accent cursor-pointer h-2 bg-input rounded-lg border border-theme" 
                 oninput="if(window.chickVis) window.chickVis.setDay(this.value)">

          <!-- Píldoras de Acceso Rápido a Hitos -->
          <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1 text-[10px] sm:text-[11px] font-label-caps font-bold">
            <button type="button" onclick="if(window.chickVis) window.chickVis.setDay(0)" class="px-2 py-1 rounded-lg border shrink-0 transition-all ${day === 0 ? 'bg-accent/20 border-accent text-accent' : 'bg-input/40 border-theme text-muted hover:text-main'}">
              🐣 D0: Eclosión
            </button>
            <button type="button" onclick="if(window.chickVis) window.chickVis.setDay(6)" class="px-2 py-1 rounded-lg border shrink-0 transition-all ${day === 6 ? 'bg-accent/20 border-accent text-accent' : 'bg-input/40 border-theme text-muted hover:text-main'}">
              💍 D6: Anillado 4.5mm
            </button>
            <button type="button" onclick="if(window.chickVis) window.chickVis.setDay(8)" class="px-2 py-1 rounded-lg border shrink-0 transition-all ${day === 8 ? 'bg-accent/20 border-accent text-accent' : 'bg-input/40 border-theme text-muted hover:text-main'}">
              👀 D8: Ojos Abiertos
            </button>
            <button type="button" onclick="if(window.chickVis) window.chickVis.setDay(15)" class="px-2 py-1 rounded-lg border shrink-0 transition-all ${day === 15 ? 'bg-accent/20 border-accent text-accent' : 'bg-input/40 border-theme text-muted hover:text-main'}">
              🦔 D15: Fase Erizo
            </button>
            <button type="button" onclick="if(window.chickVis) window.chickVis.setDay(21)" class="px-2 py-1 rounded-lg border shrink-0 transition-all ${day === 21 ? 'bg-accent/20 border-accent text-accent' : 'bg-input/40 border-theme text-muted hover:text-main'}">
              🪶 D21: 3 Semanas
            </button>
            <button type="button" onclick="if(window.chickVis) window.chickVis.setDay(25)" class="px-2 py-1 rounded-lg border shrink-0 transition-all ${day === 25 ? 'bg-accent/20 border-accent text-accent' : 'bg-input/40 border-theme text-muted hover:text-main'}">
              🌿 D25: Fuera del Nido
            </button>
            <button type="button" onclick="if(window.chickVis) window.chickVis.setDay(30)" class="px-2 py-1 rounded-lg border shrink-0 transition-all ${day === 30 ? 'bg-accent/20 border-accent text-accent' : 'bg-input/40 border-theme text-muted hover:text-main'}">
              ⭐ D30: 1er Mes de Vida
            </button>
          </div>
        </div>

        <!-- Cuerpo Principal: Renderizador SVG (Morfología o Curva) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          <!-- Lienzo Gráfico SVG (7 columnas en desktop) -->
          <div class="lg:col-span-7 flex flex-col gap-2">
            <div class="w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl bg-gradient-to-b from-black/40 to-black/60 border border-theme relative overflow-hidden flex items-center justify-center p-3 shadow-inner">
              ${isMorphology ? this.renderMorphologySvg(day) : this.renderGrowthChartSvg(day)}
            </div>
            
            <div class="flex items-center justify-between text-[11px] text-muted font-label-caps px-1">
              <span>Etapa: <strong class="text-main">${stage.stage.split(':')[0]}</strong></span>
              <span>Esquema biológico de referencia: <em>Nymphicus hollandicus</em></span>
            </div>
          </div>

          <!-- Ficha de Parámetros y Cuidados del Día (5 columnas en desktop) -->
          <div class="lg:col-span-5 flex flex-col gap-3">
            
            <!-- Título y Resumen -->
            <div class="p-3.5 rounded-2xl bg-input/40 border border-theme flex flex-col gap-1.5">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></span>
                <h3 class="font-display font-bold text-base sm:text-lg text-main">${stage.title}</h3>
              </div>
              <p class="text-xs text-muted leading-relaxed font-body">${stage.summary}</p>
            </div>

            <!-- Métricas Clave del Día -->
            <div class="grid grid-cols-2 gap-2 text-xs font-label-caps">
              <div class="p-2.5 rounded-xl bg-input/30 border border-theme flex flex-col gap-0.5">
                <span class="text-muted text-[10px] flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px] text-amber-400">scale</span>
                  PESO ESPERADO
                </span>
                <span class="font-data font-bold text-sm text-main">~${stage.weightAvg}g <span class="text-[10px] text-muted">(${stage.weightMin}-${stage.weightMax}g)</span></span>
              </div>

              <div class="p-2.5 rounded-xl bg-input/30 border border-theme flex flex-col gap-0.5">
                <span class="text-muted text-[10px] flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px] text-red-400">thermostat</span>
                  TEMPERATURA NIDO
                </span>
                <span class="font-data font-bold text-sm text-main">${stage.temperature}</span>
              </div>

              <div class="p-2.5 rounded-xl bg-input/30 border border-theme flex flex-col gap-0.5">
                <span class="text-muted text-[10px] flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px] text-blue-400">hourglass_top</span>
                  CAPACIDAD BUCHE
                </span>
                <span class="font-data font-bold text-xs text-main truncate">${stage.cropCapacity}</span>
              </div>

              <div class="p-2.5 rounded-xl bg-input/30 border border-theme flex flex-col gap-0.5">
                <span class="text-muted text-[10px] flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px] text-emerald-400">schedule</span>
                  TOMAS RECOMENDADAS
                </span>
                <span class="font-data font-bold text-xs text-main truncate">${stage.feedingFrequency.split('(')[0]}</span>
              </div>
            </div>

            <!-- Hitos y Cuidados -->
            <div class="p-3.5 rounded-2xl bg-input/30 border border-theme flex flex-col gap-2">
              <span class="font-label-caps text-[10px] tracking-wider text-accent font-bold uppercase">Hitos Biológicos Clave:</span>
              <ul class="flex flex-col gap-1 text-xs text-muted">
                ${stage.milestones.map(m => `
                  <li class="flex items-start gap-1.5">
                    <span class="text-emerald-400 shrink-0 font-bold">✓</span>
                    <span class="font-body text-xs text-main/90 leading-tight">${m}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Consejos y Advertencias -->
            <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
              <span class="material-symbols-outlined text-amber-400 text-[20px] shrink-0 mt-0.5">tips_and_updates</span>
              <div class="flex flex-col gap-0.5 text-xs font-body">
                <span class="font-bold text-amber-300 font-label-caps text-[10px] tracking-wider">CONSEJO DE CRIANZA</span>
                <p class="text-main/90 text-xs leading-relaxed">${stage.careTips}</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    `;
  }

  /**
   * Renderiza la ilustración anatómica y morfológica SVG del pollo de ninfa para el día indicado.
   */
  renderMorphologySvg(day) {
    // Clasificar en una de las 6 etapas morfológicas
    if (day <= 3) {
      return this.svgStageNeonate(day);
    } else if (day <= 7) {
      return this.svgStageEarly(day);
    } else if (day <= 14) {
      return this.svgStageQuills(day);
    } else if (day <= 21) {
      return this.svgStagePorcupine(day);
    } else if (day <= 26) {
      return this.svgStageFeathered(day);
    } else {
      return this.svgStageFledgling(day);
    }
  }

  // Etapa 1: Neonato frágil (Día 0 - 3)
  svgStageNeonate(day) {
    return `
      <svg viewBox="0 0 400 300" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="nestWood" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#3d2817" />
            <stop offset="100%" stop-color="#1f140a" />
          </radialGradient>
          <radialGradient id="skinNeonate" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#ffb3ba" />
            <stop offset="70%" stop-color="#ff8fa3" />
            <stop offset="100%" stop-color="#e0657b" />
          </radialGradient>
          <radialGradient id="cropYolk" cx="35%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#fff275" stop-opacity="0.9" />
            <stop offset="80%" stop-color="#ffd166" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#f4a261" stop-opacity="0.7" />
          </radialGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Fondo del Nido con Virutas de Pino -->
        <ellipse cx="200" cy="220" rx="170" ry="60" fill="url(#nestWood)" opacity="0.8" />
        <path d="M70 210 Q120 190 170 215 T270 205 T330 220" stroke="#b08968" stroke-width="4" fill="none" opacity="0.6" stroke-linecap="round"/>
        <path d="M90 225 Q160 210 210 230 T310 215" stroke="#ddb892" stroke-width="3" fill="none" opacity="0.7" stroke-linecap="round"/>
        <path d="M120 235 Q190 220 260 235" stroke="#e6ccb2" stroke-width="2.5" fill="none" opacity="0.8" stroke-linecap="round"/>

        <!-- Cuerpo del Neonato (encogido, posición fetal) -->
        <g transform="translate(130, 90)">
          <!-- Abdomen y Saco Vitelino / Grasa -->
          <ellipse cx="80" cy="90" rx="48" ry="38" fill="url(#skinNeonate)" opacity="0.95" />
          <ellipse cx="70" cy="95" rx="25" ry="20" fill="url(#cropYolk)" opacity="0.85" filter="url(#softGlow)" />
          
          <!-- Cuello delgado arqueado -->
          <path d="M45 75 Q30 50 48 30" stroke="url(#skinNeonate)" stroke-width="22" stroke-linecap="round" fill="none" />

          <!-- Cabeza grande desproporcionada -->
          <circle cx="55" cy="30" r="26" fill="url(#skinNeonate)" />

          <!-- Ojo cerrado (abultamiento orbital oscuro con hendidura) -->
          <circle cx="58" cy="28" r="11" fill="#4a1525" opacity="0.4" />
          <path d="M50 28 Q58 32 66 28" stroke="#380e1a" stroke-width="2" fill="none" stroke-linecap="round" />

          <!-- Pico carnoso rosado con Diente de Huevo (egg tooth) -->
          <path d="M74 24 L96 32 L74 40 Z" fill="#ffe3e0" stroke="#f4a5ae" stroke-width="1.5" />
          <path d="M74 32 L94 32" stroke="#e0657b" stroke-width="1.2" />
          <!-- Diente de huevo blanco en la punta -->
          <circle cx="92" cy="29" r="2.2" fill="#ffffff" filter="url(#softGlow)" />

          <!-- Buche transparente (llenándose) -->
          <ellipse cx="62" cy="62" rx="16" ry="14" fill="url(#cropYolk)" opacity="0.7" />

          <!-- Alita diminuta sin plumas -->
          <path d="M60 78 Q75 68 85 82" stroke="#ffa6b4" stroke-width="9" stroke-linecap="round" fill="none" />
          <circle cx="85" cy="82" r="3" fill="#ffe3e0" />

          <!-- Patita rosada recogida con 4 dedos -->
          <path d="M95 105 L115 120" stroke="#ff8fa3" stroke-width="6" stroke-linecap="round" />
          <path d="M115 120 L130 128" stroke="#ff8fa3" stroke-width="3" stroke-linecap="round" />
          <path d="M115 120 L132 122" stroke="#ff8fa3" stroke-width="3" stroke-linecap="round" />
          <path d="M115 120 L126 134" stroke="#ff8fa3" stroke-width="3" stroke-linecap="round" />

          <!-- Plumón amarillo ralo y esponjoso (vellos finos) -->
          <g stroke="#ffea79" stroke-width="1.2" stroke-linecap="round" opacity="0.8">
            <line x1="40" y1="12" x2="35" y2="4" />
            <line x1="48" y1="10" x2="48" y2="1" />
            <line x1="56" y1="9" x2="60" y2="2" />
            <line x1="65" y1="12" x2="72" y2="6" />
            <line x1="90" y1="75" x2="102" y2="70" />
            <line x1="95" y1="85" x2="108" y2="82" />
            <line x1="85" y1="105" x2="98" y2="110" />
          </g>
        </g>

        <!-- Etiquetas explicativas integradas -->
        <g font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700">
          <text x="30" y="45" fill="#f43f5e">Diente de huevo córneo</text>
          <line x1="140" y1="42" x2="210" y2="118" stroke="#f43f5e" stroke-width="1.2" stroke-dasharray="3,3" />

          <text x="30" y="80" fill="#fbbf24">Buche translúcido</text>
          <line x1="120" y1="82" x2="190" y2="148" stroke="#fbbf24" stroke-width="1.2" stroke-dasharray="3,3" />

          <text x="270" y="55" fill="#34d399">Piel rosada y plumón</text>
          <line x1="265" y1="58" x2="225" y2="100" stroke="#34d399" stroke-width="1.2" stroke-dasharray="3,3" />
        </g>
      </svg>
    `;
  }

  // Etapa 2: Primera semana / Anillado (Días 4 - 7)
  svgStageEarly(day) {
    const isBandingDay = day >= 6 && day <= 8;
    return `
      <svg viewBox="0 0 400 300" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="skinEarly" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#ffccd2" />
            <stop offset="70%" stop-color="#fca5a5" />
            <stop offset="100%" stop-color="#e11d48" />
          </radialGradient>
        </defs>

        <!-- Fondo del Nido -->
        <ellipse cx="200" cy="225" rx="160" ry="55" fill="#2d1d11" opacity="0.9" />
        <path d="M80 220 Q140 200 200 225 T320 215" stroke="#d4a373" stroke-width="3" fill="none" opacity="0.7"/>

        <!-- Pichón Creciendo -->
        <g transform="translate(125, 75)">
          <!-- Abdomen redondeado y buche potente -->
          <ellipse cx="85" cy="100" rx="55" ry="42" fill="url(#skinEarly)" />
          
          <!-- Cuello más grueso -->
          <path d="M55 80 Q40 50 60 25" stroke="url(#skinEarly)" stroke-width="26" stroke-linecap="round" fill="none" />
          
          <!-- Cabeza -->
          <circle cx="70" cy="25" r="30" fill="url(#skinEarly)" />

          <!-- Ojo en apertura (hendidura o entreabierto) -->
          <circle cx="76" cy="23" r="12" fill="#262626" opacity="0.6" />
          ${day >= 7 
            ? `<ellipse cx="76" cy="23" rx="7" ry="5" fill="#111827" stroke="#fb7185" stroke-width="1.5" />
               <circle cx="78" cy="21" r="2" fill="#ffffff" />`
            : `<path d="M68 23 Q76 27 84 23" stroke="#111827" stroke-width="2.5" fill="none" stroke-linecap="round" />`
          }

          <!-- Pico engrosándose -->
          <path d="M92 18 L118 26 L92 36 Z" fill="#fed7aa" stroke="#fb923c" stroke-width="1.5" />
          <path d="M92 26 L116 26" stroke="#ea580c" stroke-width="1.5" />

          <!-- Ala con primeros puntitos de cañón alar -->
          <path d="M70 85 Q95 72 110 92" stroke="#fb7185" stroke-width="12" stroke-linecap="round" fill="none" />
          <!-- Puntos foliculares de cañones -->
          <g fill="#475569" opacity="0.7">
            <circle cx="95" cy="78" r="2" />
            <circle cx="101" cy="82" r="2" />
            <circle cx="107" cy="87" r="2" />
            <circle cx="112" cy="93" r="2" />
          </g>

          <!-- Patas firmes con ANILLA OFICIAL (4.5mm) -->
          <g>
            <path d="M100 120 L125 140" stroke="#fca5a5" stroke-width="8" stroke-linecap="round" />
            <!-- Anilla Reglamentaria 4.5 mm -->
            <rect x="110" y="126" width="10" height="12" rx="2" fill="${isBandingDay ? '#38bdf8' : '#cbd5e1'}" stroke="#0284c7" stroke-width="1.5" transform="rotate(25 115 132)" />
            <!-- Dedos abiertos agarrando el nido -->
            <path d="M125 140 L145 145" stroke="#fca5a5" stroke-width="4" stroke-linecap="round" />
            <path d="M125 140 L146 138" stroke="#fca5a5" stroke-width="4" stroke-linecap="round" />
            <path d="M125 140 L138 152" stroke="#fca5a5" stroke-width="4" stroke-linecap="round" />
          </g>

          <!-- Plumón amarillo erguido -->
          <g stroke="#fde047" stroke-width="1.5" stroke-linecap="round" opacity="0.85">
            <line x1="55" y1="3" x2="50" y2="-8" />
            <line x1="65" y1="0" x2="65" y2="-12" />
            <line x1="75" y1="0" x2="78" y2="-10" />
            <line x1="85" y1="4" x2="92" y2="-4" />
          </g>
        </g>

        <!-- Indicador de Anillado en foco -->
        <g font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700">
          <text x="250" y="195" fill="#38bdf8">Anilla Oficial 4.5mm</text>
          <text x="250" y="210" fill="#94a3b8" font-size="9">Ventana óptima Días 6-8</text>
          <line x1="245" y1="200" x2="238" y2="204" stroke="#38bdf8" stroke-width="1.5" />

          <text x="40" y="55" fill="#38bdf8">${day >= 7 ? 'Ojos abiertos con iris negro' : 'Apertura ocular en hendidura'}</text>
          <line x1="160" y1="58" x2="195" y2="95" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="3,3" />
        </g>
      </svg>
    `;
  }

  // Etapa 3: Cañones y Ojos (Días 8 - 14)
  svgStageQuills(day) {
    return `
      <svg viewBox="0 0 400 300" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <!-- Nido -->
        <ellipse cx="200" cy="235" rx="160" ry="50" fill="#25160d" />

        <!-- Pichón con Cañones en Formación -->
        <g transform="translate(110, 60)">
          <!-- Cuerpo -->
          <ellipse cx="95" cy="115" rx="65" ry="50" fill="#e2b4bd" />

          <!-- Cuello -->
          <path d="M65 95 Q55 60 75 35" stroke="#e2b4bd" stroke-width="32" stroke-linecap="round" fill="none" />

          <!-- Cabeza -->
          <circle cx="85" cy="35" r="32" fill="#e2b4bd" />

          <!-- Ojo completamente abierto, grande y negro con brillo -->
          <circle cx="92" cy="30" r="11" fill="#0f172a" stroke="#475569" stroke-width="2" />
          <circle cx="95" cy="27" r="3" fill="#ffffff" />
          <circle cx="90" cy="33" r="1.2" fill="#ffffff" opacity="0.8" />

          <!-- Pico fuerte de ninfa -->
          <path d="M108" y="24" d="M108 26 L138 36 L108 46 Z" fill="#ffedd5" stroke="#f97316" stroke-width="2" />
          <path d="M108 36 L134 36" stroke="#c2410c" stroke-width="1.8" />

          <!-- Cresta en Cañones de Púas (Mohawk) -->
          <g stroke="#334155" stroke-width="3.5" stroke-linecap="round">
            <line x1="75" y1="12" x2="62" y2="-12" />
            <line x1="82" y1="10" x2="75" y2="-18" />
            <line x1="89" y1="10" x2="88" y2="-22" />
            <line x1="96" y1="12" x2="102" y2="-15" />
            <line x1="103" y1="16" x2="114" y2="-8" />
          </g>
          <!-- Puntas queratinosas amarillas de la cresta -->
          <g stroke="#facc15" stroke-width="2.5" stroke-linecap="round">
            <line x1="64" y1="-8" x2="62" y2="-12" />
            <line x1="77" y1="-14" x2="75" y2="-18" />
            <line x1="89" y1="-17" x2="88" y2="-22" />
            <line x1="100" y1="-11" x2="102" y2="-15" />
          </g>

          <!-- Ala repleta de Cañones de Remeras Primarias y Secundarias -->
          <g stroke="#1e293b" stroke-width="4.5" stroke-linecap="round">
            <line x1="90" y1="95" x2="135" y2="105" />
            <line x1="92" y1="105" x2="145" y2="115" />
            <line x1="94" y1="115" x2="152" y2="125" />
            <line x1="95" y1="125" x2="155" y2="135" />
            <line x1="93" y1="135" x2="148" y2="145" />
          </g>
          <!-- Cañones de Cola (timoneras) -->
          <g stroke="#1e293b" stroke-width="4" stroke-linecap="round">
            <line x1="140" y1="135" x2="185" y2="145" />
            <line x1="140" y1="142" x2="188" y2="155" />
          </g>

          <!-- Patas con Anilla y Garras Fuertes -->
          <path d="M105" y="140" d="M105 140 L125 168" stroke="#fca5a5" stroke-width="10" stroke-linecap="round" />
          <rect x="110" y="148" width="11" height="13" rx="2" fill="#38bdf8" stroke="#0284c7" stroke-width="1.8" transform="rotate(20 115 154)" />
          <path d="M125 168 L150 174" stroke="#fca5a5" stroke-width="5" stroke-linecap="round" />
          <path d="M125 168 L152 165" stroke="#fca5a5" stroke-width="5" stroke-linecap="round" />
          <path d="M125 168 L142 180" stroke="#fca5a5" stroke-width="5" stroke-linecap="round" />
        </g>

        <!-- Anotaciones -->
        <g font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700">
          <text x="35" y="35" fill="#facc15">Cresta en cañones erectos</text>
          <line x1="170" y1="38" x2="195" y2="55" stroke="#facc15" stroke-width="1.2" stroke-dasharray="3,3" />

          <text x="250" y="165" fill="#38bdf8">Cañones alares oscuros</text>
          <text x="250" y="180" fill="#94a3b8" font-size="9">Plumas de sangre vascularizadas</text>
        </g>
      </svg>
    `;
  }

  // Etapa 4: Fase Erizo y Desvainado (Días 15 - 21)
  svgStagePorcupine(day) {
    return `
      <svg viewBox="0 0 400 300" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <!-- Nido -->
        <ellipse cx="200" cy="245" rx="165" ry="45" fill="#201209" />

        <!-- Pichón en Fase Erizo Desvainando Plumas -->
        <g transform="translate(100, 45)">
          <!-- Cuerpo grande y robusto -->
          <ellipse cx="105" cy="130" rx="72" ry="58" fill="#d1a3ab" />
          
          <!-- Cabeza con cresta desplegándose -->
          <circle cx="95" cy="45" r="36" fill="#d1a3ab" />

          <!-- Mejilla con tono naranja brotando -->
          <circle cx="108" cy="54" r="10" fill="#fb923c" opacity="0.6" filter="blur(2px)" />

          <!-- Ojo vivo y expresivo -->
          <circle cx="102" cy="38" r="11" fill="#0f172a" />
          <circle cx="105" cy="35" r="3.5" fill="#ffffff" />
          <circle cx="100" cy="41" r="1.5" fill="#ffffff" />

          <!-- Pico definido -->
          <path d="M120 34 L152 46 L120 58 Z" fill="#ffedd5" stroke="#f97316" stroke-width="2" />
          <path d="M120 46 L148 46" stroke="#c2410c" stroke-width="2" />

          <!-- CRESTA EN DESVAINADO (Puntas amarillas abriéndose como pincel) -->
          <g stroke="#475569" stroke-width="4" stroke-linecap="round">
            <line x1="85" y1="20" x2="68" y2="-15" />
            <line x1="93" y1="18" x2="82" y2="-26" />
            <line x1="102" y1="18" x2="100" y2="-32" />
            <line x1="110" y1="20" x2="118" y2="-24" />
            <line x1="118" y1="24" x2="132" y2="-12" />
          </g>
          <!-- Pinceles de pluma amarilla brillante brotando -->
          <g stroke="#facc15" stroke-width="3" stroke-linecap="round">
            <path d="M68 -15 Q64 -25 60 -30 M68 -15 Q72 -25 74 -28" fill="none" />
            <path d="M82 -26 Q78 -38 75 -42 M82 -26 Q86 -38 90 -40" fill="none" />
            <path d="M100 -32 Q97 -45 96 -50 M100 -32 Q105 -45 108 -48" fill="none" />
            <path d="M118 -24 Q122 -35 126 -40 M118 -24 Q114 -35 112 -38" fill="none" />
          </g>

          <!-- Alas en Fase Erizo Desvainando con Patrón Perlado -->
          <g stroke="#334155" stroke-width="5" stroke-linecap="round">
            <line x1="100" y1="100" x2="155" y2="112" />
            <line x1="103" y1="112" x2="168" y2="125" />
            <line x1="105" y1="125" x2="178" y2="140" />
            <line x1="105" y1="140" x2="175" y2="155" />
            <line x1="100" y1="152" x2="162" y2="168" />
          </g>
          <!-- Puntas de pluma perladas amarillas/blancas desvainadas -->
          <g fill="#fef08a" stroke="#eab308" stroke-width="1.5">
            <ellipse cx="160" cy="113" rx="10" ry="5" transform="rotate(15 160 113)" />
            <ellipse cx="174" cy="127" rx="12" ry="6" transform="rotate(15 174 127)" />
            <ellipse cx="185" cy="142" rx="14" ry="7" transform="rotate(15 185 142)" />
            <ellipse cx="182" cy="157" rx="13" ry="6" transform="rotate(15 182 157)" />
          </g>

          <!-- Cola desvainándose -->
          <g stroke="#334155" stroke-width="4.5" stroke-linecap="round">
            <line x1="165" y1="150" x2="220" y2="168" />
            <line x1="162" y1="160" x2="225" y2="180" />
          </g>
          <ellipse cx="228" cy="180" rx="14" ry="6" fill="#fef08a" stroke="#eab308" stroke-width="1.5" transform="rotate(18 228 180)" />

          <!-- Patas robustas -->
          <path d="M120 160 L140 192" stroke="#fda4af" stroke-width="11" stroke-linecap="round" />
          <rect x="125" y="168" width="12" height="15" rx="2" fill="#38bdf8" stroke="#0284c7" stroke-width="2" transform="rotate(22 131 175)" />
          <path d="M140 192 L170 198" stroke="#fda4af" stroke-width="6" stroke-linecap="round" />
          <path d="M140 192 L172 190" stroke="#fda4af" stroke-width="6" stroke-linecap="round" />
        </g>

        <!-- Anotaciones -->
        <g font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700">
          <text x="30" y="25" fill="#facc15">Desvainado de plumas</text>
          <text x="30" y="40" fill="#94a3b8" font-size="9">Apertura de la vaina de queratina</text>

          <text x="250" y="100" fill="#fb923c">Patrón perlado (Hijo de Impa)</text>
          <text x="250" y="115" fill="#94a3b8" font-size="9">Plumas amarillas con orla nacarada</text>
        </g>
      </svg>
    `;
  }

  // Etapa 5: Emplume avanzado (Días 22 - 26)
  svgStageFeathered(day) {
    return `
      <svg viewBox="0 0 400 300" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <!-- Nido y Percha -->
        <ellipse cx="200" cy="255" rx="160" ry="40" fill="#1c0f07" />
        <!-- Tronco / Percha de madera -->
        <path d="M60 250 L340 230" stroke="#78350f" stroke-width="16" stroke-linecap="round" />

        <!-- Ninfa Joven en Posición de Aleteo / Exploración -->
        <g transform="translate(100, 30)">
          <!-- Cola larga elegante -->
          <path d="M150 155 Q210 185 260 215" stroke="#475569" stroke-width="8" stroke-linecap="round" />
          <path d="M145 160 Q205 190 255 225" stroke="#fef08a" stroke-width="6" stroke-linecap="round" />

          <!-- Cuerpo emplumado gris/perla -->
          <ellipse cx="105" cy="130" rx="65" ry="52" fill="#64748b" />
          <!-- Pecho claro perlado -->
          <path d="M75 105 Q60 140 85 165 Q115 155 105 115 Z" fill="#cbd5e1" opacity="0.9" />

          <!-- Ala abierta mostrando el patrón perlado -->
          <path d="M95 105 Q145 80 190 115 Q170 160 115 155 Z" fill="#475569" stroke="#334155" stroke-width="2" />
          <!-- Motas perladas nacaradas (perlas amarillas de Impa) -->
          <g fill="#fef08a">
            <circle cx="125" cy="115" r="4.5" />
            <circle cx="140" cy="110" r="5" />
            <circle cx="155" cy="115" r="5.5" />
            <circle cx="170" cy="125" r="5" />
            <circle cx="135" cy="128" r="4.5" />
            <circle cx="150" cy="132" r="5" />
            <circle cx="165" cy="140" r="4" />
          </g>

          <!-- Cabeza -->
          <circle cx="85" cy="55" r="32" fill="#94a3b8" />
          <!-- Mejilla naranja redonda y brillante -->
          <circle cx="95" cy="62" r="11" fill="#ea580c" />

          <!-- Ojo despierto y curioso -->
          <circle cx="88" cy="48" r="9" fill="#0f172a" />
          <circle cx="90" cy="45" r="3" fill="#ffffff" />

          <!-- Pico córneo terminado -->
          <path d="M105 45 L132 55 L105 65 Z" fill="#ffedd5" stroke="#d97706" stroke-width="2" />
          <path d="M105 55 L128 55" stroke="#b45309" stroke-width="1.8" />

          <!-- CRESTA AMARILLA LARGA Y EXPRESIVA -->
          <g stroke="#facc15" stroke-width="4.5" stroke-linecap="round" fill="none">
            <path d="M75 30 Q60 5 50 -20 Q48 -25 45 -30" />
            <path d="M82 26 Q72 -5 65 -35 Q63 -40 60 -45" />
            <path d="M90 28 Q88 -5 85 -40 Q84 -48 82 -52" />
            <path d="M96 32 Q100 2 102 -30 Q103 -38 102 -42" />
          </g>

          <!-- Patas en la percha con anilla -->
          <path d="M110 165 L120 200" stroke="#fda4af" stroke-width="9" stroke-linecap="round" />
          <rect x="112" y="176" width="12" height="14" rx="2" fill="#38bdf8" stroke="#0284c7" stroke-width="2" transform="rotate(15 118 183)" />
          <path d="M120 200 L138 202 M120 200 L136 210 M120 200 L108 206" stroke="#fda4af" stroke-width="5" stroke-linecap="round" />
        </g>

        <!-- Anotaciones -->
        <g font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700">
          <text x="35" y="25" fill="#facc15">Cresta estilizada de ninfa</text>
          <text x="250" y="80" fill="#ea580c">Mejilla naranja brillante</text>
          <text x="250" y="145" fill="#fef08a">Patrón perlado (Laced Pearl)</text>
          <text x="250" y="160" fill="#94a3b8" font-size="9">Plumaje juvenil al 90%</text>
        </g>
      </svg>
    `;
  }

  // Etapa 6: Pichón de 1 Mes / Volantón (Días 27 - 30)
  svgStageFledgling(day) {
    return `
      <svg viewBox="0 0 400 300" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <!-- Rama de Árbol Natural -->
        <path d="M30 240 Q180 220 370 210" stroke="#5c2c16" stroke-width="20" stroke-linecap="round" />
        <path d="M160 225 Q210 240 250 255" stroke="#451e0d" stroke-width="10" stroke-linecap="round" />

        <!-- Espiga de Panizo en rama (estímulo de destete) -->
        <g stroke="#ca8a04" stroke-width="3" stroke-linecap="round" fill="#fef08a">
          <path d="M40 230 Q70 190 90 170" fill="none" stroke="#65a30d" stroke-width="2.5" />
          <circle cx="70" cy="200" r="4" />
          <circle cx="76" cy="195" r="4.5" />
          <circle cx="82" cy="188" r="4.5" />
          <circle cx="88" cy="180" r="4" />
          <circle cx="94" cy="172" r="3.5" />
        </g>

        <!-- Pichón de 1 Mes (Adulto en Miniatura de Ninfa Perlada) -->
        <g transform="translate(130, 25)">
          <!-- Cola Larga y Estilizada -->
          <path d="M110 155 Q160 210 210 260" stroke="#334155" stroke-width="12" stroke-linecap="round" />
          <path d="M105 160 Q155 215 200 265" stroke="#fef08a" stroke-width="7" stroke-linecap="round" />

          <!-- Cuerpo Elegante -->
          <ellipse cx="75" cy="125" rx="55" ry="48" fill="#475569" />
          <!-- Pecho sedoso crema/perla -->
          <path d="M48 100 Q35 135 55 160 Q85 155 75 110 Z" fill="#e2e8f0" />

          <!-- Ala Plegada con Patrón Perlado Perfecto -->
          <path d="M65 95 Q115 80 145 130 Q120 170 75 155 Z" fill="#334155" stroke="#1e293b" stroke-width="2" />
          <!-- Perlas de Impa en el ala -->
          <g fill="#fef08a" stroke="#ca8a04" stroke-width="1">
            <circle cx="95" cy="108" r="4.5" />
            <circle cx="108" cy="105" r="5" />
            <circle cx="122" cy="110" r="5.5" />
            <circle cx="132" cy="120" r="5" />
            <circle cx="102" cy="120" r="4.5" />
            <circle cx="116" cy="124" r="5" />
            <circle cx="128" cy="132" r="4" />
            <circle cx="110" cy="138" r="4" />
          </g>
          <!-- Franja blanca alar (típica de la ninfa) -->
          <path d="M68 105 Q90 102 110 115" stroke="#ffffff" stroke-width="4.5" fill="none" stroke-linecap="round" />

          <!-- Cabeza Expresiva Amarilla/Gris -->
          <circle cx="58" cy="50" r="28" fill="#cbd5e1" />
          <path d="M40 40 Q55 25 75 42 Q65 65 45 55 Z" fill="#fef08a" opacity="0.9" />

          <!-- Mejilla Naranja Redonda y Viva -->
          <circle cx="68" cy="58" r="10" fill="#f97316" />

          <!-- Ojo Inteligente y Cariñoso -->
          <circle cx="58" cy="45" r="8" fill="#0f172a" />
          <circle cx="60" cy="42" r="3" fill="#ffffff" />

          <!-- Pico Robusto y Limpio -->
          <path d="M76 42 L100 52 L76 60 Z" fill="#fed7aa" stroke="#d97706" stroke-width="1.8" />
          <path d="M76 52 L96 52" stroke="#b45309" stroke-width="1.5" />

          <!-- CRESTA ESPECTACULAR (Emblema de Ninfa) -->
          <g stroke="#facc15" stroke-width="4" stroke-linecap="round" fill="none">
            <path d="M48 26 Q35 0 25 -25 Q20 -30 15 -35" />
            <path d="M55 22 Q45 -5 38 -35 Q35 -42 30 -48" />
            <path d="M62 23 Q60 -5 55 -42 Q52 -50 48 -55" />
            <path d="M68 26 Q72 0 74 -30 Q75 -38 73 -44" />
          </g>

          <!-- Patitas en la percha con ANILLA cerrada -->
          <path d="M75 160 L85 195" stroke="#fda4af" stroke-width="8" stroke-linecap="round" />
          <rect x="76" y="172" width="11" height="13" rx="2" fill="#38bdf8" stroke="#0284c7" stroke-width="2" transform="rotate(18 81 178)" />
          <!-- Dedos zygodáctilos (2 hacia adelante, 2 hacia atrás) -->
          <path d="M85 195 L102 196 M85 195 L100 204 M85 195 L72 202 M85 195 L70 196" stroke="#fda4af" stroke-width="4.5" stroke-linecap="round" />
        </g>

        <!-- Anotaciones de 1 Mes Cumplido -->
        <g font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700">
          <text x="35" y="25" fill="#facc15">⭐ ¡1 Mes de Vida Cumplido!</text>
          <text x="35" y="40" fill="#34d399">Volantón sano y emplumado</text>

          <text x="250" y="80" fill="#fef08a">Destete con panizo</text>
          <text x="250" y="95" fill="#94a3b8" font-size="9">Peso adulto: ~88 - 95 g</text>
        </g>
      </svg>
    `;
  }

  /**
   * Renderiza el gráfico SVG interactivo de la Curva de Peso (Gramos vs Día 0 a 30).
   */
  renderGrowthChartSvg(activeDay) {
    const curve = typeof CHICK_GROWTH_CURVE !== 'undefined' ? CHICK_GROWTH_CURVE : [];
    
    // Dimensiones del gráfico dentro del viewBox 400x300
    const margin = { top: 30, right: 30, bottom: 40, left: 45 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const maxDay = 30;
    const maxWeight = 105;

    const scaleX = (d) => margin.left + (d / maxDay) * width;
    const scaleY = (w) => margin.top + height - (w / maxWeight) * height;

    // Generar línea de la curva esperada
    const pointsPath = curve.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(pt.day).toFixed(1)} ${scaleY(pt.weight).toFixed(1)}`).join(' ');
    // Área sombreada bajo la curva
    const areaPath = `${pointsPath} L ${scaleX(maxDay)} ${scaleY(0)} L ${scaleX(0)} ${scaleY(0)} Z`;

    // Posición del día activo en la curva
    const targetPt = (typeof CHICK_STAGES !== 'undefined' && CHICK_STAGES[activeDay]) ? CHICK_STAGES[activeDay] : { weightAvg: 50 };
    const activeX = scaleX(activeDay);
    const activeY = scaleY(targetPt.weightAvg);

    // Puntos reales registrados
    const realPointsSvg = (this.recordedWeights || []).map(r => {
      const rx = scaleX(Math.min(30, Math.max(0, r.day)));
      const ry = scaleY(Math.min(100, Math.max(0, r.weight)));
      return `
        <circle cx="${rx.toFixed(1)}" cy="${ry.toFixed(1)}" r="4" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5" />
      `;
    }).join('');

    return `
      <svg viewBox="0 0 400 300" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f97316" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#f97316" stop-opacity="0.0" />
          </linearGradient>
        </defs>

        <!-- Ejes y Líneas de Cuadrícula -->
        <g stroke="#ffffff" stroke-opacity="0.08" stroke-width="1">
          <!-- Líneas de Peso (0, 25, 50, 75, 100g) -->
          <line x1="${margin.left}" y1="${scaleY(0)}" x2="${margin.left + width}" y2="${scaleY(0)}" />
          <line x1="${margin.left}" y1="${scaleY(25)}" x2="${margin.left + width}" y2="${scaleY(25)}" stroke-dasharray="2,3" />
          <line x1="${margin.left}" y1="${scaleY(50)}" x2="${margin.left + width}" y2="${scaleY(50)}" stroke-dasharray="2,3" />
          <line x1="${margin.left}" y1="${scaleY(75)}" x2="${margin.left + width}" y2="${scaleY(75)}" stroke-dasharray="2,3" />
          <line x1="${margin.left}" y1="${scaleY(100)}" x2="${margin.left + width}" y2="${scaleY(100)}" stroke-dasharray="2,3" />

          <!-- Líneas de Día (0, 7, 14, 21, 30) -->
          <line x1="${scaleX(0)}" y1="${margin.top}" x2="${scaleX(0)}" y2="${margin.top + height}" />
          <line x1="${scaleX(7)}" y1="${margin.top}" x2="${scaleX(7)}" y2="${margin.top + height}" stroke-dasharray="2,3" />
          <line x1="${scaleX(14)}" y1="${margin.top}" x2="${scaleX(14)}" y2="${margin.top + height}" stroke-dasharray="2,3" />
          <line x1="${scaleX(21)}" y1="${margin.top}" x2="${scaleX(21)}" y2="${margin.top + height}" stroke-dasharray="2,3" />
          <line x1="${scaleX(30)}" y1="${margin.top}" x2="${scaleX(30)}" y2="${margin.top + height}" />
        </g>

        <!-- Etiquetas de Ejes -->
        <g font-family="'JetBrains Mono', monospace" font-size="9" fill="#94a3b8" text-anchor="end">
          <text x="${margin.left - 6}" y="${scaleY(0) + 3}">0g</text>
          <text x="${margin.left - 6}" y="${scaleY(25) + 3}">25g</text>
          <text x="${margin.left - 6}" y="${scaleY(50) + 3}">50g</text>
          <text x="${margin.left - 6}" y="${scaleY(75) + 3}">75g</text>
          <text x="${margin.left - 6}" y="${scaleY(100) + 3}">100g</text>
        </g>

        <g font-family="'JetBrains Mono', monospace" font-size="9" fill="#94a3b8" text-anchor="middle">
          <text x="${scaleX(0)}" y="${margin.top + height + 15}">D0</text>
          <text x="${scaleX(7)}" y="${margin.top + height + 15}">D7</text>
          <text x="${scaleX(14)}" y="${margin.top + height + 15}">D14</text>
          <text x="${scaleX(21)}" y="${margin.top + height + 15}">D21</text>
          <text x="${scaleX(30)}" y="${margin.top + height + 15}">D30</text>
        </g>

        <!-- Área y Trazo de la Curva Estándar -->
        <path d="${areaPath}" fill="url(#chartGrad)" />
        <path d="${pointsPath}" fill="none" stroke="#f97316" stroke-width="3" stroke-linecap="round" />

        <!-- Puntos Reales Registrados (si existen) -->
        ${realPointsSvg}

        <!-- Marcador del Día Activo Seleccionado -->
        <line x1="${activeX.toFixed(1)}" y1="${margin.top}" x2="${activeX.toFixed(1)}" y2="${margin.top + height}" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3,3" />
        <circle cx="${activeX.toFixed(1)}" cy="${activeY.toFixed(1)}" r="6" fill="#fbbf24" stroke="#ffffff" stroke-width="2" />

        <!-- Tooltip flotante en SVG sobre el punto del día -->
        <g transform="translate(${Math.min(270, Math.max(50, activeX - 45))}, ${Math.max(10, activeY - 30)})">
          <rect x="0" y="0" width="90" height="22" rx="6" fill="#1e293b" stroke="#f97316" stroke-width="1" />
          <text x="45" y="15" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="#fef08a" text-anchor="middle">
            D${activeDay}: ~${targetPt.weightAvg}g
          </text>
        </g>

        <!-- Leyenda -->
        <g transform="translate(${margin.left + 10}, 15)" font-family="'JetBrains Mono', monospace" font-size="9">
          <line x1="0" y1="0" x2="15" y2="0" stroke="#f97316" stroke-width="3" />
          <text x="20" y="3" fill="#cbd5e1">Curva saludable de ninfa</text>
          ${(this.recordedWeights && this.recordedWeights.length > 0) ? `
            <circle cx="170" cy="0" r="3.5" fill="#38bdf8" />
            <text x="180" y="3" fill="#38bdf8">Pesajes reales de tus pollos</text>
          ` : ''}
        </g>
      </svg>
    `;
  }
}

if (typeof window !== 'undefined') {
  window.ChickVisualizer = ChickVisualizer;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ChickVisualizer };
}
