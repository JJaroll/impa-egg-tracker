/**
 * Generador interactivo de gráficos SVG para visualizar el desarrollo embrionario
 * de Nymphicus hollandicus en vista normal y vista de ovoscopia (candling).
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
    const stage = EMBRYO_STAGES[day] || EMBRYO_STAGES[0];

    const svgHtml = this.mode === 'candling' 
      ? this.generateCandlingSvg(day) 
      : this.generateAnatomicalSvg(day);

    this.container.innerHTML = `
      <div class="visualizer-wrapper ${this.mode}-mode">
        <div class="visualizer-stage-badge">
          <span class="day-number">Día ${day}</span>
          <span class="stage-tag">${stage.milestone || `Etapa de incubación`}</span>
        </div>
        <div class="svg-stage-canvas">
          ${svgHtml}
        </div>
        <div class="visualizer-legend">
          <div class="legend-item"><span class="legend-dot air"></span> Cámara de aire (${stage.airCell.split(' ')[0]} aprox.)</div>
          <div class="legend-item"><span class="legend-dot embryo"></span> ${day === 21 ? 'Polluelo nacido' : (day < 4 ? 'Blastodermo' : 'Embrión & Vasos')}</div>
          ${day >= 3 && day <= 20 ? '<div class="legend-item"><span class="legend-dot pulse"></span> Latido cardíaco activo</div>' : ''}
        </div>
      </div>
    `;
  }

  generateCandlingSvg(day) {
    // Dimensiones del huevo estándar en SVG: viewBox 0 0 300 400
    // Polo romo arriba (cx 150, cy 110), polo agudo abajo (cx 150, cy 300)
    
    // Altura de cámara de aire según día (de 15px en día 0 a 85px en día 18-20)
    const airCellHeight = Math.min(85, 14 + (day * 3.4));
    
    // Nivel de opacidad embrionaria (de translúcido a casi negro)
    const opacityPct = Math.min(0.92, 0.05 + (day * 0.042));
    
    // Tamaño del embrión
    const embryoSize = Math.min(75, 4 + (day * 3.6));
    
    // Generación de red vascular (arañita de vasos)
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

    // Embrión gráfico
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
        <!-- Punto embrionario incipiente -->
        <circle cx="150" cy="200" r="${4 + day}" fill="#dc2626" class="pulsing-heart" />
        <circle cx="150" cy="200" r="${2 + day * 0.5}" fill="#ef4444" />
      `;
    } else if (day >= 5 && day <= 9) {
      embryoSvg = `
        <circle cx="150" cy="205" r="62" fill="#d97706" opacity="0.35" />
        ${bloodVessels}
        <!-- Embrión en forma de C con ojo pigmentado -->
        <g class="embryo-body" transform="translate(150, 195)">
          <path d="M -12 -18 C 16 -24, 28 -4, 20 18 C 14 34, -10 32, -18 16 C -24 0, -18 -12, -12 -18 Z" 
                fill="#881337" opacity="0.85" />
          <!-- Ojo negro prominente -->
          <circle cx="5" cy="-8" r="${day >= 6 ? 4.2 : 2.5}" fill="#0f172a" stroke="#fb7185" stroke-width="0.8" />
          <circle cx="6" cy="-9" r="1.2" fill="#ffffff" />
          <!-- Corazón latiendo -->
          <circle cx="-1" cy="4" r="5" fill="#f43f5e" class="pulsing-heart" filter="url(#glow-pulse)" />
        </g>
      `;
    } else if (day >= 10 && day <= 17) {
      embryoSvg = `
        <circle cx="150" cy="210" r="75" fill="#92400e" opacity="0.45" />
        ${bloodVessels}
        <!-- Embrión grande y compacto -->
        <g class="embryo-body-mature" transform="translate(145, 200)">
          <!-- Silueta corporal -->
          <path d="M -28 -38 C 24 -46, 52 -10, 42 35 C 32 68, -25 72, -45 38 C -60 5, -50 -25, -28 -38 Z" 
                fill="#4c0519" opacity="${opacityPct}" />
          <!-- Cabeza inclinada hacia el polo romo -->
          <circle cx="6" cy="-22" r="22" fill="#3b0714" opacity="0.9" />
          <!-- Pico incipiente -->
          <polygon points="26,-26 38,-20 25,-14" fill="#fbbf24" opacity="0.8" />
          <!-- Ojo -->
          <circle cx="14" cy="-24" r="5.5" fill="#020617" />
          <circle cx="15.5" cy="-25.5" r="1.5" fill="#ffffff" />
          <!-- Esbozo de alas y cresta -->
          <path d="M -20 -4 C -2 -8, 16 12, 5 24" stroke="#f43f5e" stroke-width="2.5" fill="none" opacity="0.7"/>
          <!-- Latido fuerte en el centro -->
          <circle cx="-6" cy="2" r="7" fill="#e11d48" class="pulsing-heart" filter="url(#glow-pulse)" />
        </g>
      `;
    } else if (day >= 18 && day <= 20) {
      const isInternalPip = day === 18;
      const isExternalPip = day >= 19;
      embryoSvg = `
        <!-- Embrión ocupando casi todo el huevo con pico en cámara de aire -->
        <path d="M 52 145 C 50 255, 95 350, 150 355 C 205 350, 250 255, 248 145 C 210 ${145 + airCellHeight * 0.3}, 90 ${145 + airCellHeight * 0.3}, 52 145 Z" 
              fill="#1e1014" opacity="0.95" />
        
        <!-- Pico penetrando la cámara de aire (Internal Pip) -->
        <g class="internal-pip-beak" transform="translate(150, ${105 + airCellHeight * 0.4})">
          <polygon points="-8,10 16,-8 2,18" fill="#fbbf24" stroke="#d97706" stroke-width="1" />
          <!-- Diente de huevo / Diamante -->
          <circle cx="15" cy="-7" r="2.2" fill="#ffffff" stroke="#92400e" stroke-width="0.6" />
          <text x="-4" y="-12" fill="#fef08a" font-size="10" font-weight="bold">¡Pico en cámara!</text>
        </g>

        ${isExternalPip ? `
          <!-- Grieta de picaje externo en cáscara -->
          <g class="shell-crack" transform="translate(195, 125)">
            <path d="M 0 0 L -8 -6 L -3 -14 L 6 -10 L 10 -18 L 14 -6 L 8 4 Z" stroke="#ffffff" stroke-width="2" fill="none" filter="url(#glow-white)"/>
            <circle cx="2" cy="-6" r="3" fill="#fef08a" />
            <text x="18" y="-4" fill="#ffffff" font-size="11" font-weight="bold">Picaje externo</text>
          </g>
        ` : ''}
      `;
    } else if (day === 21) {
      embryoSvg = `
        <!-- Cascarón quebrado y pichón de ninfa nacido -->
        <g class="hatched-chick" transform="translate(150, 180)">
          <!-- Mitad inferior de la cáscara -->
          <path d="M -70 60 C -60 140, 60 140, 70 60 L 45 45 L 25 65 L 0 45 L -25 65 L -45 45 Z" 
                fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" />
          <!-- Polluelo de Ninfa con plumón amarillo -->
          <ellipse cx="0" cy="10" rx="42" ry="34" fill="#fef08a" />
          <circle cx="0" cy="-25" r="28" fill="#fef08a" />
          <!-- Ojo cerrado tierno del recién nacido -->
          <path d="M 8 -26 Q 16 -24 22 -26" stroke="#475569" stroke-width="2.5" fill="none" stroke-linecap="round" />
          <!-- Crestita incipiente con mechoncitos amarillos -->
          <path d="M -6 -50 L -2 -35 M 2 -53 L 4 -35 M 10 -48 L 8 -35" stroke="#eab308" stroke-width="3.5" stroke-linecap="round" />
          <!-- Pico rosado/amarillo curvado -->
          <path d="M 18 -20 L 32 -16 L 20 -10 Z" fill="#fca5a5" stroke="#f43f5e" stroke-width="0.8" />
          <!-- Alita pequeña -->
          <path d="M -30 15 C -40 25, -20 40, -10 30" fill="#fde047" stroke="#eab308" stroke-width="1.5" />
          <!-- Pata de pichón -->
          <path d="M 15 42 L 25 58 M 25 58 L 32 58 M 25 58 L 22 64" stroke="#fca5a5" stroke-width="2.5" stroke-linecap="round" />
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
          <filter id="glow-pulse" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-white" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <!-- Gradiente de iluminación de linterna ovoscopio -->
          <radialGradient id="candlingBeam" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stop-color="#fb923c" stop-opacity="0.95" />
            <stop offset="45%" stop-color="#ea580c" stop-opacity="0.85" />
            <stop offset="85%" stop-color="#9a3412" stop-opacity="0.95" />
            <stop offset="100%" stop-color="#431407" stop-opacity="1" />
          </radialGradient>

          <!-- Máscara de silueta de huevo de ninfa (polo romo arriba, agudo abajo) -->
          <clipPath id="eggMask">
            <!-- Curva anatómica clásica de huevo de ninfa -->
            <path d="M 150 45 
                     C 225 45, 255 130, 255 200 
                     C 255 285, 205 365, 150 365 
                     C 95 365, 45 285, 45 200 
                     C 45 130, 75 45, 150 45 Z" />
          </clipPath>
        </defs>

        <!-- Fondo de habitación oscura para ovoscopia -->
        <rect width="300" height="400" rx="16" fill="#090d16" />

        <!-- Haz de luz externa del ovoscopio detrás del huevo -->
        <ellipse cx="150" cy="85" rx="80" ry="40" fill="#f97316" opacity="0.25" filter="url(#glow-soft)" />

        <!-- Contenedor del interior del huevo con máscara -->
        <g clip-path="url(#eggMask)">
          <!-- Relleno luminoso traslúcido del huevo iluminado -->
          <rect width="300" height="400" fill="url(#candlingBeam)" />

          <!-- Estructuras embrionarias según el día -->
          ${embryoSvg}

          <!-- Cámara de aire en el polo romo (arriba) -->
          ${day < 21 ? `
            <path d="M 45 45 
                     L 255 45 
                     L 255 ${60 + airCellHeight * 0.8} 
                     Q 150 ${50 + airCellHeight * 1.3} 45 ${60 + airCellHeight * 0.8} Z" 
                  fill="#fef3c7" opacity="0.75" />
            <path d="M 60 ${62 + airCellHeight * 0.8} Q 150 ${52 + airCellHeight * 1.3} 240 ${62 + airCellHeight * 0.8}" 
                  stroke="#fbbf24" stroke-width="2" fill="none" stroke-dasharray="3,3" opacity="0.9" />
            <text x="150" y="${38 + airCellHeight * 0.5}" fill="#78350f" font-size="11" font-weight="bold" text-anchor="middle">
              Cámara de aire
            </text>
          ` : ''}
        </g>

        <!-- Borde exterior de la cáscara de huevo con brillo -->
        <path d="M 150 45 
                 C 225 45, 255 130, 255 200 
                 C 255 285, 205 365, 150 365 
                 C 95 365, 45 285, 45 200 
                 C 45 130, 75 45, 150 45 Z" 
              fill="none" stroke="#fed7aa" stroke-width="3.5" opacity="0.85" />

        <!-- Luz de la linterna ovoscopio presionada en la parte superior -->
        <g class="flashlight-indicator" transform="translate(150, 42)">
          <ellipse cx="0" cy="0" rx="35" ry="10" fill="#facc15" opacity="0.6" filter="url(#glow-soft)" />
          <path d="M -25 -18 L 25 -18 L 18 0 L -18 0 Z" fill="#334155" opacity="0.9" />
          <text x="0" y="-22" fill="#cbd5e1" font-size="9" text-anchor="middle" font-weight="600">LINTERNA / OVOSCOPIO</text>
        </g>
      </svg>
    `;
  }

  generateAnatomicalSvg(day) {
    // Vista exterior anatómica / esquemática de la cáscara y proporciones
    const stage = EMBRYO_STAGES[day];
    const progress = (day / 21) * 100;
    
    return `
      <svg viewBox="0 0 300 400" width="100%" height="100%" class="egg-anatomical-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="eggShellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="50%" stop-color="#f8fafc" />
            <stop offset="100%" stop-color="#e2e8f0" />
          </linearGradient>
          <linearGradient id="meterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#f59e0b" />
            <stop offset="100%" stop-color="#10b981" />
          </linearGradient>
        </defs>

        <rect width="300" height="400" rx="16" fill="#0f172a" />

        <!-- Huevo exterior realista -->
        <g transform="translate(0, 0)">
          <!-- Sombra -->
          <ellipse cx="150" cy="365" rx="85" ry="16" fill="#020617" opacity="0.6" />
          <!-- Cáscara -->
          <path d="M 150 55 
                   C 220 55, 248 135, 248 205 
                   C 248 285, 200 355, 150 355 
                   C 100 355, 52 285, 52 205 
                   C 52 135, 80 55, 150 55 Z" 
                fill="url(#eggShellGrad)" stroke="#cbd5e1" stroke-width="2" />
          
          <!-- Textura suave de cáscara -->
          <path d="M 85 110 Q 95 180 85 250" stroke="#f1f5f9" stroke-width="6" fill="none" opacity="0.7" stroke-linecap="round" />
        </g>

        <!-- Información anatómica superpuesta -->
        <g class="anatomical-callouts" transform="translate(150, 205)">
          <rect x="-105" y="-60" width="210" height="120" rx="12" fill="#1e293b" opacity="0.92" stroke="#334155" stroke-width="1.5" />
          <text x="0" y="-36" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">ANATOMÍA DEL POLLUELO</text>
          <text x="0" y="-12" fill="#f8fafc" font-size="13" font-weight="600" text-anchor="middle">Día ${day} de 21 (${progress.toFixed(0)}%)</text>
          
          <!-- Separador -->
          <line x1="-80" y1="2" x2="80" y2="2" stroke="#475569" stroke-width="1" />
          
          <text x="-90" y="24" fill="#cbd5e1" font-size="10" font-weight="bold">Longitud estimada:</text>
          <text x="90" y="24" fill="#fbbf24" font-size="10" text-anchor="end" font-weight="bold">${this.getEstimatedLength(day)}</text>

          <text x="-90" y="44" fill="#cbd5e1" font-size="10" font-weight="bold">Cámara de aire:</text>
          <text x="90" y="44" fill="#38bdf8" font-size="10" text-anchor="end">${stage.airCell.split(' ')[0]}</text>
        </g>

        <!-- Indicador de especies -->
        <text x="150" y="32" fill="#94a3b8" font-size="11" text-anchor="middle" font-style="italic">
          Nymphicus hollandicus (Ninfa Carolina)
        </text>
      </svg>
    `;
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
