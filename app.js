/**
 * Aplicación de Monitoreo de Incubación para Ninfas (Nymphicus hollandicus)
 * Lógica principal, timers en tiempo real, persistencia local y exportación ICS.
 */

// Constantes de tiempo
const MS_PER_SEC = 1000;
const MS_PER_MIN = MS_PER_SEC * 60;
const MS_PER_HOUR = MS_PER_MIN * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

const INCUBATION_TOTAL_DAYS = 21;
const CANDLING_DAY = 5;
const INTERNAL_PIP_DAY = 18;
const EGG_INTERVAL_HOURS = 48; // Intervalo típico entre puestas en ninfas

class EggTrackerApp {
  constructor() {
    this.eggs = [];
    this.visualizer = null;
    this.activeEggForVisualizer = null;
    this.activeEggForEdit = null;

    this.init();
  }

  init() {
    this.loadData();
    this.setupVisualizer();
    this.bindEvents();
    this.render();
    
    // Timer en vivo para actualizar contadores cada segundo
    setInterval(() => {
      this.updateLiveTickers();
    }, 1000);
  }

  loadData() {
    try {
      const saved = localStorage.getItem('impa_egg_tracker_data');
      if (saved) {
        this.eggs = JSON.parse(saved);
      } else {
        // Inicializar con el huevo #1 de Impa reportado hoy
        const now = new Date();
        // Fijar hora aprox 16:32 como indicó el usuario
        const layTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 32, 0);
        // Si la hora calculada está en el futuro, usar ahora mismo
        const initialDate = layTime > now ? now : layTime;

        this.eggs = [
          {
            id: 'egg_' + Date.now(),
            number: 1,
            name: 'Huevo #1 de Impa',
            layDate: initialDate.toISOString(),
            status: 'pending', // 'pending' | 'fertile' | 'infertile' | 'failed' | 'hatched'
            notes: 'Primer huevo de la nidada de Impa. Puesta detectada a media tarde.'
          }
        ];
        this.saveData();
      }
    } catch (e) {
      console.error('Error al cargar datos de localStorage:', e);
      this.eggs = [];
    }
  }

  saveData() {
    try {
      localStorage.setItem('impa_egg_tracker_data', JSON.stringify(this.eggs));
    } catch (e) {
      console.error('Error al guardar datos:', e);
    }
  }

  setupVisualizer() {
    if (typeof EmbryoVisualizer !== 'undefined') {
      this.visualizer = new EmbryoVisualizer('visualizer-canvas-container');
    }
    this.updateVisualizerBio(5);
  }

  bindEvents() {
    // Botón Registrar Huevo
    const btnAddEgg = document.getElementById('btn-add-egg');
    if (btnAddEgg) {
      btnAddEgg.addEventListener('click', () => this.openAddEggModal());
    }

    // Botón Guía de Cuidados
    const btnCareGuide = document.getElementById('btn-care-guide');
    if (btnCareGuide) {
      btnCareGuide.addEventListener('click', () => this.openModal('care-guide-modal'));
    }

    // Botón Exportar Respaldo
    const btnBackup = document.getElementById('btn-backup-data');
    if (btnBackup) {
      btnBackup.addEventListener('click', () => this.exportBackup());
    }

    // Input Importar Respaldo
    const inputImport = document.getElementById('input-import-backup');
    if (inputImport) {
      inputImport.addEventListener('change', (e) => this.importBackup(e));
    }

    // Slider de Días en Visor
    const daySlider = document.getElementById('dev-day-slider');
    if (daySlider) {
      daySlider.addEventListener('input', (e) => {
        const day = parseInt(e.target.value, 10);
        this.setVisualizerDay(day);
      });
    }

    // Botones de Modo del Visor (Candling vs Anatomía)
    const btnModeCandling = document.getElementById('btn-mode-candling');
    const btnModeAnatomy = document.getElementById('btn-mode-anatomy');
    if (btnModeCandling && btnModeAnatomy) {
      btnModeCandling.addEventListener('click', () => {
        btnModeCandling.classList.add('active');
        btnModeAnatomy.classList.remove('active');
        this.visualizer.setMode('candling');
      });
      btnModeAnatomy.addEventListener('click', () => {
        btnModeAnatomy.classList.add('active');
        btnModeCandling.classList.remove('active');
        this.visualizer.setMode('anatomical');
      });
    }

    // Formulario Nuevo Huevo
    const eggForm = document.getElementById('egg-form');
    if (eggForm) {
      eggForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleEggFormSubmit();
      });
    }

    // Botones Rápidos de Fecha/Hora
    const btnTimeNow = document.getElementById('btn-time-now');
    const btnTimeYesterday = document.getElementById('btn-time-yesterday');
    if (btnTimeNow) {
      btnTimeNow.addEventListener('click', () => this.setFormDateTime(new Date()));
    }
    if (btnTimeYesterday) {
      btnTimeYesterday.addEventListener('click', () => {
        const d = new Date(Date.now() - 24 * MS_PER_HOUR);
        this.setFormDateTime(d);
      });
    }

    // Cierre de Modales
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });
  }

  // =========================================================================
  // Cálculos de Incubación
  // =========================================================================

  getEggMetrics(egg) {
    const layTime = new Date(egg.layDate).getTime();
    const now = Date.now();
    const elapsedMs = Math.max(0, now - layTime);
    
    const elapsedDaysFloat = elapsedMs / MS_PER_DAY;
    const currentDay = Math.min(21, Math.floor(elapsedDaysFloat));
    const progressPct = Math.min(100, Math.max(0, (elapsedDaysFloat / INCUBATION_TOTAL_DAYS) * 100));

    // Tiempo restante para Día 5 (Ovoscopia)
    const candlingTargetMs = layTime + (CANDLING_DAY * MS_PER_DAY);
    const msToCandling = candlingTargetMs - now;

    // Tiempo restante para Día 18 (Picaje Interno)
    const pipTargetMs = layTime + (INTERNAL_PIP_DAY * MS_PER_DAY);
    const msToPip = pipTargetMs - now;

    // Tiempo restante para Día 21 (Eclosión)
    const hatchTargetMs = layTime + (INCUBATION_TOTAL_DAYS * MS_PER_DAY);
    const msToHatch = hatchTargetMs - now;

    return {
      layTime,
      elapsedMs,
      elapsedDaysFloat,
      currentDay,
      progressPct,
      msToCandling,
      msToPip,
      msToHatch,
      candlingDate: new Date(candlingTargetMs),
      hatchDate: new Date(hatchTargetMs),
      pipDate: new Date(pipTargetMs)
    };
  }

  formatDuration(ms) {
    if (ms <= 0) return "Completado";
    const days = Math.floor(ms / MS_PER_DAY);
    const hours = Math.floor((ms % MS_PER_DAY) / MS_PER_HOUR);
    const mins = Math.floor((ms % MS_PER_HOUR) / MS_PER_MIN);
    const secs = Math.floor((ms % MS_PER_MIN) / MS_PER_SEC);

    if (days > 0) {
      return `${days}d ${hours}h ${mins}m`;
    }
    return `${hours}h ${mins}m ${secs}s`;
  }

  formatDate(dateObj) {
    return dateObj.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // =========================================================================
  // Renderizado Principal de la Vista
  // =========================================================================

  render() {
    this.renderStats();
    this.renderNextEggBanner();
    this.renderEggsGrid();
  }

  renderStats() {
    const total = this.eggs.length;
    const fertile = this.eggs.filter(e => e.status === 'fertile').length;
    const hatched = this.eggs.filter(e => e.status === 'hatched').length;
    const pending = this.eggs.filter(e => e.status === 'pending').length;

    const elTotal = document.getElementById('stat-total-eggs');
    const elFertile = document.getElementById('stat-fertile-eggs');
    const elPending = document.getElementById('stat-pending-eggs');
    const elHatched = document.getElementById('stat-hatched-eggs');

    if (elTotal) elTotal.textContent = total;
    if (elFertile) elFertile.textContent = fertile;
    if (elPending) elPending.textContent = pending;
    if (elHatched) elHatched.textContent = hatched;
  }

  renderNextEggBanner() {
    const banner = document.getElementById('next-egg-banner');
    if (!banner) return;

    if (this.eggs.length === 0) {
      banner.style.display = 'none';
      return;
    }

    // Buscar el huevo puesto más recientemente
    const sortedEggs = [...this.eggs].sort((a, b) => new Date(b.layDate) - new Date(a.layDate));
    const latestEgg = sortedEggs[0];
    const latestLayTime = new Date(latestEgg.layDate).getTime();
    const nextExpectedLayTime = latestLayTime + (EGG_INTERVAL_HOURS * MS_PER_HOUR);
    const msToNext = nextExpectedLayTime - Date.now();

    const nextEggNumber = this.eggs.length + 1;
    const titleEl = document.getElementById('next-egg-title');
    const descEl = document.getElementById('next-egg-desc');
    const countdownEl = document.getElementById('next-egg-timer');

    if (titleEl) titleEl.textContent = `Próximo huevo estimado: Huevo #${nextEggNumber}`;
    if (descEl) descEl.textContent = `Las ninfas suelen poner cada ~48h. Fecha estimada: ${this.formatDate(new Date(nextExpectedLayTime))}`;
    
    if (countdownEl) {
      if (msToNext > 0) {
        countdownEl.textContent = `Faltan aprox. ${this.formatDuration(msToNext)}`;
      } else {
        countdownEl.textContent = `¡Listo para poner! (Han pasado +48h)`;
      }
    }
    banner.style.display = 'flex';
  }

  renderEggsGrid() {
    const grid = document.getElementById('eggs-grid');
    if (!grid) return;

    if (this.eggs.length === 0) {
      grid.innerHTML = `
        <div class="empty-clutch-state">
          <div class="empty-icon">🪺</div>
          <h3>Aún no hay huevos registrados en la nidada</h3>
          <p>Presiona el botón superior para registrar el primer huevo de Impa y comenzar a monitorear su desarrollo.</p>
          <button class="btn btn-primary" onclick="app.openAddEggModal()">+ Registrar Primer Huevo</button>
        </div>
      `;
      return;
    }

    // Ordenar por fecha de puesta ascendente (Huevo 1, 2, 3...)
    const sorted = [...this.eggs].sort((a, b) => new Date(a.layDate) - new Date(b.layDate));

    grid.innerHTML = sorted.map(egg => {
      const m = this.getEggMetrics(egg);
      const isFertile = egg.status === 'fertile';
      const isHatched = egg.status === 'hatched';
      const isPending = egg.status === 'pending';

      const statusLabels = {
        pending: '🥚 Pendiente Ovoscopia',
        fertile: '💓 Fértil Confirmado',
        infertile: '⚪ Huevo Claro / Infértil',
        failed: '⚠️ Desarrollo Detenido',
        hatched: '🐣 ¡Eclosionado!'
      };

      const candlingTimeLabel = m.msToCandling > 0 
        ? `Faltan ${this.formatDuration(m.msToCandling)}`
        : `¡Listo para ovoscopia! (${this.formatDate(m.candlingDate)})`;

      const hatchTimeLabel = m.msToHatch > 0
        ? `Faltan ${this.formatDuration(m.msToHatch)}`
        : `¡Día de eclosión alcanzado! (${this.formatDate(m.hatchDate)})`;

      return `
        <div class="egg-card" id="card-${egg.id}">
          <div class="egg-card-header">
            <div class="egg-identity">
              <div class="egg-icon-pill ${isFertile ? 'fertile-glow' : ''}">
                ${isHatched ? '🐣' : (isFertile ? '💓' : '🥚')}
              </div>
              <div class="egg-title-box">
                <h3>${this.escapeHtml(egg.name)}</h3>
                <div class="egg-lay-date">Puesta: ${this.formatDate(new Date(egg.layDate))}</div>
              </div>
            </div>
            <div class="status-badge ${egg.status}">
              ${statusLabels[egg.status] || egg.status}
            </div>
          </div>

          <!-- Barra de Progreso de Incubación -->
          <div class="incubation-progress-block">
            <div class="progress-header">
              <span class="day-counter">
                ${m.elapsedDaysFloat < 1 ? `Día 0 (${Math.floor(m.elapsedMs / MS_PER_HOUR)}h transcurridas)` : `Día ${m.elapsedDaysFloat.toFixed(1)} de 21`}
              </span>
              <span class="pct">${m.progressPct.toFixed(0)}%</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${m.progressPct}%"></div>
            </div>
            <div class="progress-milestones">
              <span class="${m.currentDay >= 0 ? 'active' : ''}">Puesta</span>
              <span class="${m.currentDay >= CANDLING_DAY ? 'active' : ''}">Día 5 (Miraje)</span>
              <span class="${m.currentDay >= INTERNAL_PIP_DAY ? 'active' : ''}">Día 18 (Picaje)</span>
              <span class="${m.currentDay >= 21 ? 'active' : ''}">Día 21 (Nace)</span>
            </div>
          </div>

          <!-- Cuentas Regresivas Críticas -->
          <div class="milestones-box">
            <div class="milestone-row ${m.msToCandling > 0 && m.currentDay < CANDLING_DAY ? 'highlight' : ''}">
              <span class="milestone-label">🔦 Ovoscopia (Día 5):</span>
              <span class="milestone-time" data-candling-for="${egg.id}">${candlingTimeLabel}</span>
            </div>

            <div class="milestone-row ${m.msToHatch > 0 && m.currentDay >= 17 ? 'hatch-highlight' : ''}">
              <span class="milestone-label">🐣 Eclosión (Día 21):</span>
              <span class="milestone-time" data-hatch-for="${egg.id}">${hatchTimeLabel}</span>
            </div>
          </div>

          ${egg.notes ? `<p style="font-size:0.8rem; color:var(--text-dim); margin-bottom:1rem; font-style:italic;">"${this.escapeHtml(egg.notes)}"</p>` : ''}

          <!-- Acciones -->
          <div class="egg-card-actions">
            <button class="btn btn-primary btn-sm" onclick="app.openVisualizerForEgg('${egg.id}')">
              🔬 Ver Desarrollo
            </button>
            <button class="btn btn-secondary btn-sm" onclick="app.openChangeStatusModal('${egg.id}')">
              ⚙️ Estado
            </button>
            <button class="btn btn-ghost btn-sm" title="Descargar recordatorios a calendario" onclick="app.downloadIcsForEgg('${egg.id}')">
              📅 Calendario
            </button>
            <button class="btn btn-ghost btn-sm" title="Editar huevo" onclick="app.openEditEggModal('${egg.id}')">
              ✏️
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Actualización en vivo sin recargar el DOM
  updateLiveTickers() {
    if (typeof document === 'undefined' || !document.querySelector) return;
    this.eggs.forEach(egg => {
      const m = this.getEggMetrics(egg);
      
      const candlingEl = document.querySelector(`[data-candling-for="${egg.id}"]`);
      if (candlingEl) {
        candlingEl.textContent = m.msToCandling > 0 
          ? `Faltan ${this.formatDuration(m.msToCandling)}`
          : `¡Listo para ovoscopia! (${this.formatDate(m.candlingDate)})`;
      }

      const hatchEl = document.querySelector(`[data-hatch-for="${egg.id}"]`);
      if (hatchEl) {
        hatchEl.textContent = m.msToHatch > 0
          ? `Faltan ${this.formatDuration(m.msToHatch)}`
          : `¡Día de eclosión! (${this.formatDate(m.hatchDate)})`;
      }
    });

    // Actualizar estimador del siguiente huevo
    const countdownEl = document.getElementById('next-egg-timer');
    if (countdownEl && this.eggs.length > 0) {
      const sortedEggs = [...this.eggs].sort((a, b) => new Date(b.layDate) - new Date(a.layDate));
      const latestEgg = sortedEggs[0];
      const nextExpectedLayTime = new Date(latestEgg.layDate).getTime() + (EGG_INTERVAL_HOURS * MS_PER_HOUR);
      const msToNext = nextExpectedLayTime - Date.now();
      if (msToNext > 0) {
        countdownEl.textContent = `Faltan aprox. ${this.formatDuration(msToNext)}`;
      } else {
        countdownEl.textContent = `¡Listo para poner! (Han pasado +48h)`;
      }
    }
  }

  // =========================================================================
  // Visor de Desarrollo de Polluelo
  // =========================================================================

  openVisualizerForEgg(eggId) {
    const egg = this.eggs.find(e => e.id === eggId);
    if (!egg) return;

    this.activeEggForVisualizer = egg;
    const m = this.getEggMetrics(egg);
    const day = Math.min(21, Math.max(0, m.currentDay));

    const modalTitle = document.getElementById('dev-modal-title');
    if (modalTitle) {
      modalTitle.textContent = `Desarrollo Embrionario: ${egg.name}`;
    }

    const daySlider = document.getElementById('dev-day-slider');
    if (daySlider) {
      daySlider.value = day;
    }

    this.setVisualizerDay(day);
    this.openModal('embryo-visualizer-modal');
  }

  setVisualizerDay(day) {
    const sliderValLabel = document.getElementById('slider-day-val');
    if (sliderValLabel) {
      sliderValLabel.textContent = `Día ${day}`;
    }

    if (this.visualizer) {
      this.visualizer.setDay(day);
    }

    this.updateVisualizerBio(day);
  }

  updateVisualizerBio(day) {
    const stage = EMBRYO_STAGES[day] || EMBRYO_STAGES[0];
    const container = document.getElementById('stage-bio-details');
    if (!container) return;

    container.innerHTML = `
      <div class="stage-bio-card">
        <div class="stage-bio-header">
          <h2>${stage.title}</h2>
          <p>${stage.shortDesc}</p>
        </div>

        <div class="bio-section-box">
          <h4>🔬 ¿Qué se observa en Ovoscopia?</h4>
          <p>${stage.candlingDesc}</p>
        </div>

        <div class="bio-section-box">
          <h4>🐥 Anatomía y Desarrollo del Embrión</h4>
          <p>${stage.chickAnatomy}</p>
          <div style="margin-top:0.5rem; font-size:0.8rem; color:var(--accent-amber);">
            <strong>Cámara de aire:</strong> ${stage.airCell}
          </div>
        </div>

        <div class="bio-tips-box">
          <h4>💡 Consejo de Manejo y Nido</h4>
          <p>${stage.temperatureTip}</p>
        </div>

        <div style="margin-top:0.5rem; font-size:0.8rem; color:var(--text-dim); line-height:1.4;">
          ${stage.detailedDesc}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // Formularios de Huevos (Crear, Editar, Cambiar Estado)
  // =========================================================================

  openAddEggModal() {
    this.activeEggForEdit = null;
    const modalTitle = document.getElementById('egg-form-modal-title');
    if (modalTitle) modalTitle.textContent = `Registrar Nuevo Huevo`;

    const nextNumber = this.eggs.length + 1;
    document.getElementById('form-egg-name').value = `Huevo #${nextNumber} de Impa`;
    
    // Poner fecha y hora actual local
    this.setFormDateTime(new Date());

    document.getElementById('form-egg-status').value = 'pending';
    document.getElementById('form-egg-notes').value = '';

    this.openModal('egg-form-modal');
  }

  openEditEggModal(eggId) {
    const egg = this.eggs.find(e => e.id === eggId);
    if (!egg) return;

    this.activeEggForEdit = egg;
    const modalTitle = document.getElementById('egg-form-modal-title');
    if (modalTitle) modalTitle.textContent = `Editar ${egg.name}`;

    document.getElementById('form-egg-name').value = egg.name;
    this.setFormDateTime(new Date(egg.layDate));
    document.getElementById('form-egg-status').value = egg.status;
    document.getElementById('form-egg-notes').value = egg.notes || '';

    this.openModal('egg-form-modal');
  }

  setFormDateTime(dateObj) {
    const input = document.getElementById('form-egg-date');
    if (!input) return;

    // Formatear a YYYY-MM-DDTHH:mm para input datetime-local
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const mins = String(dateObj.getMinutes()).padStart(2, '0');
    input.value = `${year}-${month}-${day}T${hours}:${mins}`;
  }

  handleEggFormSubmit() {
    const name = document.getElementById('form-egg-name').value.trim() || 'Huevo sin nombre';
    const dateVal = document.getElementById('form-egg-date').value;
    const status = document.getElementById('form-egg-status').value;
    const notes = document.getElementById('form-egg-notes').value.trim();

    if (!dateVal) {
      alert('Por favor selecciona la fecha y hora de la puesta.');
      return;
    }

    const layDate = new Date(dateVal).toISOString();

    if (this.activeEggForEdit) {
      // Edición
      this.activeEggForEdit.name = name;
      this.activeEggForEdit.layDate = layDate;
      this.activeEggForEdit.status = status;
      this.activeEggForEdit.notes = notes;
    } else {
      // Nuevo huevo
      const newEgg = {
        id: 'egg_' + Date.now(),
        number: this.eggs.length + 1,
        name,
        layDate,
        status,
        notes
      };
      this.eggs.push(newEgg);
    }

    this.saveData();
    this.render();
    this.closeModal('egg-form-modal');
  }

  openChangeStatusModal(eggId) {
    const egg = this.eggs.find(e => e.id === eggId);
    if (!egg) return;

    const currentStatus = egg.status;
    const newStatus = prompt(
      `Cambiar estado para ${egg.name}:\n\n` +
      `1: Pendiente de ovoscopia (pending)\n` +
      `2: Fértil confirmado (fertile)\n` +
      `3: No fértil / Claro (infertile)\n` +
      `4: Detenido / Muerte temprana (failed)\n` +
      `5: ¡Eclosionado! (hatched)\n\n` +
      `Escribe el número del nuevo estado (1-5):`
    );

    const statusMap = {
      '1': 'pending',
      '2': 'fertile',
      '3': 'infertile',
      '4': 'failed',
      '5': 'hatched'
    };

    if (newStatus && statusMap[newStatus.trim()]) {
      egg.status = statusMap[newStatus.trim()];
      this.saveData();
      this.render();
    }
  }

  deleteEgg(eggId) {
    const egg = this.eggs.find(e => e.id === eggId);
    if (!egg) return;
    if (confirm(`¿Estás seguro de eliminar el registro de ${egg.name}?`)) {
      this.eggs = this.eggs.filter(e => e.id !== eggId);
      this.saveData();
      this.render();
    }
  }

  // =========================================================================
  // Exportación de Calendario iCal (.ics)
  // =========================================================================

  downloadIcsForEgg(eggId) {
    const egg = this.eggs.find(e => e.id === eggId);
    if (!egg) return;

    const m = this.getEggMetrics(egg);
    const formatIcsDate = (d) => {
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const candlingStart = formatIcsDate(m.candlingDate);
    const candlingEnd = formatIcsDate(new Date(m.candlingDate.getTime() + MS_PER_HOUR));

    const pipStart = formatIcsDate(m.pipDate);
    const pipEnd = formatIcsDate(new Date(m.pipDate.getTime() + MS_PER_HOUR));

    const hatchStart = formatIcsDate(m.hatchDate);
    const hatchEnd = formatIcsDate(new Date(m.hatchDate.getTime() + MS_PER_HOUR));

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Nido de Impa//Incubation Tracker//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      
      // Evento 1: Ovoscopia Día 5
      'BEGIN:VEVENT',
      `UID:candling-${egg.id}@impa-tracker`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${candlingStart}`,
      `DTEND:${candlingEnd}`,
      `SUMMARY:🔦 Miraje / Ovoscopia: ${egg.name} (Ninfa Impa)`,
      `DESCRIPTION:Día 5 de incubación de Nymphicus hollandicus. Revisar en habitación oscura con linterna LED si se aprecian vasos sanguíneos y latido cardíaco.`,
      'STATUS:CONFIRMED',
      'END:VEVENT',

      // Evento 2: Picaje interno Día 18
      'BEGIN:VEVENT',
      `UID:pip-${egg.id}@impa-tracker`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${pipStart}`,
      `DTEND:${pipEnd}`,
      `SUMMARY:💧 Subir Humedad nido (Día 18): ${egg.name}`,
      `DESCRIPTION:Día 18. El pichón de ninfa inicia el picaje interno de la cámara de aire. Elevar la humedad del nido al 65%-75% para facilitar la rotura de la cáscara.`,
      'STATUS:CONFIRMED',
      'END:VEVENT',

      // Evento 3: Eclosión Día 21
      'BEGIN:VEVENT',
      `UID:hatch-${egg.id}@impa-tracker`,
      `DTSTAMP:${formatIcsDate(new Date())}`,
      `DTSTART:${hatchStart}`,
      `DTEND:${hatchEnd}`,
      `SUMMARY:🐣 ¡Día de Eclosión! Nacimiento: ${egg.name}`,
      `DESCRIPTION:Día 21 de incubación. Nacimiento estimado del pichón de Impa. Preparar alimento fresco para los padres (pasta de cría, mixtura y agua limpia).`,
      'STATUS:CONFIRMED',
      'END:VEVENT',

      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Recordatorios_Incubacion_${egg.name.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // =========================================================================
  // Respaldo de Datos (JSON)
  // =========================================================================

  exportBackup() {
    const dataStr = JSON.stringify(this.eggs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Respaldo_Nidada_Impa_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          this.eggs = imported;
          this.saveData();
          this.render();
          alert('¡Datos de la nidada importados correctamente!');
        } else {
          alert('El archivo no tiene el formato esperado.');
        }
      } catch (err) {
        alert('Error al leer el archivo de respaldo JSON.');
      }
    };
    reader.readAsText(file);
  }

  // Modales
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Instancia global
let app = null;
window.addEventListener('DOMContentLoaded', () => {
  app = new EggTrackerApp();
});
