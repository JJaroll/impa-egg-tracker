/**
 * Generador interactivo de gráficos SVG para visualizar el desarrollo embrionario
 * de Nymphicus hollandicus (Ninfa Carolina) en vista de ovoscopia (candling) y vista anatómica transversal.
 */

class EmbryoVisualizer {
  constructor(containerId) {
    this.container = typeof document !== 'undefined' && containerId ? document.getElementById(containerId) : null;
    this.currentDay = 5;
    this.mode = 'candling'; // 'candling' | 'anatomical'
  }

  setDay(day) {
    this.currentDay = Math.max(0, Math.min(21, Math.round(day)));
    this.render();
  }

  setMode(mode) {
    this.mode = mode;
    this.render();
  }

  render() {
    if (!this.container) return;
    const day = this.currentDay;
    const stage = (typeof EMBRYO_STAGES !== 'undefined' && EMBRYO_STAGES[day]) ? EMBRYO_STAGES[day] : {
      milestone: 'Etapa de incubación',
      airCell: '4 mm'
    };

    const svgHtml = this.mode === 'candling' 
      ? this.generateCandlingSvg(day) 
      : this.generateAnatomicalSvg(day);

    const airCellText = stage.airCell ? stage.airCell.split(' ')[0] : '~5mm';

    this.container.innerHTML = `
      <div class="visualizer-wrapper ${this.mode}-mode">
        <div class="visualizer-stage-badge">
          <span class="day-number">Día ${day}</span>
          <span class="stage-tag">${stage.milestone || `Incubación activa`}</span>
        </div>
        <div class="svg-stage-canvas">
          ${svgHtml}
        </div>
        <div class="visualizer-legend">
          <div class="legend-item"><span class="legend-dot air"></span> Cámara de aire (${airCellText} aprox.)</div>
          <div class="legend-item"><span class="legend-dot embryo"></span> ${day === 21 ? 'Pichón nacido' : (day < 4 ? 'Blastodermo' : 'Embrión & Vasos')}</div>
          ${day >= 3 && day <= 20 ? '<div class="legend-item"><span class="legend-dot pulse"></span> Latido cardíaco activo</div>' : ''}
        </div>
      </div>
    `;
  }

  /**
   * Generador de pulso cardíaco sincronizado y centrado.
   * Utiliza animaciones nativas SVG SMIL (<animate>) para garantizar centrado absoluto
   * sin desfases por sistemas de coordenadas o transform-origin en cualquier navegador.
   */
  renderHeartPulse(cx, cy, radius = 5, color = '#f43f5e') {
    const waveMaxRadius = Math.round(radius * 2.5);
    return `
      <!-- Onda de pulso vascular expansiva -->
      <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${color}" opacity="0.45" class="pulsing-wave">
        <animate attributeName="r" values="${radius}; ${waveMaxRadius}; ${radius}" dur="1.1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6; 0; 0.6" dur="1.1s" repeatCount="indefinite" />
      </circle>
      <!-- Núcleo cardíaco latiendo -->
      <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${color}" class="pulsing-heart" filter="url(#glow-pulse)">
        <animate attributeName="r" values="${radius}; ${Math.round(radius * 1.35)}; ${Math.round(radius * 1.05)}; ${Math.round(radius * 1.25)}; ${radius}" dur="1.1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.85; 1; 0.9; 1; 0.85" dur="1.1s" repeatCount="indefinite" />
      </circle>
    `;
  }

  // =========================================================================
  // VISTA 1: OVOSCOPIA / MIRAGE CON LINTERNA (CANDLING)
  // =========================================================================

  generateCandlingSvg(day) {
    // Dimensiones estándar SVG: viewBox 0 0 300 400
    // Polo romo arriba (cx 150, cy 110), polo agudo abajo (cx 150, cy 300)
    
    // Altura de cámara de aire según día (de 14px en día 0 a 85px en día 18-20)
    const airCellHeight = Math.min(85, 14 + (day * 3.4));
    
    // Opacidad de la masa embrionaria
    const opacityPct = Math.min(0.92, 0.05 + (day * 0.042));
    
    // Generación de red vascular (arañita de vasos sobre la yema)
    let bloodVessels = '';
    if (day >= 4 && day <= 17) {
      const vesselColor = day >= 5 ? '#e11d48' : '#f43f5e';
      const vesselCount = Math.min(14, 4 + (day - 4) * 2);
      const branches = [];
      for (let i = 0; i < vesselCount; i++) {
        const angle = (i / vesselCount) * Math.PI * 2;
        const len = 35 + (day * 4.5);
        const x1 = 150 + Math.cos(angle) * 8;
        const y1 = 205 + Math.sin(angle) * 8;
        const x2 = 150 + Math.cos(angle) * (len * 0.55) + (Math.sin(i * 3) * 12);
        const y2 = 205 + Math.sin(angle) * (len * 0.55) + (Math.cos(i * 2) * 12);
        const x3 = 150 + Math.cos(angle) * len + (Math.sin(i * 5) * 16);
        const y3 = 205 + Math.sin(angle) * len + (Math.cos(i * 4) * 16);
        branches.push(`M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${x2.toFixed(1)} ${y2.toFixed(1)} ${x3.toFixed(1)} ${y3.toFixed(1)}`);
      }
      bloodVessels = `
        <g class="blood-vessels" stroke="${vesselColor}" stroke-width="${day > 8 ? 2.2 : 1.5}" fill="none" opacity="${Math.min(1, 0.6 + day * 0.04)}">
          ${branches.map(d => `<path d="${d}" stroke-linecap="round"/>`).join('')}
        </g>
      `;
    }

    // Estructuras embrionarias a contraluz según el día
    let embryoSvg = '';
    if (day === 0 || day === 1) {
      embryoSvg = `
        <!-- Yema con disco germinal -->
        <circle cx="150" cy="205" r="48" fill="#f59e0b" opacity="0.35" filter="url(#glow-soft)" />
        <circle cx="150" cy="190" r="6" fill="#fef08a" opacity="0.8" />
        <text x="150" y="240" fill="#fef3c7" font-size="11" text-anchor="middle" opacity="0.7">Yema / Blastodermo</text>
      `;
    } else if (day >= 2 && day <= 4) {
      embryoSvg = `
        <circle cx="150" cy="205" r="52" fill="#f59e0b" opacity="0.4" filter="url(#glow-soft)" />
        ${bloodVessels}
        <!-- Punto embrionario incipiente con corazón latiendo perfectamente centrado -->
        <circle cx="150" cy="200" r="${4 + day}" fill="#dc2626" opacity="0.7" />
        ${this.renderHeartPulse(150, 200, 3 + day * 0.7, '#ef4444')}
      `;
    } else if (day >= 5 && day <= 9) {
      embryoSvg = `
        <circle cx="150" cy="205" r="62" fill="#d97706" opacity="0.35" />
        ${bloodVessels}
        <!-- Embrión en forma de C con ojo pigmentado de ninfa -->
        <g class="embryo-body" transform="translate(150, 195)">
          <path d="M 0 -22 C 22 -24, 30 0, 18 22 C 10 34, -8 32, -16 16 C -22 2, -14 -12, 0 -22 Z" 
                fill="#881337" opacity="0.88" />
          <!-- Ojo negro prominente -->
          <circle cx="8" cy="-12" r="${day >= 6 ? 4.2 : 2.8}" fill="#0f172a" stroke="#fb7185" stroke-width="0.8" />
          <circle cx="9" cy="-13" r="1.2" fill="#ffffff" />
          <!-- Corazón latiendo exactamente centrado en el tórax ventral -->
          ${this.renderHeartPulse(2, 5, 5, '#f43f5e')}
        </g>
      `;
    } else if (day >= 10 && day <= 17) {
      embryoSvg = `
        <circle cx="150" cy="210" r="75" fill="#92400e" opacity="0.45" />
        ${bloodVessels}
        <!-- Embrión grande y compacto con silueta anatómica -->
        <g class="embryo-body-mature" transform="translate(145, 200)">
          <!-- Silueta corporal -->
          <path d="M -28 -38 C 24 -46, 52 -10, 42 35 C 32 68, -25 72, -45 38 C -60 5, -50 -25, -28 -38 Z" 
                fill="#4c0519" opacity="${opacityPct}" />
          <!-- Cabeza inclinada hacia el polo romo -->
          <circle cx="6" cy="-22" r="22" fill="#3b0714" opacity="0.9" />
          <!-- Pico ganchudo de ninfa incipiente -->
          <polygon points="26,-26 38,-20 25,-14" fill="#fbbf24" opacity="0.85" />
          <!-- Ojo oscuro -->
          <circle cx="14" cy="-24" r="5.5" fill="#020617" />
          <circle cx="15.5" cy="-25.5" r="1.5" fill="#ffffff" />
          <!-- Esbozo de alas plegadas -->
          <path d="M -20 -4 C -2 -8, 16 12, 5 24" stroke="#f43f5e" stroke-width="2.5" fill="none" opacity="0.7"/>
          <!-- Latido en el tórax perfectamente posicionado -->
          ${this.renderHeartPulse(-2, 12, 6.5, '#e11d48')}
        </g>
      `;
    } else if (day >= 18 && day <= 20) {
      // DÍAS 18 A 20: OVOSCOPIA REALISTA ILUMINADA (NO MÁS MASA NEGRA PLANA)
      // Muestra la silueta anatómica del polluelo acurrucado a contraluz,
      // bordes iluminados cálidos por la cáscara y membranas, y picaje interno/externo.
      const isInternalPip = day === 18;
      const isExternalPip = day >= 19;
      const isZipping = day === 20;

      embryoSvg = `
        <!-- Borde periférico cálido de transiluminación (luz atravesando las membranas) -->
        <path d="M 52 145 C 50 255, 95 350, 150 355 C 205 350, 250 255, 248 145 C 200 160, 100 160, 52 145 Z" 
              fill="url(#curledChickGlow)" opacity="0.85" />

        <!-- Silueta anatómica del polluelo de ninfa acurrucado en posición fetal -->
        <g class="fetal-chick-candling" transform="translate(150, 240)">
          <!-- Dorso curvado del pichón contra la pared de la cáscara -->
          <path d="M -80 -85 C -98 -10, -75 75, -15 95 C 45 105, 85 70, 80 -5 C 75 -65, 35 -85, -20 -75 Z" 
                fill="#2a080c" opacity="0.94" stroke="#7f1d1d" stroke-width="1.5" />
          
          <!-- Contorno de ala plegada con vainas de plumas primarias -->
          <path d="M -40 -35 C 10 -45, 55 -15, 45 40 C 35 65, 5 60, -25 35 Z" 
                fill="#1f070b" stroke="#991b1b" stroke-width="1.2" opacity="0.9" />
          <path d="M -20 -20 Q 25 -5 28 35 M -12 -15 Q 32 5 35 42 M -4 -10 Q 38 15 40 48" 
                stroke="#dc2626" stroke-width="1" fill="none" opacity="0.5" />

          <!-- Muslo y pata con dedos zigodáctilos replegados -->
          <path d="M -30 45 C -15 75, 10 75, 25 55" fill="none" stroke="#7f1d1d" stroke-width="3" stroke-linecap="round" />
          <path d="M 15 70 L 35 76 M 15 70 L 32 84 M 15 70 L -2 78" stroke="#fca5a5" stroke-width="1.8" stroke-linecap="round" opacity="0.75" />

          <!-- Cuello curvado que asciende hacia la cámara de aire -->
          <path d="M -45 -70 C -30 -115, 20 -115, 40 -85" fill="none" stroke="#2a080c" stroke-width="26" stroke-linecap="round" />
          
          <!-- Cabeza colocada debajo del ala derecha apuntando hacia arriba -->
          <ellipse cx="25" cy="-88" rx="24" ry="20" fill="#2a080c" stroke="#991b1b" stroke-width="1.2" />
          
          <!-- Ojo grande oscuro con reflejo translúcido -->
          <circle cx="15" cy="-90" r="7" fill="#090d16" stroke="#991b1b" stroke-width="1" />
          <circle cx="17" cy="-92" r="2" fill="#fed7aa" opacity="0.6" />

          <!-- Pico ganchudo de ninfa con diente de huevo (diamante) -->
          <path d="M 38 -98 L 62 -90 L 44 -80 Z" fill="#fbbf24" stroke="#d97706" stroke-width="1" />
          <!-- Diamante blanco en la punta -->
          <circle cx="61" cy="-90" r="2.2" fill="#ffffff" stroke="#b45309" stroke-width="0.7" />

          <!-- Movimiento respiratorio torácico / latido en el centro -->
          ${this.renderHeartPulse(-15, -10, 6, '#ef4444')}
        </g>

        <!-- Detalle de picaje en la cámara de aire -->
        ${isInternalPip ? `
          <g class="pip-internal-badge" transform="translate(195, 108)">
            <rect x="-10" y="-12" width="95" height="22" rx="6" fill="#451a03" stroke="#f59e0b" stroke-width="1.2" opacity="0.95" />
            <text x="38" y="2" fill="#fef08a" font-size="9" font-weight="bold" text-anchor="middle">¡PICO EN CÁMARA!</text>
            <!-- Rayo indicador hacia el pico -->
            <path d="M -10 -1 L -22 6" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="2,2" />
          </g>
        ` : ''}

        ${isExternalPip ? `
          <!-- Grieta de picaje externo en la cáscara -->
          <g class="shell-crack-star" transform="translate(210, 118)">
            <path d="M 0 0 L -12 -8 L -5 -18 L 8 -12 L 14 -22 L 18 -8 L 28 -2 L 15 8 L 8 20 L -2 10 Z" 
                  stroke="#ffffff" stroke-width="2.5" fill="none" filter="url(#glow-white)"/>
            <circle cx="4" cy="-3" r="4.5" fill="#fef08a" />
            <!-- Pico asomando por la fractura -->
            <polygon points="2,-5 12,-1 4,4" fill="#fbbf24" />
            <rect x="-35" y="-36" width="105" height="20" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1" opacity="0.95" />
            <text x="17" y="-23" fill="#38bdf8" font-size="9" font-weight="bold" text-anchor="middle">PICAJE EXTERNO</text>
          </g>
        ` : ''}

        ${isZipping ? `
          <!-- Línea circular de rotación y corte (Zipping) -->
          <path d="M 58 135 Q 150 155 242 135" stroke="#ffffff" stroke-width="3" fill="none" stroke-dasharray="6,4" filter="url(#glow-white)" />
          <g transform="translate(150, 160)">
            <rect x="-65" y="-10" width="130" height="20" rx="6" fill="#047857" stroke="#34d399" stroke-width="1.2" />
            <text x="0" y="4" fill="#ecfdf5" font-size="9" font-weight="bold" text-anchor="middle">ROTACIÓN (ZIPPING)</text>
          </g>
        ` : ''}
      `;
    } else if (day === 21) {
      // DÍA 21: PICHÓN DE NINFA RECIÉN NACIDO FUERA DEL HUEVO
      // Ave altricial (nidícola): cabeza grande, pico ganchudo de psitácida con cera y narinas,
      // plumón amarillo ralo sobre piel rosada, cresta incipiente de ninfa, patas zigodáctilas,
      // descansando libremente sobre viruta de nido junto a los dos cascarones partidos vacíos.
      embryoSvg = `
        <!-- Fondo cálido del nido (luz suave de celebración) -->
        <radialGradient id="nestWarmth" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="#ea580c" stop-opacity="0.3" />
          <stop offset="60%" stop-color="#78350f" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#020617" stop-opacity="0" />
        </radialGradient>
        <circle cx="150" cy="220" r="140" fill="url(#nestWarmth)" />

        <!-- Cama de virutas de pino en el nido -->
        <g class="nest-shavings" stroke="#d97706" stroke-width="2.8" opacity="0.65" stroke-linecap="round">
          <path d="M 60 345 Q 85 330 115 348" />
          <path d="M 90 355 Q 120 340 145 352" stroke="#b45309" stroke-width="3" />
          <path d="M 130 348 Q 165 332 195 346" stroke="#f59e0b" />
          <path d="M 180 355 Q 210 338 240 350" />
          <path d="M 75 362 Q 110 350 145 365" stroke="#92400e" stroke-width="3.5" />
          <path d="M 155 360 Q 190 348 225 362" stroke="#d97706" />
        </g>

        <!-- Cascarones vacíos partidos detrás/a los lados del pichón -->
        <g class="empty-eggshells" opacity="0.85">
          <!-- Mitad inferior vacía (polo agudo) a la izquierda -->
          <g transform="translate(60, 240) rotate(-22)">
            <path d="M 0 0 C 10 50, 60 70, 75 40 C 90 10, 80 -10, 70 -15 L 55 -5 L 40 -18 L 25 -4 L 10 -15 Z" 
                  fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
            <!-- Interior cóncavo vacío con restos de membrana seca -->
            <path d="M 10 2 Q 40 30 68 -2" fill="#fed7aa" opacity="0.35" />
            <path d="M 18 10 Q 42 24 58 6" stroke="#fca5a5" stroke-width="1" fill="none" opacity="0.5" />
          </g>

          <!-- Mitad superior vacía (tapa del polo romo) a la derecha -->
          <g transform="translate(225, 235) rotate(28)">
            <path d="M -45 0 C -35 -40, 25 -40, 35 0 L 22 -6 L 10 4 L -2 -8 L -15 2 L -28 -8 Z" 
                  fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
            <!-- Borde irregular de eclosión / membrana de cámara de aire seca -->
            <path d="M -35 -4 Q 0 15 25 -2" stroke="#e2e8f0" stroke-width="1.5" fill="none" />
          </g>
        </g>

        <!-- Pichón de Ninfa (Nymphicus hollandicus) recién nacido descansando libre -->
        <g class="newborn-cockatiel" transform="translate(150, 195)">
          <!-- Sombra suave en el nido -->
          <ellipse cx="0" cy="115" rx="55" ry="14" fill="#090d16" opacity="0.6" />

          <!-- Piel rosada de base del cuerpito -->
          <path d="M -38 50 C -45 15, -28 -15, 0 -15 C 28 -15, 45 15, 38 50 C 32 85, -30 85, -38 50 Z" 
                fill="#fda4af" opacity="0.9" />

          <!-- Vientre abultado y tierno (yema recién absorbida) -->
          <ellipse cx="2" cy="55" rx="34" ry="28" fill="#fecdd3" />
          <!-- Cicatriz umbilical sellada -->
          <circle cx="2" cy="72" r="2.2" fill="#e11d48" opacity="0.6" />

          <!-- Plumón de ninfa: mechones de plumón amarillo suave y ralo sobre el cuerpo -->
          <g class="yellow-down-plumage" fill="#fef08a" stroke="#facc15" stroke-width="0.8" opacity="0.85">
            <!-- Pelusas de plumón en espalda y costados -->
            <path d="M -28 30 Q -38 25 -42 15 Q -32 20 -24 28 Z" />
            <path d="M -32 45 Q -45 42 -48 32 Q -36 36 -28 42 Z" />
            <path d="M 28 30 Q 38 25 42 15 Q 32 20 24 28 Z" />
            <path d="M 32 45 Q 45 42 48 32 Q 36 36 28 42 Z" />
            <!-- Plumoncito suave en pecho -->
            <circle cx="-12" cy="35" r="14" fill="#fef08a" opacity="0.75" />
            <circle cx="14" cy="35" r="14" fill="#fef08a" opacity="0.75" />
            <circle cx="0" cy="45" r="16" fill="#fef9c3" opacity="0.8" />
          </g>

          <!-- Alitas cortas plegadas a los lados -->
          <g class="baby-wings">
            <path d="M -34 25 C -46 38, -35 60, -22 52 C -20 38, -26 28, -34 25 Z" fill="#fca5a5" stroke="#f43f5e" stroke-width="1.2" />
            <path d="M 34 25 C 46 38, 35 60, 22 52 C 20 38, 26 28, 34 25 Z" fill="#fca5a5" stroke="#f43f5e" stroke-width="1.2" />
          </g>

          <!-- Cuello largo y cabeza grande típica de ave altricial -->
          <path d="M -16 10 C -18 -8, -12 -28, 0 -35 C 12 -28, 18 -8, 16 10 Z" fill="#fda4af" />
          <ellipse cx="0" cy="-45" rx="30" ry="26" fill="#fecdd3" stroke="#fda4af" stroke-width="1" />
          <!-- Mejillas rosadas suaves -->
          <circle cx="-18" cy="-40" r="8" fill="#fda4af" opacity="0.7" />
          <circle cx="18" cy="-40" r="8" fill="#fda4af" opacity="0.7" />

          <!-- CRESTA DE NINFA: Mechoncitos erguidos de plumón amarillo en la coronilla -->
          <g class="cockatiel-crest" stroke="#eab308" stroke-width="2.5" stroke-linecap="round">
            <!-- Mechón central más largo -->
            <path d="M 0 -71 Q 4 -85 2 -95" />
            <path d="M -4 -70 Q -8 -82 -12 -90" stroke-width="2.2" />
            <path d="M 4 -70 Q 10 -82 14 -91" stroke-width="2.2" />
            <path d="M -1 -70 Q -2 -80 -4 -88" stroke="#facc15" stroke-width="1.8" />
            <path d="M 2 -70 Q 6 -78 8 -86" stroke="#fef08a" stroke-width="1.8" />
          </g>

          <!-- Ojos cerrados de recién nacido (hendiduras suaves en forma de arco) -->
          <g class="closed-eyes" stroke="#475569" stroke-width="2.2" stroke-linecap="round" fill="none">
            <path d="M -22 -44 Q -15 -40 -8 -44" />
            <path d="M 8 -44 Q 15 -40 22 -44" />
          </g>

          <!-- PICO GANCHUDO DE NINFA (Psitácida) -->
          <g class="cockatiel-beak" transform="translate(0, -38)">
            <!-- Cera carnosa en la base del pico -->
            <path d="M -9 -7 C -4 -12, 4 -12, 9 -7 C 7 -4, -7 -4, -9 -7 Z" fill="#fda4af" stroke="#f43f5e" stroke-width="0.8" />
            <!-- Orificios nasales / narinas circulares -->
            <circle cx="-4" cy="-7" r="1.3" fill="#881337" />
            <circle cx="4" cy="-7" r="1.3" fill="#881337" />

            <!-- Mandíbula inferior rosada corta -->
            <path d="M -7 4 L 0 10 L 7 4 Z" fill="#fca5a5" stroke="#fb7185" stroke-width="0.8" />

            <!-- Mandíbula superior ganchuda curvada hacia abajo -->
            <path d="M -8 -5 Q 0 -6 8 -5 Q 6 6 0 13 Q -6 6 -8 -5 Z" fill="#fef08a" stroke="#d97706" stroke-width="1" />
            <!-- Punta ganchuda y vestigio del diamante de eclosión -->
            <circle cx="0" cy="11.5" r="1.4" fill="#ffffff" stroke="#92400e" stroke-width="0.6" />
          </g>

          <!-- Patas zigodáctilas de loro (2 dedos hacia adelante, 2 hacia atrás) -->
          <g class="zygodactyl-feet" stroke="#fda4af" stroke-width="3" stroke-linecap="round">
            <!-- Pata izquierda -->
            <path d="M -18 78 L -26 102 M -26 102 L -38 108 M -26 102 L -28 114 M -26 102 L -14 96" />
            <!-- Pata derecha -->
            <path d="M 18 78 L 26 102 M 26 102 L 38 108 M 26 102 L 28 114 M 26 102 L 14 96" />
          </g>
        </g>

        <!-- Cartel de celebración de nacimiento -->
        <g class="birth-banner" transform="translate(150, 48)">
          <rect x="-85" y="-14" width="170" height="26" rx="8" fill="#15803d" stroke="#4ade80" stroke-width="1.5" />
          <text x="0" y="4" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle" letter-spacing="0.5">
            ¡¡PICHÓN NACIDO LIBRE!! 🐣
          </text>
        </g>
      `;
    }

    return `
      <svg viewBox="0 0 300 400" width="100%" height="100%" class="egg-candling-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-pulse" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-white" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <!-- Gradiente del haz de ovoscopia -->
          <radialGradient id="candlingBeam" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stop-color="#fb923c" stop-opacity="0.96" />
            <stop offset="45%" stop-color="#ea580c" stop-opacity="0.88" />
            <stop offset="85%" stop-color="#9a3412" stop-opacity="0.95" />
            <stop offset="100%" stop-color="#431407" stop-opacity="1" />
          </radialGradient>

          <!-- Resplandor periférico para días 18-20 (evita masa negra) -->
          <radialGradient id="curledChickGlow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stop-color="#c2410c" stop-opacity="0.95" />
            <stop offset="65%" stop-color="#7f1d1d" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#450a0a" stop-opacity="0.95" />
          </radialGradient>

          <!-- Silueta del huevo de ninfa -->
          <clipPath id="eggMask">
            <path d="M 150 45 
                     C 225 45, 255 130, 255 200 
                     C 255 285, 205 365, 150 365 
                     C 95 365, 45 285, 45 200 
                     C 45 130, 75 45, 150 45 Z" />
          </clipPath>
        </defs>

        <!-- Fondo de habitación oscura -->
        <rect width="300" height="400" rx="16" fill="#090d16" />

        ${day < 21 ? `
          <!-- Resplandor externo de la linterna -->
          <ellipse cx="150" cy="85" rx="80" ry="40" fill="#f97316" opacity="0.25" filter="url(#glow-soft)" />

          <!-- Interior del huevo iluminado -->
          <g clip-path="url(#eggMask)">
            <rect width="300" height="400" fill="url(#candlingBeam)" />

            <!-- Contenido embrionario -->
            ${embryoSvg}

            <!-- Cámara de aire en el polo romo -->
            <path d="M 45 45 
                     L 255 45 
                     L 255 ${60 + airCellHeight * 0.8} 
                     Q 150 ${50 + airCellHeight * 1.3} 45 ${60 + airCellHeight * 0.8} Z" 
                  fill="#fef3c7" opacity="0.78" />
            <path d="M 60 ${62 + airCellHeight * 0.8} Q 150 ${52 + airCellHeight * 1.3} 240 ${62 + airCellHeight * 0.8}" 
                  stroke="#fbbf24" stroke-width="2" fill="none" stroke-dasharray="3,3" opacity="0.95" />
            <text x="150" y="${38 + airCellHeight * 0.5}" fill="#78350f" font-size="11" font-weight="bold" text-anchor="middle">
              Cámara de aire
            </text>
          </g>

          <!-- Borde exterior de cáscara iluminada -->
          <path d="M 150 45 
                   C 225 45, 255 130, 255 200 
                   C 255 285, 205 365, 150 365 
                   C 95 365, 45 285, 45 200 
                   C 45 130, 75 45, 150 45 Z" 
                fill="none" stroke="#fed7aa" stroke-width="3.5" opacity="0.88" />

          <!-- Linterna ovoscopio presionada en el polo romo -->
          <g class="flashlight-indicator" transform="translate(150, 42)">
            <ellipse cx="0" cy="0" rx="35" ry="10" fill="#facc15" opacity="0.6" filter="url(#glow-soft)" />
            <path d="M -25 -18 L 25 -18 L 18 0 L -18 0 Z" fill="#334155" opacity="0.9" />
            <text x="0" y="-22" fill="#cbd5e1" font-size="9" text-anchor="middle" font-weight="600">LINTERNA / OVOSCOPIO</text>
          </g>
        ` : `
          <!-- DÍA 21: ESCENA ABIERTA DEL PICHÓN ECLOSIONADO -->
          ${embryoSvg}
        `}
      </svg>
    `;
  }

  // =========================================================================
  // VISTA 2: CORTE TRANSVERSAL ANATÓMICO DINÁMICO (DÍA 0 AL 21)
  // =========================================================================

  generateAnatomicalSvg(day) {
    const stage = (typeof EMBRYO_STAGES !== 'undefined' && EMBRYO_STAGES[day]) ? EMBRYO_STAGES[day] : {
      airCell: '4 mm'
    };
    const progress = (day / 21) * 100;
    const airCellHeight = Math.min(85, 14 + (day * 3.4));

    // Generar las capas biológicas internas del corte anatómico según la etapa
    const crossSectionContent = this.renderAnatomicalCrossSection(day, airCellHeight);
    
    // Obtener marcadores anatómicos con líneas guía para este día
    const callouts = this.getAnatomicalCallouts(day, airCellHeight);

    return `
      <svg viewBox="0 0 300 400" width="100%" height="100%" class="egg-anatomical-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Gradientes anatómicos -->
          <linearGradient id="albumenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#f8fafc" stop-opacity="0.95" />
            <stop offset="60%" stop-color="#f1f5f9" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#e2e8f0" stop-opacity="0.95" />
          </linearGradient>

          <radialGradient id="yolkAnatomicalGrad" cx="45%" cy="45%" r="60%">
            <stop offset="0%" stop-color="#fef08a" />
            <stop offset="40%" stop-color="#f59e0b" />
            <stop offset="85%" stop-color="#d97706" />
            <stop offset="100%" stop-color="#b45309" />
          </radialGradient>

          <!-- Máscara interior del huevo para corte anatómico -->
          <clipPath id="anatEggMask">
            <path d="M 150 55 
                     C 220 55, 248 135, 248 205 
                     C 248 285, 200 355, 150 355 
                     C 100 355, 52 285, 52 205 
                     C 52 135, 80 55, 150 55 Z" />
          </clipPath>
        </defs>

        <!-- Fondo del canvas anatómico -->
        <rect width="300" height="400" rx="16" fill="#0b1329" />

        <!-- Título científico y barra de progreso superior -->
        <g transform="translate(150, 24)">
          <text x="0" y="0" fill="#94a3b8" font-size="10" text-anchor="middle" font-weight="600" letter-spacing="0.5">
            CORTE ANATÓMICO • NYMPHICUS HOLLANDICUS
          </text>
          <!-- Barra fina de progreso de incubación -->
          <rect x="-80" y="6" width="160" height="4" rx="2" fill="#1e293b" />
          <rect x="-80" y="6" width="${(progress * 1.6).toFixed(1)}" height="4" rx="2" fill="#38bdf8" />
        </g>

        ${day < 21 ? `
          <!-- Sombra base del huevo -->
          <ellipse cx="150" cy="365" rx="85" ry="14" fill="#020617" opacity="0.6" />

          <!-- Estructura interna del huevo cortado longitudinalmente -->
          <g clip-path="url(#anatEggMask)">
            <!-- Albúmina / Clara de huevo (fluida y densa) -->
            <rect width="300" height="400" fill="url(#albumenGrad)" />

            <!-- Contenido biológico específico del día (yema, membranas, embrión) -->
            ${crossSectionContent}

            <!-- Cámara de aire anatómica (con doble membrana testácea) -->
            <path d="M 52 55 L 248 55 L 248 ${62 + airCellHeight * 0.75} Q 150 ${52 + airCellHeight * 1.25} 52 ${62 + airCellHeight * 0.75} Z" 
                  fill="#ffffff" opacity="0.95" />
            <!-- Membrana interna de la cámara de aire -->
            <path d="M 54 ${64 + airCellHeight * 0.75} Q 150 ${54 + airCellHeight * 1.25} 246 ${64 + airCellHeight * 0.75}" 
                  stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3,2" fill="none" />
          </g>

          <!-- Grosor de la cáscara calcárea en corte y membranas externas -->
          <path d="M 150 55 
                   C 220 55, 248 135, 248 205 
                   C 248 285, 200 355, 150 355 
                   C 100 355, 52 285, 52 205 
                   C 52 135, 80 55, 150 55 Z" 
                fill="none" stroke="#e2e8f0" stroke-width="5" />
          <path d="M 150 55 
                   C 220 55, 248 135, 248 205 
                   C 248 285, 200 355, 150 355 
                   C 100 355, 52 285, 52 205 
                   C 52 135, 80 55, 150 55 Z" 
                fill="none" stroke="#64748b" stroke-width="1" />
        ` : `
          <!-- DÍA 21: ANATOMÍA DEL PICHÓN LIBRE Y CASCARÓN ABIERTO -->
          ${crossSectionContent}
        `}

        <!-- Líneas guía y etiquetas anatómicas interactivas -->
        <g class="anatomical-callouts">
          ${callouts}
        </g>

        <!-- Ficha inferior de medidas anatómicas -->
        <g transform="translate(150, 382)">
          <rect x="-135" y="-12" width="270" height="22" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1" opacity="0.95" />
          <text x="-120" y="2" fill="#94a3b8" font-size="9" font-weight="600">Longitud:</text>
          <text x="-75" y="2" fill="#fbbf24" font-size="9" font-weight="bold">${this.getEstimatedLength(day)}</text>
          <text x="30" y="2" fill="#94a3b8" font-size="9" font-weight="600">Cámara aire:</text>
          <text x="120" y="2" fill="#38bdf8" font-size="9" font-weight="bold" text-anchor="end">${stage.airCell ? stage.airCell.split(' ')[0] : '~5mm'}</text>
        </g>
      </svg>
    `;
  }

  /**
   * Genera el corte anatómico biológico según las fases de desarrollo (Día 0 al 21).
   */
  renderAnatomicalCrossSection(day, airCellHeight) {
    if (day <= 2) {
      // DÍAS 0 A 2: Yema esférica con blastodermo, chalazas y clara
      return `
        <!-- Chalazas (cordones proteicos espiralados que sostienen la yema) -->
        <path d="M 54 210 Q 75 200 95 212 Q 115 205 125 210" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8" stroke-linecap="round" />
        <path d="M 175 210 Q 195 205 215 215 Q 235 202 246 210" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.8" stroke-linecap="round" />

        <!-- Saco vitelino (yema esférica prominente) -->
        <circle cx="150" cy="210" r="54" fill="url(#yolkAnatomicalGrad)" stroke="#f59e0b" stroke-width="1.5" />
        
        <!-- Blastodermo / Disco germinativo en la superficie superior de la yema -->
        <ellipse cx="150" cy="162" rx="14" ry="6" fill="#fef08a" stroke="#ffffff" stroke-width="1" />
        <ellipse cx="150" cy="162" rx="6" ry="2.5" fill="#fef9c3" />
        ${day >= 1 ? `<line x1="145" y1="162" x2="155" y2="162" stroke="#dc2626" stroke-width="1.5" />` : ''}
      `;
    } else if (day >= 3 && day <= 4) {
      // DÍAS 3 A 4: Tubo cardíaco en 'S', vasos vitelinos y vesícula óptica
      return `
        <!-- Chalazas reduciéndose -->
        <path d="M 60 215 Q 85 208 115 215" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.6" />
        <path d="M 185 215 Q 215 208 240 215" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.6" />

        <!-- Yema con red vascular incipiente -->
        <circle cx="150" cy="215" r="56" fill="url(#yolkAnatomicalGrad)" stroke="#f59e0b" stroke-width="1.5" />

        <!-- Vasos sanguíneos vitelinos ramificados -->
        <g stroke="#e11d48" stroke-width="1.6" fill="none" opacity="0.85">
          <path d="M 150 190 Q 135 175 118 185 M 150 190 Q 165 175 182 185" />
          <path d="M 150 190 Q 128 200 115 220 M 150 190 Q 172 200 185 220" />
          <path d="M 150 190 Q 150 230 145 245" />
        </g>

        <!-- Embrión en 'C' temprana sobre la superficie de la yema -->
        <g transform="translate(150, 185)">
          <path d="M -6 -12 C 10 -15, 15 2, 10 14 C 6 20, -4 18, -8 10 C -12 2, -10 -6, -6 -12 Z" 
                fill="#dc2626" opacity="0.9" />
          <!-- Tubo cardíaco tubular activo -->
          ${this.renderHeartPulse(0, 3, 4, '#f43f5e')}
          <!-- Vesícula encefálica -->
          <circle cx="3" cy="-7" r="4.5" fill="#991b1b" />
        </g>
      `;
    } else if (day >= 5 && day <= 7) {
      // DÍAS 5 A 7: Embrión en 'C' con amnios, copa óptica oscura, arcos viscerales y alantoides
      return `
        <!-- Yema disminuyendo y rodeada de vasos -->
        <ellipse cx="150" cy="245" rx="55" ry="42" fill="url(#yolkAnatomicalGrad)" stroke="#d97706" stroke-width="1.5" />

        <!-- Alantoides en expansión hacia la cámara de aire -->
        <ellipse cx="185" cy="180" rx="22" ry="18" fill="#38bdf8" opacity="0.3" stroke="#0284c7" stroke-width="1.2" />

        <!-- Saco amniótico (vesícula translúcida llena de líquido) -->
        <circle cx="140" cy="185" r="32" fill="#e0f2fe" opacity="0.45" stroke="#7dd3fc" stroke-width="1.5" />

        <!-- Embrión en forma de 'C' clásico de ninfa -->
        <g class="anat-embryo-c" transform="translate(140, 185)">
          <!-- Cuerpo curvado -->
          <path d="M 0 -18 C 18 -20, 24 2, 14 18 C 6 28, -8 26, -14 14 C -18 2, -12 -10, 0 -18 Z" 
                fill="#881337" stroke="#9f1239" stroke-width="1.2" />
          <!-- Cabeza grande -->
          <circle cx="2" cy="-9" r="11" fill="#4c0519" />
          <!-- Ojo pigmentado de negro con retina melánica -->
          <circle cx="6" cy="-9" r="${day >= 6 ? 4.5 : 3}" fill="#090d16" stroke="#fb7185" stroke-width="0.8" />
          <circle cx="7" cy="-10" r="1.2" fill="#ffffff" />
          <!-- Esbozos de extremidades (muñones de ala y pata) -->
          <ellipse cx="-4" cy="8" rx="4" ry="2.5" fill="#be123c" />
          <ellipse cx="2" cy="16" rx="4" ry="2.5" fill="#be123c" />
          <!-- Corazón latiendo en la concavidad torácica -->
          ${this.renderHeartPulse(2, 4, 5, '#f43f5e')}
        </g>
      `;
    } else if (day >= 8 && day <= 11) {
      // DÍAS 8 A 11: Diferenciación de extremidades, pico de loro y alantoides amplio
      return `
        <!-- Membrana corioalantoidea revistiendo la pared interna -->
        <path d="M 56 120 C 56 240, 95 345, 150 350 C 205 345, 244 240, 244 120" 
              fill="none" stroke="#e11d48" stroke-width="2" opacity="0.6" stroke-dasharray="4,2" />

        <!-- Yema más pequeña absorbida gradualmente -->
        <ellipse cx="150" cy="265" rx="48" ry="32" fill="url(#yolkAnatomicalGrad)" stroke="#d97706" stroke-width="1.2" />

        <!-- Saco amniótico protegiendo al embrión -->
        <ellipse cx="145" cy="180" rx="42" ry="38" fill="#e0f2fe" opacity="0.35" stroke="#38bdf8" stroke-width="1" />

        <!-- Embrión en diferenciación con rasgos de psitácida -->
        <g class="anat-embryo-diff" transform="translate(142, 180)">
          <!-- Silueta corporal -->
          <path d="M -18 -28 C 18 -32, 38 -5, 28 25 C 20 42, -15 42, -28 22 C -36 2, -30 -15, -18 -28 Z" 
                fill="#881337" opacity="0.95" />
          <!-- Cabeza prominente -->
          <circle cx="6" cy="-16" r="16" fill="#4c0519" />
          <!-- Ojo grande con párpados formándose -->
          <circle cx="12" cy="-17" r="6" fill="#020617" stroke="#fb7185" stroke-width="0.8" />
          <circle cx="13.5" cy="-18.5" r="1.5" fill="#ffffff" />
          <!-- Pico ganchudo de ninfa con diamante incipiente -->
          <polygon points="20,-20 30,-15 20,-10" fill="#fbbf24" stroke="#d97706" stroke-width="0.8" />
          <circle cx="29" cy="-15" r="1.2" fill="#ffffff" />
          <!-- Alita en desarrollo con articulaciones -->
          <path d="M -8 -2 C 2 -5, 14 8, 4 18" stroke="#f43f5e" stroke-width="3" fill="none" stroke-linecap="round" />
          <!-- Pata zigodáctila con división de dedos -->
          <path d="M -4 20 C 4 28, 12 32, 18 28" stroke="#f43f5e" stroke-width="2.5" fill="none" stroke-linecap="round" />
          <!-- Latido cardíaco torácico -->
          ${this.renderHeartPulse(0, 5, 6, '#e11d48')}
        </g>
      `;
    } else if (day >= 12 && day <= 15) {
      // DÍAS 12 A 15: Folículos de plumas, párpados cerrados, cresta y saco vitelino en pedículo
      return `
        <!-- Yema muy reducida conectada al ombligo -->
        <ellipse cx="145" cy="285" rx="36" ry="22" fill="url(#yolkAnatomicalGrad)" stroke="#b45309" stroke-width="1.2" />
        <!-- Pedículo vitelino (cordón umbilical primitivo) -->
        <path d="M 145 263 L 140 232" stroke="#dc2626" stroke-width="3" stroke-linecap="round" />

        <!-- Feto de ninfa con pterilas (hileras de folículos de plumas) -->
        <g class="anat-fetal-feathered" transform="translate(142, 185)">
          <path d="M -30 -35 C 20 -45, 52 -10, 42 35 C 32 68, -25 72, -45 38 C -60 5, -50 -25, -30 -35 Z" 
                fill="#4c0519" opacity="0.95" />
          <!-- Puntos de folículos de plumón en la espalda y cresta -->
          <g fill="#fef08a" opacity="0.85">
            <circle cx="-25" cy="-20" r="1.5" /><circle cx="-20" cy="-10" r="1.5" /><circle cx="-15" cy="0" r="1.5" />
            <circle cx="-20" cy="12" r="1.5" /><circle cx="-15" cy="24" r="1.5" />
            <!-- Crestita cefálica folicular -->
            <circle cx="2" cy="-42" r="1.8" /><circle cx="6" cy="-44" r="1.8" /><circle cx="10" cy="-42" r="1.8" />
          </g>
          <!-- Cabeza grande con cuello curvado -->
          <circle cx="8" cy="-25" r="20" fill="#3b0714" />
          <!-- Párpados casi cerrados sobre el ojo -->
          <ellipse cx="15" cy="-26" rx="6" ry="4" fill="#1e293b" stroke="#fda4af" stroke-width="1" />
          <line x1="9" y1="-26" x2="21" y2="-26" stroke="#475569" stroke-width="1.8" />
          <!-- Pico ganchudo con cera y narinas -->
          <polygon points="26,-30 38,-22 25,-16" fill="#fbbf24" stroke="#d97706" stroke-width="1" />
          <circle cx="37" cy="-22" r="1.4" fill="#ffffff" />
          <!-- Ala plegada cubriendo el flanco -->
          <path d="M -15 -5 C 2 -10, 20 12, 10 28 C -2 32, -18 20, -15 -5 Z" fill="#3b0714" stroke="#f43f5e" stroke-width="1.2" />
          <!-- Pata zigodáctila con garras definidas -->
          <path d="M -10 32 L 2 48 M 2 48 L 12 52 M 2 48 L 4 58" stroke="#fda4af" stroke-width="2.5" stroke-linecap="round" />
          <!-- Latido en el pecho -->
          ${this.renderHeartPulse(-2, 8, 6.5, '#e11d48')}
        </g>
      `;
    } else if (day >= 16 && day <= 17) {
      // DÍAS 16 A 17: Posición fetal pre-picaje, cabeza bajo el ala derecha, saco vitelino retrayéndose
      return `
        <!-- Yema casi totalmente absorbida en el conducto umbilical -->
        <ellipse cx="140" cy="295" rx="24" ry="14" fill="url(#yolkAnatomicalGrad)" opacity="0.9" />
        <path d="M 140 281 L 138 250" stroke="#dc2626" stroke-width="3" />

        <!-- Feto de ninfa ocupando el 85% del volumen con plumón denso -->
        <g class="anat-fetal-mature" transform="translate(148, 205)">
          <path d="M -60 -50 C 40 -65, 75 -20, 68 45 C 60 90, -40 95, -68 55 C -85 10, -78 -35, -60 -50 Z" 
                fill="#2a080c" stroke="#991b1b" stroke-width="1.5" />
          <!-- Ala cubriendo la cabeza (cabeza bajo el ala) -->
          <path d="M -30 -30 C 25 -35, 55 10, 40 50 C 15 65, -25 50, -30 -30 Z" 
                fill="#1f070b" stroke="#dc2626" stroke-width="1.2" />
          <!-- Cabeza apuntando hacia arriba hacia la cámara de aire -->
          <circle cx="20" cy="-45" r="24" fill="#1f070b" />
          <!-- Pico con diamante apuntando a la membrana -->
          <polygon points="36,-58 54,-48 38,-40" fill="#fbbf24" stroke="#d97706" stroke-width="1" />
          <circle cx="53" cy="-48" r="2" fill="#ffffff" />
          <!-- Mechoncitos de crestita amarilla en nuca -->
          <path d="M 5 -68 L 2 -78 M 10 -69 L 10 -81 M 15 -68 L 18 -79" stroke="#facc15" stroke-width="2" stroke-linecap="round" />
          <!-- Latido rítmico torácico -->
          ${this.renderHeartPulse(-10, 10, 7, '#ef4444')}
        </g>
      `;
    } else if (day >= 18 && day <= 20) {
      // DÍAS 18 A 20: Picaje interno y externo, saco vitelino completamente en celoma abdominal
      const isInternalPip = day === 18;
      const isExternalPip = day >= 19;
      return `
        <!-- Cavidad celómica del polluelo con la yema totalmente internalizada -->
        <g class="anat-fetal-pipping" transform="translate(150, 215)">
          <!-- Cuerpo completo llenando la cavidad del huevo -->
          <path d="M -75 -65 C 35 -75, 80 -30, 72 55 C 65 105, -50 110, -80 65 C -95 15, -90 -45, -75 -65 Z" 
                fill="#2a080c" stroke="#991b1b" stroke-width="1.8" />
          
          <!-- Yema absorbida internamente en el abdomen -->
          <ellipse cx="-15" cy="55" rx="26" ry="18" fill="#d97706" opacity="0.65" stroke="#f59e0b" stroke-width="1" />
          <text x="-15" y="58" fill="#fef3c7" font-size="7" font-weight="bold" text-anchor="middle">Yema internalizada</text>

          <!-- Cabeza asomando hacia la cámara de aire -->
          <circle cx="22" cy="-62" r="26" fill="#1f070b" stroke="#7f1d1d" stroke-width="1" />
          
          <!-- Pico ganchudo con diamante perforando la membrana interna -->
          <polygon points="38,-75 62,-65 42,-55" fill="#fbbf24" stroke="#d97706" stroke-width="1.2" />
          <circle cx="61" cy="-65" r="2.2" fill="#ffffff" stroke="#92400e" stroke-width="0.7" />

          <!-- Crestita de ninfa aplastada suavemente contra la cáscara -->
          <path d="M 6 -86 Q 14 -96 18 -102 M 12 -87 Q 20 -98 26 -104" stroke="#facc15" stroke-width="2.5" stroke-linecap="round" />

          <!-- Pulmones activados y latido en tórax -->
          ${this.renderHeartPulse(-10, -5, 7, '#ef4444')}
        </g>

        ${isExternalPip ? `
          <!-- Grieta externa en el cascarón (corte transversal) -->
          <path d="M 215 110 L 252 118 L 246 126" stroke="#ffffff" stroke-width="3" fill="none" filter="url(#glow-white)" />
          <circle cx="248" cy="118" r="4" fill="#fbbf24" />
        ` : ''}
      `;
    } else {
      // DÍA 21: PICHÓN DE NINFA NACIDO Y CASCAJAS ANATÓMICAS
      return `
        <!-- Cascarón vacío en corte transversal anatómico -->
        <g class="empty-shell-cross" transform="translate(65, 235) rotate(-20)">
          <path d="M 0 0 C 15 65, 75 80, 85 40 C 95 10, 85 -10, 75 -15 L 60 -5 L 45 -18 L 30 -4 L 15 -15 Z" 
                fill="#f8fafc" stroke="#cbd5e1" stroke-width="3" />
          <!-- Membranas testáceas nacaradas secas -->
          <path d="M 12 12 Q 45 35 70 8" stroke="#fca5a5" stroke-width="1.5" fill="none" opacity="0.6" />
        </g>

        <!-- Pichón libre fuera del cascarón con órganos internos completamente adaptados -->
        <g class="anat-hatched-chick" transform="translate(175, 210)">
          <!-- Sombra -->
          <ellipse cx="0" cy="105" rx="48" ry="12" fill="#020617" opacity="0.6" />

          <!-- Silueta del pichón de ninfa -->
          <path d="M -32 40 C -40 10, -25 -15, 0 -15 C 25 -15, 40 10, 32 40 C 28 75, -25 75, -32 40 Z" 
                fill="#fecdd3" stroke="#fda4af" stroke-width="1.5" />
          
          <!-- Estómago y saco vitelino completamente absorbido en el celoma -->
          <ellipse cx="0" cy="45" rx="22" ry="16" fill="#f59e0b" opacity="0.4" stroke="#d97706" stroke-width="1" />
          <!-- Pulmones ventilando aire -->
          <ellipse cx="-8" cy="12" rx="7" ry="9" fill="#f43f5e" opacity="0.6" />
          <ellipse cx="8" cy="12" rx="7" ry="9" fill="#f43f5e" opacity="0.6" />

          <!-- Cabeza grande con crestita de ninfa -->
          <circle cx="0" cy="-35" r="24" fill="#fecdd3" stroke="#fda4af" stroke-width="1.2" />
          <!-- Crestita de plumón amarillo erguida -->
          <path d="M -2 -58 L -5 -76 M 2 -59 L 4 -78 M 6 -58 L 12 -74" stroke="#eab308" stroke-width="2.5" stroke-linecap="round" />
          <!-- Pico ganchudo de loro con cera -->
          <path d="M -6 -28 Q 0 -30 6 -28 Q 4 -18 0 -10 Q -4 -18 -6 -28 Z" fill="#fef08a" stroke="#d97706" stroke-width="1" />
          <circle cx="0" cy="-11" r="1.2" fill="#ffffff" />
          <!-- Ojos cerrados -->
          <path d="M -16 -34 Q -10 -30 -4 -34 M 4 -34 Q 10 -30 16 -34" stroke="#475569" stroke-width="2" fill="none" stroke-linecap="round" />
          <!-- Patas zigodáctilas -->
          <path d="M -14 65 L -22 88 M 14 65 L 22 88" stroke="#fda4af" stroke-width="2.5" stroke-linecap="round" />
        </g>
      `;
    }
  }

  /**
   * Genera las etiquetas de llamada anatómicas dinámicas con líneas guía.
   */
  getAnatomicalCallouts(day, airCellHeight) {
    if (day <= 2) {
      return `
        <!-- Callout 1: Cámara de aire -->
        <g class="callout" transform="translate(195, ${52 + airCellHeight * 0.4})">
          <line x1="0" y1="0" x2="35" y2="-10" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2,2" />
          <rect x="35" y="-20" width="62" height="18" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1" />
          <text x="66" y="-8" fill="#38bdf8" font-size="8" font-weight="bold" text-anchor="middle">Cámara aire</text>
        </g>
        <!-- Callout 2: Blastodermo -->
        <g class="callout" transform="translate(150, 162)">
          <line x1="0" y1="0" x2="-45" y2="-25" stroke="#f59e0b" stroke-width="1" stroke-dasharray="2,2" />
          <rect x="-115" y="-35" width="70" height="18" rx="4" fill="#0f172a" stroke="#f59e0b" stroke-width="1" />
          <text x="-80" y="-23" fill="#fef08a" font-size="8" font-weight="bold" text-anchor="middle">Blastodermo</text>
        </g>
        <!-- Callout 3: Chalaza -->
        <g class="callout" transform="translate(85, 210)">
          <line x1="0" y1="0" x2="-25" y2="25" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="2,2" />
          <rect x="-70" y="25" width="55" height="18" rx="4" fill="#0f172a" stroke="#cbd5e1" stroke-width="1" />
          <text x="-42" y="37" fill="#e2e8f0" font-size="8" font-weight="bold" text-anchor="middle">Chalaza</text>
        </g>
        <!-- Callout 4: Saco vitelino -->
        <g class="callout" transform="translate(190, 235)">
          <line x1="0" y1="0" x2="35" y2="15" stroke="#d97706" stroke-width="1" stroke-dasharray="2,2" />
          <rect x="35" y="15" width="65" height="18" rx="4" fill="#0f172a" stroke="#d97706" stroke-width="1" />
          <text x="67" y="27" fill="#fef3c7" font-size="8" font-weight="bold" text-anchor="middle">Saco vitelino</text>
        </g>
      `;
    } else if (day <= 7) {
      return `
        <!-- Callout 1: Ojo pigmentado -->
        <g class="callout" transform="translate(147, 176)">
          <line x1="0" y1="0" x2="-55" y2="-20" stroke="#f43f5e" stroke-width="1" stroke-dasharray="2,2" />
          <rect x="-125" y="-30" width="70" height="18" rx="4" fill="#0f172a" stroke="#f43f5e" stroke-width="1" />
          <text x="-90" y="-18" fill="#fda4af" font-size="8" font-weight="bold" text-anchor="middle">Ojo & Retina</text>
        </g>
        <!-- Callout 2: Corazón latiendo -->
        <g class="callout" transform="translate(142, 190)">
          <line x1="0" y1="0" x2="-55" y2="30" stroke="#ef4444" stroke-width="1" stroke-dasharray="2,2" />
          <rect x="-125" y="25" width="70" height="18" rx="4" fill="#0f172a" stroke="#ef4444" stroke-width="1" />
          <text x="-90" y="37" fill="#fca5a5" font-size="8" font-weight="bold" text-anchor="middle">Corazón activo</text>
        </g>
        <!-- Callout 3: Amnios -->
        <g class="callout" transform="translate(170, 175)">
          <line x1="0" y1="0" x2="40" y2="-15" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2,2" />
          <rect x="40" y="-25" width="75" height="18" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1" />
          <text x="77" y="-13" fill="#7dd3fc" font-size="8" font-weight="bold" text-anchor="middle">Saco amniótico</text>
        </g>
        <!-- Callout 4: Vasos vitelinos -->
        <g class="callout" transform="translate(180, 240)">
          <line x1="0" y1="0" x2="35" y2="20" stroke="#e11d48" stroke-width="1" stroke-dasharray="2,2" />
          <rect x="35" y="20" width="75" height="18" rx="4" fill="#0f172a" stroke="#e11d48" stroke-width="1" />
          <text x="72" y="32" fill="#fda4af" font-size="8" font-weight="bold" text-anchor="middle">Vasos vitelinos</text>
        </g>
      `;
    } else if (day <= 15) {
      return `
        <!-- Callout 1: Pico con diamante -->
        <g class="callout" transform="translate(170, 162)">
          <line x1="0" y1="0" x2="45" y2="-20" stroke="#fbbf24" stroke-width="1" stroke-dasharray="2,2" />
          <rect x="45" y="-30" width="75" height="18" rx="4" fill="#0f172a" stroke="#fbbf24" stroke-width="1" />
          <text x="82" y="-18" fill="#fef08a" font-size="8" font-weight="bold" text-anchor="middle">Pico & Diamante</text>
        </g>
        <!-- Callout 2: Pata zigodáctila -->
        <g class="callout" transform="translate(145, 225)">
          <line x1="0" y1="0" x2="55" y2="25" stroke="#fda4af" stroke-width="1" stroke-dasharray="2,2" />
          <rect x="55" y="20" width="75" height="18" rx="4" fill="#0f172a" stroke="#fda4af" stroke-width="1" />
          <text x="92" y="32" fill="#fda4af" font-size="8" font-weight="bold" text-anchor="middle">Patas zigodáctilas</text>
        </g>
        <!-- Callout 3: Folículos de cresta / plumón -->
        <g class="callout" transform="translate(122, 160)">
          <line x1="0" y1="0" x2="-45" y2="-25" stroke="#facc15" stroke-width="1" stroke-dasharray="2,2" />
          <rect x="-120" y="-35" width="75" height="18" rx="4" fill="#0f172a" stroke="#facc15" stroke-width="1" />
          <text x="-82" y="-23" fill="#fef08a" font-size="8" font-weight="bold" text-anchor="middle">Cresta / Plumón</text>
        </g>
        <!-- Callout 4: Pedículo umbilical -->
        <g class="callout" transform="translate(142, 255)">
          <line x1="0" y1="0" x2="-55" y2="25" stroke="#dc2626" stroke-width="1" stroke-dasharray="2,2" />
          <rect x="-125" y="20" width="70" height="18" rx="4" fill="#0f172a" stroke="#dc2626" stroke-width="1" />
          <text x="-90" y="32" fill="#fca5a5" font-size="8" font-weight="bold" text-anchor="middle">Ombligo vitelino</text>
        </g>
      `;
    } else if (day <= 20) {
      return `
        <!-- Callout 1: Pico en cámara de aire -->
        <g class="callout" transform="translate(195, 145)">
          <line x1="0" y1="0" x2="25" y2="-25" stroke="#fbbf24" stroke-width="1" stroke-dasharray="2,2" />
          <rect x="25" y="-35" width="75" height="18" rx="4" fill="#0f172a" stroke="#fbbf24" stroke-width="1" />
          <text x="62" y="-23" fill="#fef08a" font-size="8" font-weight="bold" text-anchor="middle">Picaje interno</text>
        </g>
        <!-- Callout 2: Yema internalizada -->
        <g class="callout" transform="translate(135, 270)">
          <line x1="0" y1="0" x2="-45" y2="25" stroke="#d97706" stroke-width="1" stroke-dasharray="2,2" />
          <rect x="-125" y="20" width="80" height="18" rx="4" fill="#0f172a" stroke="#d97706" stroke-width="1" />
          <text x="-85" y="32" fill="#fef3c7" font-size="8" font-weight="bold" text-anchor="middle">Yema en celoma</text>
        </g>
        <!-- Callout 3: Cresta y nuca -->
        <g class="callout" transform="translate(156, 125)">
          <line x1="0" y1="0" x2="-65" y2="-15" stroke="#facc15" stroke-width="1" stroke-dasharray="2,2" />
          <rect x="-135" y="-25" width="70" height="18" rx="4" fill="#0f172a" stroke="#facc15" stroke-width="1" />
          <text x="-100" y="-13" fill="#fef08a" font-size="8" font-weight="bold" text-anchor="middle">Músculo nuca</text>
        </g>
        <!-- Callout 4: Pulmones activos -->
        <g class="callout" transform="translate(140, 210)">
          <line x1="0" y1="0" x2="65" y2="20" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2,2" />
          <rect x="65" y="15" width="65" height="18" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1" />
          <text x="97" y="27" fill="#7dd3fc" font-size="8" font-weight="bold" text-anchor="middle">Respiración</text>
        </g>
      `;
    } else {
      return `
        <!-- Callout 1: Cascarón eclosionado -->
        <g class="callout" transform="translate(85, 250)">
          <line x1="0" y1="0" x2="-25" y2="-35" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="2,2" />
          <rect x="-85" y="-45" width="65" height="18" rx="4" fill="#0f172a" stroke="#cbd5e1" stroke-width="1" />
          <text x="-52" y="-33" fill="#e2e8f0" font-size="8" font-weight="bold" text-anchor="middle">Cáscara vacía</text>
        </g>
        <!-- Callout 2: Cresta de ninfa -->
        <g class="callout" transform="translate(178, 140)">
          <line x1="0" y1="0" x2="35" y2="-20" stroke="#eab308" stroke-width="1" stroke-dasharray="2,2" />
          <rect x="35" y="-30" width="75" height="18" rx="4" fill="#0f172a" stroke="#eab308" stroke-width="1" />
          <text x="72" y="-18" fill="#fef08a" font-size="8" font-weight="bold" text-anchor="middle">Crestita ninfa</text>
        </g>
        <!-- Callout 3: Yema absorbida -->
        <g class="callout" transform="translate(175, 255)">
          <line x1="0" y1="0" x2="35" y2="25" stroke="#f59e0b" stroke-width="1" stroke-dasharray="2,2" />
          <rect x="35" y="20" width="75" height="18" rx="4" fill="#0f172a" stroke="#f59e0b" stroke-width="1" />
          <text x="72" y="32" fill="#fef3c7" font-size="8" font-weight="bold" text-anchor="middle">Yema absorbida</text>
        </g>
      `;
    }
  }

  getEstimatedLength(day) {
    if (day <= 3) return "~1 - 2 mm (blastodermo)";
    if (day <= 5) return "~3 - 4 mm";
    if (day <= 7) return "~6 - 8 mm";
    if (day <= 10) return "~12 - 15 mm";
    if (day <= 14) return "~20 - 25 mm";
    if (day <= 17) return "~30 - 35 mm";
    if (day <= 20) return "~40 mm (acurrucado)";
    return "~45 - 50 mm (al nacer)";
  }
}
