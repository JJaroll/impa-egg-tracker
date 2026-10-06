/**
 * Aplicación de Monitoreo de Incubación para Ninfas (Nymphicus hollandicus)
 * Lógica principal, timers en tiempo real, persistencia local, autenticación de roles y exportación ICS.
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
    this.chicks = [];
    this.clutchCompleted = false; // true = parada de puesta / nidada cerrada
    this.chicksTab = 'list'; // 'list' | 'diagram' | 'guides'
    this.chickVisualizer = null;
    this.activeEggForVisualizer = null;
    this.activeEggForEdit = null;
    this.activeEggForHatch = null;
    this.activeChickForWeight = null;
    this.activeChickForEdit = null;

    // Sistema de Roles: Modo Lectura (visitante) vs Modo Administrador (dueño de Impa)
    this.isAdmin = false;
    // Clave maestra autorizada: Zelda2096 (hash SHA-256 precalculado)
    this.DEFAULT_PIN_HASH = '4597da85b54b0215a8b5d536291aab6f1fb48952dd97698ee26a2fab58b8cdec';
    this.activePinHash = this.DEFAULT_PIN_HASH;

    this.init();
  }

  async init() {
    // Comprobar si hay sesión activa de administrador
    this.checkStoredAuth();

    // Cargar datos canónicos o locales
    await this.loadData();

    // Inicializar componentes
    this.setupVisualizer();
    this.setupChickVisualizer();
    this.bindEvents();
    this.updateRoleUI();
    this.render();
    
    // Timer en vivo para actualizar contadores cada segundo
    setInterval(() => {
      this.updateLiveTickers();
    }, 1000);
  }

  checkStoredAuth() {
    try {
      const isSession = sessionStorage.getItem('impa_admin_auth') === 'true';
      const isLocal = localStorage.getItem('impa_admin_auth') === 'true';
      this.isAdmin = isSession || isLocal;
    } catch (e) {
      this.isAdmin = false;
    }
  }

  async loadData() {
    // Si es administrador y tiene datos guardados en su navegador, respetar su sesión local
    if (this.isAdmin) {
      try {
        const savedEggs = localStorage.getItem('impa_egg_tracker_data');
        const savedChicks = localStorage.getItem('impa_chicks_data');
        const savedClutch = localStorage.getItem('impa_clutch_completed');
        if (savedEggs) {
          this.eggs = JSON.parse(savedEggs);
          if (savedChicks) this.chicks = JSON.parse(savedChicks);
          if (savedClutch !== null) this.clutchCompleted = savedClutch === 'true';
          this.syncHatchedEggsWithChicks();
          return;
        }
      } catch (e) {
        console.error('Error al cargar datos locales de admin:', e);
      }
    }

    // Para visitantes (o admin sin datos locales), cargar la fuente canónica data/nest.json
    try {
      const resp = await fetch(`data/nest.json?t=${Date.now()}`);
      if (resp.ok) {
        const nestData = await resp.json();
        if (nestData) {
          if (nestData.adminPinHash) {
            this.activePinHash = nestData.adminPinHash;
          }
          if (nestData.clutchCompleted !== undefined) {
            this.clutchCompleted = Boolean(nestData.clutchCompleted);
          }
          if (Array.isArray(nestData.chicks)) {
            this.chicks = nestData.chicks;
          }
          if (Array.isArray(nestData.eggs) && nestData.eggs.length > 0) {
            this.eggs = nestData.eggs;
            this.syncHatchedEggsWithChicks();
            // Si es admin, guardar copia local
            if (this.isAdmin) {
              this.saveData();
            }
            return;
          }
        }
      }
    } catch (err) {
      console.warn('No se pudo cargar data/nest.json desde red, usando almacenamiento local:', err);
    }

    // Fallback: verificar localStorage
    try {
      const savedEggs = localStorage.getItem('impa_egg_tracker_data');
      const savedChicks = localStorage.getItem('impa_chicks_data');
      const savedClutch = localStorage.getItem('impa_clutch_completed');
      if (savedEggs) {
        this.eggs = JSON.parse(savedEggs);
        if (savedChicks) this.chicks = JSON.parse(savedChicks);
        if (savedClutch !== null) this.clutchCompleted = savedClutch === 'true';
        this.syncHatchedEggsWithChicks();
        return;
      }
    } catch (e) {
      console.error('Error al cargar datos de localStorage:', e);
    }

    // Fallback inicial: huevo #1 de Impa del 17 de septiembre
    this.eggs = [
      {
        id: 'egg_1_impa',
        number: 1,
        name: 'Huevo #1 de Impa',
        layDate: '2026-09-17T16:32:00-03:00',
        status: 'pending', // 'pending' | 'fertile' | 'infertile' | 'failed' | 'hatched'
        notes: 'Primer huevo de la nidada de Impa. Puesta detectada el 17 de septiembre a las 16:32 aprox. Incubación estándar de 21 días.'
      }
    ];
    this.chicks = [];
    this.clutchCompleted = false;

    if (this.isAdmin) {
      this.saveData();
    }
  }

  syncHatchedEggsWithChicks() {
    if (!Array.isArray(this.chicks)) this.chicks = [];
    this.eggs.forEach(egg => {
      if (egg.status === 'hatched') {
        const exists = this.chicks.some(c => c.eggId === egg.id || c.eggNumber === egg.number);
        if (!exists) {
          const hatchDate = egg.hatchDate || new Date().toISOString();
          this.chicks.push({
            id: 'chick_' + egg.id,
            eggId: egg.id,
            eggNumber: egg.number,
            name: `Pollo #${egg.number} de Impa`,
            hatchDate: hatchDate,
            ringNumber: '',
            mutation: 'Perlado (Hijo/a de Impa)',
            initialWeight: 4.5,
            weightLogs: [
              { date: hatchDate, weight: 4.5, note: 'Peso al nacer (Eclosión)' }
            ],
            milestonesDone: ['hatched'],
            notes: egg.notes || ''
          });
        }
      }
    });
  }

  saveData() {
    if (!this.isAdmin) {
      console.warn('Acción bloqueada: Solo el dueño de Impa puede modificar datos.');
      return;
    }
    try {
      localStorage.setItem('impa_egg_tracker_data', JSON.stringify(this.eggs));
      localStorage.setItem('impa_chicks_data', JSON.stringify(this.chicks));
      localStorage.setItem('impa_clutch_completed', this.clutchCompleted ? 'true' : 'false');
    } catch (e) {
      console.error('Error al guardar datos:', e);
    }
  }

  // =========================================================================
  // Autenticación de Roles (SHA-256)
  // =========================================================================

  async sha256(str) {
    const buffer = new TextEncoder().encode(str);
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  openAdminLoginModal() {
    const input = document.getElementById('input-admin-pin');
    const err = document.getElementById('admin-pin-error');
    if (err) err.classList.add('hidden');
    if (input) {
      input.value = '';
      input.classList.remove('shake-input');
    }
    this.openModal('modal-admin-login');
    setTimeout(() => {
      if (input) input.focus();
    }, 150);
  }

  async submitAdminPin() {
    const input = document.getElementById('input-admin-pin');
    const pin = input ? input.value.trim() : '';
    const remember = document.getElementById('check-remember-admin')?.checked || false;
    const err = document.getElementById('admin-pin-error');

    if (!pin) {
      if (input) {
        input.classList.add('shake-input');
        setTimeout(() => input.classList.remove('shake-input'), 450);
      }
      return;
    }

    try {
      const hash = await this.sha256(pin);
      const authorizedHash = this.activePinHash || this.DEFAULT_PIN_HASH;
      const customHash = localStorage.getItem('impa_admin_custom_pin_hash');

      if (hash === authorizedHash || hash === this.DEFAULT_PIN_HASH || (customHash && hash === customHash)) {
        // Limpiar hash local anterior si coincide con la clave maestra actual
        if (hash === this.DEFAULT_PIN_HASH && customHash) {
          localStorage.removeItem('impa_admin_custom_pin_hash');
        }
        this.isAdmin = true;
        sessionStorage.setItem('impa_admin_auth', 'true');
        if (remember) {
          localStorage.setItem('impa_admin_auth', 'true');
        }
        this.closeModal('modal-admin-login');
        this.updateRoleUI();
        this.render();
        this.showToast('¡Modo Dueño desbloqueado! Puedes registrar y editar huevos.', 'verified_user');
      } else {
        if (err) err.classList.remove('hidden');
        if (input) {
          input.classList.add('shake-input');
          setTimeout(() => input.classList.remove('shake-input'), 450);
          input.select();
        }
      }
    } catch (e) {
      console.error('Error al verificar PIN:', e);
      alert('Error en la verificación de seguridad.');
    }
  }

  logoutAdmin() {
    this.isAdmin = false;
    try {
      sessionStorage.removeItem('impa_admin_auth');
      localStorage.removeItem('impa_admin_auth');
    } catch (e) {}

    this.updateRoleUI();
    this.render();
    this.showToast('Sesión de administrador cerrada. Estás en Modo Lectura.', 'lock');
  }

  updateRoleUI() {
    const headerContainer = document.getElementById('header-role-controls');
    if (headerContainer) {
      if (!this.isAdmin) {
        // VISTA VISITANTE (MODO LECTURA)
        headerContainer.innerHTML = `
          <div class="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] sm:text-xs font-label-caps text-blue-300 shrink-0">
            <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span class="hidden sm:inline">MODO LECTURA</span>
            <span class="sm:hidden">LECTURA</span>
          </div>
          <button type="button" onclick="app.openAdminLoginModal()" class="btn-secondary px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-label-caps flex items-center gap-1 text-amber-400 border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10 transition-all shadow-sm shrink-0" title="Acceso Dueño de Impa (Desbloquear edición)">
            <span class="material-symbols-outlined text-[15px] sm:text-[16px]">lock</span>
            <span class="hidden sm:inline">ACCESO DUEÑO</span>
          </button>
        `;
      } else {
        // VISTA ADMINISTRADOR (DUEÑO DE IMPA)
        headerContainer.innerHTML = `
          <div class="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-[10px] sm:text-xs font-label-caps text-amber-300 font-bold shrink-0">
            <span>👑</span>
            <span class="hidden md:inline">DUEÑO DE IMPA</span>
          </div>
          <button type="button" onclick="app.openAddEggModal()" class="btn-primary px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-label-caps tracking-wider flex items-center gap-1 shadow-md shrink-0">
            <span class="material-symbols-outlined text-[15px] sm:text-[16px]">add</span>
            <span class="hidden sm:inline">REGISTRAR HUEVO</span>
            <span class="sm:hidden">HUEVO</span>
          </button>
          <button type="button" onclick="app.openPublishModal()" class="btn-secondary px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-label-caps flex items-center gap-1 text-emerald-400 border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/10 transition-all shrink-0" title="Publicar nest.json para visitantes en GitHub Pages">
            <span class="material-symbols-outlined text-[15px] sm:text-[16px]">cloud_upload</span>
            <span class="hidden lg:inline">PUBLICAR</span>
          </button>
          <button type="button" onclick="app.exportBackup()" class="btn-secondary px-2 py-1.5 sm:py-2 rounded-xl text-xs font-label-caps flex items-center gap-1 shrink-0" title="Respaldar datos JSON">
            <span class="material-symbols-outlined text-[15px] sm:text-[16px]">download</span>
          </button>
          <label for="input-import-backup" class="btn-secondary px-2 py-1.5 sm:py-2 rounded-xl text-xs font-label-caps flex items-center gap-1 cursor-pointer shrink-0" title="Restaurar datos JSON">
            <span class="material-symbols-outlined text-[15px] sm:text-[16px]">upload</span>
          </label>
          <input type="file" id="input-import-backup" accept=".json" class="hidden">
          <button type="button" onclick="app.logoutAdmin()" class="btn-secondary px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-label-caps flex items-center gap-1 text-red-400 border-red-500/30 hover:border-red-400 hover:bg-red-500/10 transition-all shrink-0" title="Cerrar sesión de administrador">
            <span class="material-symbols-outlined text-[15px] sm:text-[16px]">lock_open</span>
            <span class="hidden sm:inline">BLOQUEAR</span>
          </button>
        `;

        // Re-vincular input de importación en caso de recreación
        const inputImport = document.getElementById('input-import-backup');
        if (inputImport) {
          inputImport.addEventListener('change', (e) => this.importBackup(e));
        }
      }
    }

    // Actualizar sección de seguridad en modal de Ajustes
    const settingsRoleSection = document.getElementById('settings-role-section');
    if (settingsRoleSection) {
      if (this.isAdmin) {
        settingsRoleSection.innerHTML = `
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <span>👑</span>
                <span>Modo Administrador Activo</span>
              </div>
              <p class="text-[11px] text-muted">Tienes permisos completos para gestionar los huevos de Impa.</p>
            </div>
            <button type="button" onclick="app.logoutAdmin(); closeSettings();" class="btn-secondary px-2.5 py-1 rounded-lg text-xs text-red-400 font-label-caps border-red-500/30">
              Cerrar Sesión
            </button>
          </div>
          <div class="pt-2 border-t border-theme flex items-center justify-between">
            <span class="text-[11px] text-muted">Seguridad:</span>
            <button type="button" onclick="app.promptChangePin()" class="btn-secondary px-2 py-1 rounded-lg text-[10px] font-label-caps text-accent border-accent/30">
              Cambiar PIN
            </button>
          </div>
        `;
      } else {
        settingsRoleSection.innerHTML = `
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-1.5 text-xs font-bold text-blue-300">
                <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Modo Visitante (Solo Lectura)</span>
              </div>
              <p class="text-[11px] text-muted">Visualización en vivo y descarga de recordatorios.</p>
            </div>
            <button type="button" onclick="closeSettings(); app.openAdminLoginModal();" class="btn-secondary px-2.5 py-1 rounded-lg text-xs text-amber-400 font-label-caps border-amber-500/30">
              Desbloquear Dueño
            </button>
          </div>
        `;
      }
    }
  }

  async promptChangePin() {
    const currentPin = prompt('Ingresa tu clave actual:');
    if (!currentPin) return;

    const currentHash = await this.sha256(currentPin.trim());
    const authorizedHash = this.activePinHash || this.DEFAULT_PIN_HASH;
    const customHash = localStorage.getItem('impa_admin_custom_pin_hash');

    if (currentHash !== authorizedHash && currentHash !== this.DEFAULT_PIN_HASH && currentHash !== customHash) {
      alert('La clave actual es incorrecta.');
      return;
    }

    const newPin = prompt('Ingresa tu NUEVA clave de seguridad:');
    if (!newPin || newPin.trim().length < 4) {
      alert('La clave debe tener al menos 4 caracteres.');
      return;
    }

    const confirmPin = prompt('Confirma tu NUEVA clave de seguridad:');
    if (newPin !== confirmPin) {
      alert('Las claves no coinciden. No se realizaron cambios.');
      return;
    }

    const newHash = await this.sha256(newPin.trim());
    this.activePinHash = newHash;
    localStorage.setItem('impa_admin_custom_pin_hash', newHash);
    this.showToast('¡Clave actualizada! Pulsa "Publicar" para sincronizarla en otros navegadores.', 'key');
  }

  setupVisualizer() {
    if (typeof EmbryoVisualizer !== 'undefined') {
      this.visualizer = new EmbryoVisualizer('visualizer-canvas-container');
    }
    this.updateVisualizerBio(5);
  }

  bindEvents() {
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
        if (this.visualizer) this.visualizer.setMode('candling');
      });
      btnModeAnatomy.addEventListener('click', () => {
        btnModeAnatomy.classList.add('active');
        btnModeCandling.classList.remove('active');
        if (this.visualizer) this.visualizer.setMode('anatomical');
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
    this.renderChicksView();
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

  toggleClutchStatus() {
    if (!this.isAdmin) {
      this.openAdminLoginModal();
      return;
    }
    this.clutchCompleted = !this.clutchCompleted;
    this.saveData();
    this.render();
    if (this.clutchCompleted) {
      this.showToast('Puesta de huevos marcada como finalizada. Se detuvo la estimación de 48h.', 'stop_circle');
    } else {
      this.showToast('Puesta de huevos reanudada. Estimando ventana de 48h.', 'play_circle');
    }
  }

  renderNextEggBanner() {
    const banner = document.getElementById('next-egg-banner');
    if (!banner) return;

    if (this.eggs.length === 0) {
      banner.style.display = 'none';
      return;
    }

    // Si la puesta ha sido detenida por el dueño (nidada cerrada)
    if (this.clutchCompleted) {
      banner.className = 'glass-card p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent shrink-0';
      banner.innerHTML = `
        <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <span class="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-emerald-600 text-white font-label-caps font-bold text-[9px] sm:text-[10px] tracking-wider uppercase shrink-0">
            NIDADA COMPLETA
          </span>
          <div class="min-w-0">
            <h3 class="font-display font-bold text-xs sm:text-base text-main truncate">
              Puesta Finalizada • ${this.eggs.length} ${this.eggs.length === 1 ? 'huevo' : 'huevos'} en seguimiento
            </h3>
            <p class="text-[11px] sm:text-xs text-muted font-label-caps truncate">
              Impa concluyó la puesta. La incubación y el cuidado de los pichones están en curso activo.
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <div class="font-data font-bold text-xs sm:text-sm text-emerald-400 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-black/30 border border-emerald-500/30 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>PUESTA DETENIDA</span>
          </div>
          ${this.isAdmin ? `
            <button onclick="app.toggleClutchStatus()" class="btn-secondary py-1.5 px-3 rounded-lg text-xs font-label-caps flex items-center gap-1 text-accent border-accent/40 hover:bg-accent/10" title="Reabrir la estimación si Impa pone otro huevo">
              <span class="material-symbols-outlined text-[15px]">play_circle</span>
              <span class="hidden sm:inline">REANUDAR PUESTA</span>
              <span class="sm:hidden">REANUDAR</span>
            </button>
          ` : ''}
        </div>
      `;
      banner.style.display = 'flex';
      return;
    }

    // Ordenar huevos por fecha de puesta
    const sorted = [...this.eggs].sort((a, b) => new Date(a.layDate) - new Date(b.layDate));
    const lastEgg = sorted[sorted.length - 1];
    const lastLayTime = new Date(lastEgg.layDate).getTime();
    const nextLayTargetMs = lastLayTime + (EGG_INTERVAL_HOURS * MS_PER_HOUR);
    const nextNumber = sorted.length + 1;
    const now = Date.now();
    const msRemaining = nextLayTargetMs - now;

    let timerText = '';
    let timerClass = '';

    if (msRemaining > 0) {
      timerText = `Faltan ~${this.formatDuration(msRemaining)}`;
      timerClass = 'text-accent border-accent/30';
    } else {
      timerText = `¡Ventana de puesta abierta! (hace ${this.formatDuration(Math.abs(msRemaining))})`;
      timerClass = 'text-emerald-400 border-emerald-500/40 animate-pulse';
    }

    banner.className = 'glass-card p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 border-accent/30 bg-gradient-to-r from-accent/10 to-transparent shrink-0';
    banner.innerHTML = `
      <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <span class="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-accent text-white font-label-caps font-bold text-[9px] sm:text-[10px] tracking-wider uppercase shrink-0">
          PRÓXIMA PUESTA
        </span>
        <div class="min-w-0">
          <h3 id="next-egg-title" class="font-display font-bold text-xs sm:text-base text-main truncate">
            Próximo huevo estimado: Huevo #${nextNumber}
          </h3>
          <p id="next-egg-desc" class="text-[11px] sm:text-xs text-muted font-label-caps truncate">
            Las ninfas suelen poner cada ~48 horas. Última puesta: ${this.formatDate(new Date(lastLayTime))}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <div class="font-data font-bold text-xs sm:text-base ${timerClass} px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-black/30 border" id="next-egg-timer">
          ${timerText}
        </div>
        ${this.isAdmin ? `
          <button onclick="app.toggleClutchStatus()" class="btn-secondary py-1.5 px-3 rounded-lg text-xs font-label-caps flex items-center gap-1 text-red-400 border-red-500/40 hover:bg-red-500/10" title="Detener el contador de 48h si Impa concluyó su puesta">
            <span class="material-symbols-outlined text-[15px]">stop_circle</span>
            <span class="hidden sm:inline">DETENER PUESTA</span>
            <span class="sm:hidden">DETENER</span>
          </button>
        ` : ''}
      </div>
    `;

    banner.style.display = 'flex';
  }

  renderEggsGrid() {
    const container = document.getElementById('eggs-grid');
    if (!container) return;

    if (this.eggs.length === 0) {
      container.innerHTML = `
        <div class="col-span-full glass-card p-8 flex flex-col items-center justify-center text-center gap-3">
          <span class="material-symbols-outlined text-muted text-5xl">egg</span>
          <h3 class="font-display font-bold text-base text-main">No hay huevos registrados aún</h3>
          <p class="text-xs text-muted max-w-sm">
            ${this.isAdmin ? 'Registra el primer huevo puesto por Impa para iniciar el cronograma.' : 'El nido de Impa aún no tiene huevos publicados.'}
          </p>
          ${this.isAdmin ? `
            <button onclick="app.openAddEggModal()" class="btn-primary py-2 px-4 rounded-xl text-xs font-label-caps mt-2 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">add</span>
              <span>REGISTRAR HUEVO #1</span>
            </button>
          ` : ''}
        </div>
      `;
      return;
    }

    const statusBadgeMap = {
      pending: { label: 'PENDIENTE DE OVOSCOPIA', class: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
      fertile: { label: 'FÉRTIL CONFIRMADO', class: 'bg-green-500/15 text-green-400 border-green-500/30' },
      infertile: { label: 'NO FÉRTIL (CLARO)', class: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
      failed: { label: 'DETENIDO / MALOGRADO', class: 'bg-red-500/15 text-red-400 border-red-500/30' },
      hatched: { label: '¡ECLOSIONADO!', class: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' }
    };

    container.innerHTML = this.eggs.map(egg => {
      const m = this.getEggMetrics(egg);
      const badge = statusBadgeMap[egg.status] || statusBadgeMap.pending;

      const candlingTimeLabel = m.msToCandling > 0 
        ? `Faltan ${this.formatDuration(m.msToCandling)}` 
        : `¡Listo para ovoscopia! (${this.formatDate(m.candlingDate)})`;

      const hatchTimeLabel = m.msToHatch > 0 
        ? `Faltan ${this.formatDuration(m.msToHatch)}` 
        : `¡Periodo cumplido! (${this.formatDate(m.hatchDate)})`;

      const isHatched = egg.status === 'hatched';

      return `
        <div class="glass-card p-3.5 sm:p-5 flex flex-col gap-3.5 sm:gap-4 border-theme hover:border-accent/40 transition-all relative group" id="card-${egg.id}">
          
          <!-- Encabezado de la Tarjeta -->
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent font-display font-bold text-sm sm:text-base shrink-0">
                #${egg.number || 1}
              </div>
              <div class="min-w-0">
                <h3 class="font-display font-bold text-sm sm:text-base text-main leading-tight truncate">${this.escapeHtml(egg.name)}</h3>
                <p class="text-[11px] sm:text-xs text-muted font-label-caps mt-0.5">Puesta: ${this.formatDate(new Date(egg.layDate))}</p>
              </div>
            </div>

            <span class="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-label-caps font-bold border ${badge.class} shrink-0 text-right">
              ${badge.label}
            </span>
          </div>

          <!-- Barra de Progreso de 21 Días -->
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between text-xs font-label-caps">
              <span class="text-muted">Desarrollo:</span>
              <span class="font-data font-bold text-accent">DÍA ${m.currentDay} DE 21 (${m.progressPct.toFixed(0)}%)</span>
            </div>
            <div class="w-full h-2.5 rounded-full bg-input border border-theme overflow-hidden p-0.5">
              <div class="h-full rounded-full bg-gradient-to-r from-accent to-emerald-400 transition-all duration-500" style="width: ${m.progressPct}%;"></div>
            </div>
          </div>

          <!-- Hitos Clave -->
          <div class="flex flex-col gap-1.5 text-xs font-label-caps">
            <div class="flex items-center justify-between p-2 rounded-lg bg-input/30 border border-theme">
              <span class="text-muted flex items-center gap-1 shrink-0">
                <span class="material-symbols-outlined text-[16px] text-amber-400">flashlight_on</span>
                <span class="hidden xs:inline">Ovoscopia (Día 5):</span>
                <span class="xs:hidden">Día 5:</span>
              </span>
              <span class="font-data font-bold text-main text-right text-[11px] sm:text-xs" data-candling-for="${egg.id}">${candlingTimeLabel}</span>
            </div>

            <div class="flex items-center justify-between p-2 rounded-lg bg-input/30 border border-theme">
              <span class="text-muted flex items-center gap-1 shrink-0">
                <span class="material-symbols-outlined text-[16px] text-emerald-400">nest_cam_stand</span>
                <span class="hidden xs:inline">Eclosión (Día 21):</span>
                <span class="xs:hidden">Día 21:</span>
              </span>
              <span class="font-data font-bold text-main text-right text-[11px] sm:text-xs" data-hatch-for="${egg.id}">${hatchTimeLabel}</span>
            </div>
          </div>

          ${egg.notes ? `<p class="text-xs text-muted/80 italic px-1 font-body">"${this.escapeHtml(egg.notes)}"</p>` : ''}

          <!-- Acciones de la Tarjeta (Diferenciadas por Rol) -->
          <div class="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 pt-2 border-t border-theme">
            <!-- Botón de desarrollo (abierto a todos) -->
            <button class="btn-primary flex-1 py-2 px-2.5 sm:px-3 rounded-xl text-xs font-label-caps tracking-wider flex items-center justify-center gap-1 shadow-sm min-w-[100px]" onclick="app.openVisualizerForEgg('${egg.id}')">
              <span class="material-symbols-outlined text-[16px]">biotech</span>
              <span>VER DÍA ${m.currentDay}</span>
            </button>

            ${isHatched ? `
              <!-- Botón Ver Pollo (si ya eclosionó) -->
              <button class="btn-secondary py-2 px-2.5 sm:px-3 rounded-xl text-xs font-label-caps flex items-center justify-center gap-1 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10 shrink-0" onclick="app.focusChick('${egg.id}')" title="Ver seguimiento y crecimiento de este pollo">
                <span class="text-sm">🐥</span>
                <span>VER POLLO</span>
              </button>
            ` : ''}

            <!-- Botón de descarga de recordatorio individual (abierto a todos) -->
            <button class="btn-secondary py-2 px-2.5 sm:px-3 rounded-xl text-xs font-label-caps flex items-center justify-center gap-1 text-accent border-accent/30 hover:border-accent hover:bg-accent/10 shrink-0" onclick="app.downloadIcsForEgg('${egg.id}')" title="Descargar recordatorios a tu calendario (.ics)">
              <span class="material-symbols-outlined text-[16px]">calendar_add_on</span>
              <span class="hidden sm:inline">RECORDATORIO</span>
            </button>

            ${this.isAdmin ? `
              ${!isHatched ? `
                <!-- Botón ¡Eclosionó! directo para Administrador -->
                <button class="btn-secondary py-2 px-2.5 sm:px-3 rounded-xl text-xs font-label-caps text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/15 flex items-center gap-1 shrink-0" onclick="app.openHatchModal('${egg.id}')" title="Registrar que este huevo ya eclosionó">
                  <span class="text-sm leading-none">🐣</span>
                  <span>¡ECLOSIONÓ!</span>
                </button>
              ` : ''}

              <!-- Acciones exclusivas del Administrador -->
              <button class="btn-secondary py-2 px-2 sm:px-2.5 rounded-xl text-xs font-label-caps text-amber-400 hover:bg-amber-500/10" onclick="app.openChangeStatusModal('${egg.id}')" title="Cambiar estado de fertilidad">
                <span class="material-symbols-outlined text-[16px]">tune</span>
              </button>
              <button class="btn-secondary py-2 px-2 sm:px-2.5 rounded-xl text-xs font-label-caps" onclick="app.openEditEggModal('${egg.id}')" title="Editar huevo">
                <span class="material-symbols-outlined text-[16px]">edit</span>
              </button>
              <button class="btn-secondary py-2 px-2 sm:px-2.5 rounded-xl text-xs font-label-caps text-red-400 hover:bg-red-500/10 hover:border-red-500/40" onclick="app.deleteEgg('${egg.id}')" title="Eliminar huevo">
                <span class="material-symbols-outlined text-[16px]">delete</span>
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  // Actualización en vivo sin recargar el DOM
  updateLiveTickers() {
    if (typeof document === 'undefined' || !document.querySelector) return;
    
    // 1. Tickers de huevos
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
          : `¡Periodo cumplido! (${this.formatDate(m.hatchDate)})`;
      }
    });

    // 2. Tickers de pollos (edad viva)
    this.chicks.forEach(chick => {
      const m = this.getChickMetrics(chick);
      const ageEl = document.querySelector(`[data-chick-age-for="${chick.id}"]`);
      if (ageEl) {
        ageEl.textContent = `${m.ageDays} días, ${m.ageHours} horas`;
      }
    });

    // 3. Banner de próximo huevo (solo si la puesta está activa)
    if (!this.clutchCompleted && this.eggs.length > 0) {
      const sorted = [...this.eggs].sort((a, b) => new Date(a.layDate) - new Date(b.layDate));
      const lastEgg = sorted[sorted.length - 1];
      const lastLayTime = new Date(lastEgg.layDate).getTime();
      const nextLayTargetMs = lastLayTime + (EGG_INTERVAL_HOURS * MS_PER_HOUR);
      const msRemaining = nextLayTargetMs - Date.now();
      const timerEl = document.getElementById('next-egg-timer');
      if (timerEl) {
        if (msRemaining > 0) {
          timerEl.textContent = `Faltan ~${this.formatDuration(msRemaining)}`;
        } else {
          timerEl.textContent = `¡Ventana de puesta abierta! (hace ${this.formatDuration(Math.abs(msRemaining))})`;
        }
      }
    }
  }

  // =========================================================================
  // Gestión y Seguimiento de Pollos (Día 0 a Día 30)
  // =========================================================================

  setupChickVisualizer() {
    if (typeof ChickVisualizer !== 'undefined') {
      const container = document.getElementById('chick-visualizer-container');
      if (container && !window.chickVis) {
        window.chickVis = new ChickVisualizer('chick-visualizer-container');
        this.syncChicksWithVisualizer();
      }
    }
  }

  syncChicksWithVisualizer() {
    if (!window.chickVis) return;
    const allWeights = [];
    this.chicks.forEach(c => {
      if (Array.isArray(c.weightLogs)) {
        c.weightLogs.forEach(w => {
          const ms = new Date(w.date).getTime() - new Date(c.hatchDate).getTime();
          const day = Math.max(0, Math.floor(ms / MS_PER_DAY));
          allWeights.push({ day, weight: w.weight, chickName: c.name });
        });
      }
    });
    window.chickVis.setRecordedWeights(allWeights);
  }

  setChicksTab(tab) {
    this.chicksTab = tab;
    this.renderChicksView();
  }

  renderChicksView() {
    const listTabBtn = document.getElementById('btn-chicks-tab-list');
    const diagTabBtn = document.getElementById('btn-chicks-tab-diag');
    const guidesTabBtn = document.getElementById('btn-chicks-tab-guides');

    const listSec = document.getElementById('chicks-sec-list');
    const diagSec = document.getElementById('chicks-sec-diag');
    const guidesSec = document.getElementById('chicks-sec-guides');

    if (listTabBtn) listTabBtn.className = `px-3 sm:px-4 py-2 rounded-xl text-xs font-label-caps font-bold transition-all ${this.chicksTab === 'list' ? 'bg-accent text-white shadow-sm' : 'text-muted hover:text-main'}`;
    if (diagTabBtn) diagTabBtn.className = `px-3 sm:px-4 py-2 rounded-xl text-xs font-label-caps font-bold transition-all ${this.chicksTab === 'diagram' ? 'bg-accent text-white shadow-sm' : 'text-muted hover:text-main'}`;
    if (guidesTabBtn) guidesTabBtn.className = `px-3 sm:px-4 py-2 rounded-xl text-xs font-label-caps font-bold transition-all ${this.chicksTab === 'guides' ? 'bg-accent text-white shadow-sm' : 'text-muted hover:text-main'}`;

    if (listSec) listSec.style.display = this.chicksTab === 'list' ? 'flex' : 'none';
    if (diagSec) diagSec.style.display = this.chicksTab === 'diagram' ? 'flex' : 'none';
    if (guidesSec) guidesSec.style.display = this.chicksTab === 'guides' ? 'flex' : 'none';

    // 1. Renderizar lista de pollos nacidos
    const listContainer = document.getElementById('chicks-list-grid');
    if (listContainer) {
      if (this.chicks.length === 0) {
        listContainer.innerHTML = `
          <div class="col-span-full glass-card p-8 flex flex-col items-center justify-center text-center gap-3">
            <span class="text-5xl leading-none">🐣</span>
            <h3 class="font-display font-bold text-base text-main">Aún no hay pollitos nacidos registrados</h3>
            <p class="text-xs text-muted max-w-md">
              Cuando los huevos completen los 21 días de incubación y eclosionen, pulsa el botón <strong>"¡Eclosionó!"</strong> en la tarjeta del huevo correspondiente para iniciar su seguimiento de peso, anillado y plumaje hasta el mes de vida.
            </p>
            <div class="flex flex-wrap gap-2 mt-2">
              <button onclick="app.setChicksTab('diagram')" class="btn-primary py-2 px-4 rounded-xl text-xs font-label-caps flex items-center gap-1.5 shadow-sm">
                <span class="material-symbols-outlined text-[16px]">biotech</span>
                <span>EXPLORAR ESQUEMA DÍA 0 A 30</span>
              </button>
              <button onclick="app.setChicksTab('guides')" class="btn-secondary py-2 px-4 rounded-xl text-xs font-label-caps flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">menu_book</span>
                <span>VER GUÍA DE CRIANZA</span>
              </button>
            </div>
          </div>
        `;
      } else {
        listContainer.innerHTML = this.chicks.map(chick => this.renderChickCard(chick)).join('');
      }
    }

    // 2. Si estamos en tab de esquema, asegurar sincronización y render
    if (this.chicksTab === 'diagram') {
      if (!window.chickVis) {
        this.setupChickVisualizer();
      }
      if (window.chickVis) {
        this.syncChicksWithVisualizer();
        window.chickVis.render();
      }
    }

    // 3. Renderizar guías críticas de crianza
    const guidesContainer = document.getElementById('chicks-guides-content');
    if (guidesContainer && guidesContainer.children.length === 0) {
      this.renderChicksGuides();
    }
  }

  renderChickCard(chick) {
    const m = this.getChickMetrics(chick);
    const day = m.currentDay;
    const stage = (typeof CHICK_STAGES !== 'undefined' && CHICK_STAGES[day]) ? CHICK_STAGES[day] : null;
    const expectedAvg = stage ? stage.weightAvg : 50;
    const expectedMin = stage ? stage.weightMin : 40;
    const expectedMax = stage ? stage.weightMax : 60;

    const latestWeight = m.latestWeight;
    const isWeightNormal = latestWeight >= expectedMin && latestWeight <= expectedMax;
    const isWeightLow = latestWeight < expectedMin;
    const weightStatusClass = isWeightNormal 
      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
      : (isWeightLow ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-blue-500/15 text-blue-400 border-blue-500/30');
    const weightStatusLabel = isWeightNormal ? 'PESO SALUDABLE' : (isWeightLow ? 'BAJO PESO' : 'SOBRE EL PROMEDIO');

    const ringStatus = chick.ringNumber ? `Anilla: ${this.escapeHtml(chick.ringNumber)}` : (day >= 6 && day <= 8 ? '¡PERIODO DE ANILLADO (4.5mm)!' : (day < 6 ? 'Anillado ideal: Días 6 a 8' : 'Sin anillar'));
    const ringBadgeClass = chick.ringNumber ? 'bg-sky-500/15 text-sky-400 border-sky-500/30' : (day >= 6 && day <= 8 ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse' : 'bg-slate-500/15 text-slate-400 border-slate-500/30');

    // Progreso del mes (0 a 30 días)
    const monthProgressPct = Math.min(100, Math.max(0, (day / 30) * 100));

    // Formatear pesajes recientes
    const logs = Array.isArray(chick.weightLogs) ? [...chick.weightLogs].reverse() : [];

    return `
      <div class="glass-card p-4 sm:p-5 flex flex-col gap-4 border-theme hover:border-accent/40 transition-all relative" id="card-chick-${chick.id}">
        
        <!-- Encabezado de la Tarjeta del Pollo -->
        <div class="flex items-start justify-between gap-2.5">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0 shadow-sm">
              🐥
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-display font-bold text-base sm:text-lg text-main truncate">${this.escapeHtml(chick.name)}</h3>
                <span class="px-2 py-0.5 rounded text-[10px] font-label-caps font-bold bg-accent/20 text-accent border border-accent/30 shrink-0">
                  HUEVO #${chick.eggNumber || 1}
                </span>
              </div>
              <p class="text-xs text-muted font-label-caps mt-0.5">
                Nació: ${this.formatDate(new Date(chick.hatchDate))} • Mutación: ${this.escapeHtml(chick.mutation || 'Perlado')}
              </p>
            </div>
          </div>

          <div class="flex flex-col items-end gap-1 shrink-0">
            <span class="px-2.5 py-1 rounded-md text-[10px] font-label-caps font-bold border ${ringBadgeClass}">
              ${ringStatus}
            </span>
          </div>
        </div>

        <!-- Indicador de Edad en Vivo y Barra de Desarrollo de 30 Días -->
        <div class="p-3 rounded-xl bg-input/40 border border-theme flex flex-col gap-2">
          <div class="flex items-center justify-between text-xs font-label-caps">
            <span class="text-muted flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px] text-accent">schedule</span>
              <span>Edad actual:</span>
              <strong class="font-data text-main text-xs sm:text-sm ml-1" data-chick-age-for="${chick.id}">
                ${m.ageDays} días, ${m.ageHours} horas
              </strong>
            </span>
            <span class="font-data font-bold text-accent">DÍA ${day} DE 30 (${monthProgressPct.toFixed(0)}%)</span>
          </div>
          <div class="w-full h-2.5 rounded-full bg-black/40 border border-theme overflow-hidden p-0.5">
            <div class="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 transition-all duration-500" style="width: ${monthProgressPct}%;"></div>
          </div>
        </div>

        <!-- Requisitos Biológicos & Cuidados del Día Actual -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-label-caps">
          <div class="p-2.5 rounded-xl bg-input/30 border border-theme flex flex-col gap-1">
            <span class="text-muted flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px] text-red-400">thermostat</span>
              <span>Temperatura Nido</span>
            </span>
            <span class="font-data font-bold text-main text-xs sm:text-sm">${stage ? stage.temperature : '28°C'}</span>
          </div>

          <div class="p-2.5 rounded-xl bg-input/30 border border-theme flex flex-col gap-1">
            <span class="text-muted flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px] text-amber-400">restaurant</span>
              <span>Alimentación</span>
            </span>
            <span class="font-data font-bold text-main text-xs sm:text-sm">${stage ? stage.feedingFrequency : '3 tomas/día'}</span>
          </div>

          <div class="p-2.5 rounded-xl bg-input/30 border border-theme flex flex-col gap-1">
            <span class="text-muted flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px] text-sky-400">scale</span>
              <span>Peso Actual / Esperado</span>
            </span>
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="font-data font-bold text-accent text-xs sm:text-sm">${latestWeight.toFixed(1)}g</span>
              <span class="text-[10px] text-muted">(Esperado: ${expectedAvg}g)</span>
            </div>
          </div>
        </div>

        <!-- Fase Morfológica Actual -->
        <div class="p-3 rounded-xl bg-accent/10 border border-accent/20 flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <span class="font-label-caps text-xs font-bold text-accent">${stage ? stage.stage : 'Desarrollo'}</span>
            <span class="px-2 py-0.5 rounded text-[9px] font-label-caps font-bold border ${weightStatusClass}">${weightStatusLabel}</span>
          </div>
          <p class="text-xs text-main leading-relaxed font-body">${stage ? stage.summary : 'Crecimiento activo del pollo.'}</p>
        </div>

        <!-- Registro de Pesajes Recientes -->
        <div class="flex flex-col gap-1.5 border-t border-theme pt-3">
          <div class="flex items-center justify-between">
            <span class="font-label-caps text-[11px] text-muted font-bold tracking-wider">HISTORIAL DE PESO (${logs.length} registros)</span>
            ${this.isAdmin ? `
              <button onclick="app.openAddWeightModal('${chick.id}')" class="text-accent hover:underline text-[11px] font-label-caps font-bold flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">add</span>
                <span>REGISTRAR PESO</span>
              </button>
            ` : ''}
          </div>
          <div class="flex gap-2 overflow-x-auto custom-scrollbar py-1">
            ${logs.slice(0, 6).map(log => `
              <div class="p-2 rounded-lg bg-input/50 border border-theme shrink-0 flex flex-col items-center min-w-[75px] text-center">
                <span class="font-data font-bold text-xs text-main">${Number(log.weight).toFixed(1)}g</span>
                <span class="text-[9px] text-muted font-label-caps mt-0.5">${new Date(log.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Acciones de la Tarjeta del Pollo -->
        <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-theme">
          <button class="btn-primary flex-1 py-2 px-3 rounded-xl text-xs font-label-caps flex items-center justify-center gap-1.5 shadow-sm" onclick="app.focusChickVisualizer('${chick.id}')">
            <span class="material-symbols-outlined text-[16px]">biotech</span>
            <span>VER EN ESQUEMA DÍA ${day}</span>
          </button>

          ${this.isAdmin ? `
            <button class="btn-secondary py-2 px-3 rounded-xl text-xs font-label-caps text-accent border-accent/30 hover:bg-accent/10 flex items-center gap-1" onclick="app.openAddWeightModal('${chick.id}')" title="Añadir pesaje de hoy">
              <span class="material-symbols-outlined text-[16px]">scale</span>
              <span class="hidden sm:inline">PESAR</span>
            </button>
            <button class="btn-secondary py-2 px-2.5 rounded-xl text-xs font-label-caps" onclick="app.openEditChickModal('${chick.id}')" title="Editar datos del pollo">
              <span class="material-symbols-outlined text-[16px]">edit</span>
            </button>
            <button class="btn-secondary py-2 px-2.5 rounded-xl text-xs font-label-caps text-red-400 hover:bg-red-500/10" onclick="app.deleteChick('${chick.id}')" title="Eliminar ficha de pollo">
              <span class="material-symbols-outlined text-[16px]">delete</span>
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }

  renderChicksGuides() {
    const container = document.getElementById('chicks-guides-content');
    if (!container) return;

    if (typeof CHICK_CARE_GUIDES === 'undefined' || !Array.isArray(CHICK_CARE_GUIDES)) {
      container.innerHTML = '<p class="text-xs text-muted">Guías no disponibles.</p>';
      return;
    }

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        ${CHICK_CARE_GUIDES.map(guide => `
          <div class="glass-card p-4 sm:p-5 flex flex-col gap-3 border-theme hover:border-accent/40 transition-all">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent text-xl shrink-0">
                <span class="material-symbols-outlined text-[22px]">${guide.icon || 'info'}</span>
              </div>
              <div>
                <h4 class="font-display font-bold text-sm sm:text-base text-main leading-snug">${this.escapeHtml(guide.title)}</h4>
                <p class="text-[11px] text-accent font-label-caps mt-0.5">${this.escapeHtml(guide.window || 'Periodo crítico')}</p>
              </div>
            </div>
            <p class="text-xs text-muted leading-relaxed font-body">${this.escapeHtml(guide.description)}</p>
            
            <div class="p-3 rounded-xl bg-input/40 border border-theme flex flex-col gap-1 text-xs">
              <span class="font-label-caps font-bold text-main text-[11px] flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px] text-emerald-400">check_circle</span>
                <span>PUNTOS CLAVE Y PROCEDIMIENTO</span>
              </span>
              <ul class="list-disc list-inside text-muted space-y-1 text-xs mt-1">
                ${guide.steps.map(s => `<li>${this.escapeHtml(s)}</li>`).join('')}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  getChickMetrics(chick) {
    const hatchTime = new Date(chick.hatchDate).getTime();
    const now = Date.now();
    const elapsedMs = Math.max(0, now - hatchTime);

    const ageDays = Math.floor(elapsedMs / MS_PER_DAY);
    const ageHours = Math.floor((elapsedMs % MS_PER_DAY) / MS_PER_HOUR);
    const currentDay = Math.min(30, ageDays);

    let latestWeight = chick.initialWeight || 4.5;
    if (Array.isArray(chick.weightLogs) && chick.weightLogs.length > 0) {
      latestWeight = chick.weightLogs[chick.weightLogs.length - 1].weight;
    }

    return {
      elapsedMs,
      ageDays,
      ageHours,
      currentDay,
      latestWeight
    };
  }

  focusChick(eggIdOrChickId) {
    let chick = this.chicks.find(c => c.id === eggIdOrChickId || c.eggId === eggIdOrChickId);
    if (!chick) {
      // Si el huevo está marcado como hatched pero no hay chick aún, sincronizar
      this.syncHatchedEggsWithChicks();
      chick = this.chicks.find(c => c.id === eggIdOrChickId || c.eggId === eggIdOrChickId);
    }

    if (typeof showView === 'function') {
      showView('chicks');
    }
    this.setChicksTab('list');

    if (chick) {
      setTimeout(() => {
        const el = document.getElementById(`card-chick-${chick.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('border-accent');
          setTimeout(() => el.classList.remove('border-accent'), 2500);
        }
      }, 200);
    }
  }

  focusChickVisualizer(chickId) {
    const chick = this.chicks.find(c => c.id === chickId);
    if (!chick) return;

    const m = this.getChickMetrics(chick);
    if (typeof showView === 'function') {
      showView('chicks');
    }
    this.setChicksTab('diagram');

    if (window.chickVis) {
      window.chickVis.setDay(m.currentDay);
    }
  }

  // =========================================================================
  // Modales de Eclosión, Pesaje y Edición de Pollos
  // =========================================================================

  openHatchModal(eggId) {
    if (!this.isAdmin) {
      this.openAdminLoginModal();
      return;
    }
    const egg = this.eggs.find(e => e.id === eggId);
    if (!egg) return;
    this.activeEggForHatch = egg;

    const titleEl = document.getElementById('hatch-modal-egg-title');
    if (titleEl) titleEl.textContent = `Registrar Nacimiento: ${egg.name}`;

    const dateInput = document.getElementById('form-hatch-date');
    if (dateInput) {
      const now = new Date();
      dateInput.value = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    }

    const weightInput = document.getElementById('form-hatch-weight');
    if (weightInput) weightInput.value = '4.5';

    const ringInput = document.getElementById('form-hatch-ring');
    if (ringInput) ringInput.value = '';

    const nameInput = document.getElementById('form-hatch-name');
    if (nameInput) nameInput.value = `Pollo #${egg.number} de Impa`;

    const mutationInput = document.getElementById('form-hatch-mutation');
    if (mutationInput) mutationInput.value = 'Perlado (Hijo/a de Impa)';

    const notesInput = document.getElementById('form-hatch-notes');
    if (notesInput) notesInput.value = 'Eclosión natural sin asistencia. Buen vigor y buche limpio.';

    this.openModal('modal-hatch-egg');
  }

  confirmHatchEgg() {
    if (!this.isAdmin || !this.activeEggForHatch) return;
    const egg = this.activeEggForHatch;

    const dateVal = document.getElementById('form-hatch-date')?.value;
    const weightVal = parseFloat(document.getElementById('form-hatch-weight')?.value) || 4.5;
    const nameVal = document.getElementById('form-hatch-name')?.value?.trim() || `Pollo #${egg.number} de Impa`;
    const ringVal = document.getElementById('form-hatch-ring')?.value?.trim() || '';
    const mutationVal = document.getElementById('form-hatch-mutation')?.value?.trim() || 'Perlado (Hijo/a de Impa)';
    const notesVal = document.getElementById('form-hatch-notes')?.value?.trim() || '';

    const hatchDate = dateVal ? new Date(dateVal).toISOString() : new Date().toISOString();

    // Actualizar estado del huevo
    egg.status = 'hatched';
    egg.hatchDate = hatchDate;

    // Crear o actualizar ficha del pollo
    let chick = this.chicks.find(c => c.eggId === egg.id || c.eggNumber === egg.number);
    if (!chick) {
      chick = {
        id: 'chick_' + egg.id,
        eggId: egg.id,
        eggNumber: egg.number,
        name: nameVal,
        hatchDate: hatchDate,
        ringNumber: ringVal,
        mutation: mutationVal,
        initialWeight: weightVal,
        weightLogs: [
          { date: hatchDate, weight: weightVal, note: 'Peso al nacer (Eclosión)' }
        ],
        milestonesDone: ['hatched'],
        notes: notesVal
      };
      this.chicks.push(chick);
    } else {
      chick.name = nameVal;
      chick.hatchDate = hatchDate;
      chick.ringNumber = ringVal;
      chick.mutation = mutationVal;
      chick.initialWeight = weightVal;
      if (!chick.weightLogs || chick.weightLogs.length === 0) {
        chick.weightLogs = [{ date: hatchDate, weight: weightVal, note: 'Peso al nacer' }];
      }
    }

    this.saveData();
    this.closeModal('modal-hatch-egg');
    this.render();
    this.showToast(`¡Felicidades! Eclosionó el ${egg.name}. Se ha creado su ficha en la pestaña POLLOS.`, 'celebration');
  }

  openAddWeightModal(chickId) {
    if (!this.isAdmin) {
      this.openAdminLoginModal();
      return;
    }
    const chick = this.chicks.find(c => c.id === chickId);
    if (!chick) return;
    this.activeChickForWeight = chick;

    const m = this.getChickMetrics(chick);
    const day = m.currentDay;
    const stage = typeof CHICK_STAGES !== 'undefined' ? CHICK_STAGES[day] : null;

    const titleEl = document.getElementById('add-weight-modal-title');
    if (titleEl) titleEl.textContent = `Registrar Peso: ${chick.name} (Día ${day})`;

    const refEl = document.getElementById('add-weight-expected-ref');
    if (refEl && stage) {
      refEl.textContent = `Rango saludable Día ${day}: ${stage.weightMin}g - ${stage.weightMax}g (Promedio: ${stage.weightAvg}g)`;
    }

    const dateInput = document.getElementById('form-chick-weight-date');
    if (dateInput) {
      const now = new Date();
      dateInput.value = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    }

    const weightInput = document.getElementById('form-chick-weight-val');
    if (weightInput) {
      weightInput.value = m.latestWeight ? m.latestWeight.toFixed(1) : (stage ? stage.weightAvg : '15');
      setTimeout(() => weightInput.focus(), 150);
    }

    const notesInput = document.getElementById('form-chick-weight-notes');
    if (notesInput) notesInput.value = 'Pesaje con buche vacío';

    this.openModal('modal-add-weight');
  }

  saveChickWeight() {
    if (!this.isAdmin || !this.activeChickForWeight) return;
    const chick = this.activeChickForWeight;

    const dateVal = document.getElementById('form-chick-weight-date')?.value;
    const weightVal = parseFloat(document.getElementById('form-chick-weight-val')?.value);
    const noteVal = document.getElementById('form-chick-weight-notes')?.value?.trim() || '';

    if (!weightVal || isNaN(weightVal) || weightVal <= 0) {
      alert('Por favor introduce un peso válido en gramos.');
      return;
    }

    const logEntry = {
      date: dateVal ? new Date(dateVal).toISOString() : new Date().toISOString(),
      weight: Math.round(weightVal * 10) / 10,
      note: noteVal
    };

    if (!Array.isArray(chick.weightLogs)) chick.weightLogs = [];
    chick.weightLogs.push(logEntry);
    chick.weightLogs.sort((a, b) => new Date(a.date) - new Date(b.date));

    this.saveData();
    this.closeModal('modal-add-weight');
    this.syncChicksWithVisualizer();
    this.renderChicksView();
    this.showToast(`Pesaje registrado: ${weightVal}g para ${chick.name}`, 'scale');
  }

  openEditChickModal(chickId) {
    if (!this.isAdmin) {
      this.openAdminLoginModal();
      return;
    }
    const chick = this.chicks.find(c => c.id === chickId);
    if (!chick) return;
    this.activeChickForEdit = chick;

    const titleEl = document.getElementById('edit-chick-modal-title');
    if (titleEl) titleEl.textContent = `Editar Ficha: ${chick.name}`;

    const nameInput = document.getElementById('form-edit-chick-name');
    if (nameInput) nameInput.value = chick.name || '';

    const ringInput = document.getElementById('form-edit-chick-ring');
    if (ringInput) ringInput.value = chick.ringNumber || '';

    const mutationInput = document.getElementById('form-edit-chick-mutation');
    if (mutationInput) mutationInput.value = chick.mutation || 'Perlado';

    const notesInput = document.getElementById('form-edit-chick-notes');
    if (notesInput) notesInput.value = chick.notes || '';

    this.openModal('modal-edit-chick');
  }

  saveEditChick() {
    if (!this.isAdmin || !this.activeChickForEdit) return;
    const chick = this.activeChickForEdit;

    const nameVal = document.getElementById('form-edit-chick-name')?.value?.trim();
    const ringVal = document.getElementById('form-edit-chick-ring')?.value?.trim();
    const mutationVal = document.getElementById('form-edit-chick-mutation')?.value?.trim();
    const notesVal = document.getElementById('form-edit-chick-notes')?.value?.trim();

    if (nameVal) chick.name = nameVal;
    chick.ringNumber = ringVal || '';
    chick.mutation = mutationVal || 'Perlado';
    chick.notes = notesVal || '';

    this.saveData();
    this.closeModal('modal-edit-chick');
    this.renderChicksView();
    this.showToast(`Ficha de ${chick.name} actualizada con éxito.`);
  }

  deleteChick(chickId) {
    if (!this.isAdmin) return;
    const chick = this.chicks.find(c => c.id === chickId);
    if (!chick) return;

    if (confirm(`¿Estás seguro de eliminar el seguimiento de ${chick.name}?`)) {
      this.chicks = this.chicks.filter(c => c.id !== chickId);
      this.saveData();
      this.renderChicksView();
      this.showToast(`Ficha de ${chick.name} eliminada.`, 'delete');
    }
  }

  // =========================================================================
  // Integración con el Visor de Embrión
  // =========================================================================

  openVisualizerForEgg(eggId) {
    const egg = this.eggs.find(e => e.id === eggId);
    if (!egg) return;

    this.activeEggForVisualizer = egg;
    const m = this.getEggMetrics(egg);
    const day = m.currentDay;

    const modalTitle = document.getElementById('dev-modal-title');
    if (modalTitle) {
      modalTitle.textContent = `Desarrollo: ${egg.name} (Día ${day})`;
    }

    if (typeof showView === 'function') {
      showView('embryo');
    }

    const slider = document.getElementById('dev-day-slider');
    if (slider) slider.value = day;

    this.setVisualizerDay(day);
  }

  setVisualizerDay(day) {
    const dayLabel = document.getElementById('slider-day-val');
    if (dayLabel) {
      dayLabel.textContent = `DÍA ${day}`;
    }

    if (this.visualizer) {
      this.visualizer.setDay(day);
    }

    this.updateVisualizerBio(day);
  }

  updateVisualizerBio(day) {
    const stage = (typeof EMBRYO_STAGES !== 'undefined' && EMBRYO_STAGES[day]) ? EMBRYO_STAGES[day] : {
      title: "Desarrollo de Ninfa",
      shortDesc: "Etapa de incubación",
      detailedDesc: "Evolución embrionaria de Nymphicus hollandicus.",
      candlingDesc: "Observación al trasluz.",
      chickAnatomy: "Anatomía en desarrollo.",
      airCell: "4 mm",
      temperatureTip: "Mantener parámetros de incubación estables."
    };
    const container = document.getElementById('stage-bio-details');
    if (!container) return;

    container.innerHTML = `
      <div class="glass-card p-4 flex flex-col gap-3">
        <div>
          <span class="font-label-caps text-[10px] text-accent tracking-widest uppercase font-bold">ETAPA BIOLÓGICA • DÍA ${day}</span>
          <h3 class="font-display font-bold text-lg text-main leading-snug">${stage.title}</h3>
          <p class="text-xs text-accent font-medium mt-0.5">${stage.shortDesc}</p>
        </div>

        <div class="bg-input/40 p-3 rounded-xl border border-theme flex flex-col gap-1">
          <div class="flex items-center gap-1.5 text-accent font-label-caps text-[11px] font-bold">
            <span class="material-symbols-outlined text-[16px]">flashlight_on</span>
            <span>¿QUÉ SE OBSERVA EN OVOSCOPIA?</span>
          </div>
          <p class="text-xs text-main leading-relaxed">${stage.candlingDesc}</p>
        </div>

        <div class="bg-input/40 p-3 rounded-xl border border-theme flex flex-col gap-1">
          <div class="flex items-center gap-1.5 text-sky-400 font-label-caps text-[11px] font-bold">
            <span class="material-symbols-outlined text-[16px]">biotech</span>
            <span>ANATOMÍA DEL POLLUELO</span>
          </div>
          <p class="text-xs text-main leading-relaxed">${stage.chickAnatomy}</p>
          <div class="mt-1 text-[11px] font-label-caps text-muted">
            <span class="text-accent font-bold">Cámara de aire:</span> ${stage.airCell}
          </div>
        </div>

        <div class="bg-accent/10 p-3 rounded-xl border border-accent/20 flex flex-col gap-1">
          <div class="flex items-center gap-1.5 text-accent font-label-caps text-[11px] font-bold">
            <span class="material-symbols-outlined text-[16px]">lightbulb</span>
            <span>MANEJO Y NIDO</span>
          </div>
          <p class="text-xs text-main leading-relaxed">${stage.temperatureTip}</p>
        </div>

        <p class="text-[11px] text-muted leading-normal px-1 font-body">
          ${stage.detailedDesc}
        </p>
      </div>
    `;
  }

  // =========================================================================
  // Formularios de Huevos (Solo Administrador)
  // =========================================================================

  openAddEggModal() {
    if (!this.isAdmin) {
      this.openAdminLoginModal();
      return;
    }

    this.activeEggForEdit = null;
    const modalTitle = document.getElementById('egg-form-modal-title');
    if (modalTitle) modalTitle.textContent = `Registrar Nuevo Huevo`;

    const nextNumber = this.eggs.length + 1;
    document.getElementById('form-egg-name').value = `Huevo #${nextNumber} de Impa`;
    
    this.setFormDateTime(new Date());
    document.getElementById('form-egg-status').value = 'pending';
    document.getElementById('form-egg-notes').value = '';

    this.openModal('egg-form-modal');
  }

  openEditEggModal(eggId) {
    if (!this.isAdmin) {
      this.openAdminLoginModal();
      return;
    }

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

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const mins = String(dateObj.getMinutes()).padStart(2, '0');
    input.value = `${year}-${month}-${day}T${hours}:${mins}`;
  }

  handleEggFormSubmit() {
    if (!this.isAdmin) return;

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
      this.activeEggForEdit.name = name;
      this.activeEggForEdit.layDate = layDate;
      this.activeEggForEdit.status = status;
      this.activeEggForEdit.notes = notes;
      this.showToast(`Registro de ${name} actualizado.`);
    } else {
      const newEgg = {
        id: 'egg_' + Date.now(),
        number: this.eggs.length + 1,
        name,
        layDate,
        status,
        notes
      };
      this.eggs.push(newEgg);
      this.showToast(`¡${name} registrado con éxito!`);
    }

    this.saveData();
    this.render();
    this.closeModal('egg-form-modal');
  }

  openChangeStatusModal(eggId) {
    if (!this.isAdmin) return;

    const egg = this.eggs.find(e => e.id === eggId);
    if (!egg) return;

    const newStatus = prompt(
      `Cambiar estado para ${egg.name}:\n\n` +
      `1: Pendiente de ovoscopia (pending)\n` +
      `2: Fértil confirmado (fertile)\n` +
      `3: No fértil / Claro (infertile)\n` +
      `4: Detenido / Malogrado (failed)\n` +
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
      this.showToast(`Estado de ${egg.name} actualizado a: ${egg.status}`);
    }
  }

  deleteEgg(eggId) {
    if (!this.isAdmin) return;

    const egg = this.eggs.find(e => e.id === eggId);
    if (!egg) return;
    if (confirm(`¿Estás seguro de eliminar el registro de ${egg.name}?`)) {
      this.eggs = this.eggs.filter(e => e.id !== eggId);
      this.saveData();
      this.render();
      this.showToast(`Registro de ${egg.name} eliminado.`, 'delete');
    }
  }

  // =========================================================================
  // Exportación de Calendario iCal (.ics) para Visitantes y Dueño
  // =========================================================================

  formatIcsDate(d) {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  downloadIcsForEgg(eggId) {
    const egg = this.eggs.find(e => e.id === eggId);
    if (!egg) return;

    const m = this.getEggMetrics(egg);
    const candlingStart = this.formatIcsDate(m.candlingDate);
    const candlingEnd = this.formatIcsDate(new Date(m.candlingDate.getTime() + MS_PER_HOUR));

    const pipStart = this.formatIcsDate(m.pipDate);
    const pipEnd = this.formatIcsDate(new Date(m.pipDate.getTime() + MS_PER_HOUR));

    const hatchStart = this.formatIcsDate(m.hatchDate);
    const hatchEnd = this.formatIcsDate(new Date(m.hatchDate.getTime() + MS_PER_HOUR));

    const nowIcs = this.formatIcsDate(new Date());

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Nido de Impa//Nymphicus hollandicus Tracker//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      
      // Evento 1: Ovoscopia Día 5
      'BEGIN:VEVENT',
      `UID:candling-${egg.id}@impa-tracker`,
      `DTSTAMP:${nowIcs}`,
      `DTSTART:${candlingStart}`,
      `DTEND:${candlingEnd}`,
      `SUMMARY:🔦 Miraje / Ovoscopia: ${egg.name} (Ninfa Impa)`,
      `DESCRIPTION:Día 5 de incubación de Nymphicus hollandicus. Revisar en habitación oscura con linterna LED si se aprecian vasos sanguíneos y latido cardíaco.`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT2H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Recordatorio ovoscopia',
      'END:VALARM',
      'END:VEVENT',

      // Evento 2: Picaje interno Día 18
      'BEGIN:VEVENT',
      `UID:pip-${egg.id}@impa-tracker`,
      `DTSTAMP:${nowIcs}`,
      `DTSTART:${pipStart}`,
      `DTEND:${pipEnd}`,
      `SUMMARY:💧 Subir Humedad nido (Día 18): ${egg.name}`,
      `DESCRIPTION:Día 18. El pichón de ninfa inicia el picaje interno de la cámara de aire. Elevar la humedad del nido al 65%-75% para ablandar la cáscara.`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT4H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Recordatorio humedad nido',
      'END:VALARM',
      'END:VEVENT',

      // Evento 3: Eclosión Día 21
      'BEGIN:VEVENT',
      `UID:hatch-${egg.id}@impa-tracker`,
      `DTSTAMP:${nowIcs}`,
      `DTSTART:${hatchStart}`,
      `DTEND:${hatchEnd}`,
      `SUMMARY:🐣 ¡Día de Eclosión! Nacimiento: ${egg.name}`,
      `DESCRIPTION:Día 21 de incubación. Nacimiento estimado del pichón de Impa. Preparar alimento fresco para los padres (pasta de cría, mixtura y agua limpia).`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT2H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Recordatorio eclosión',
      'END:VALARM',
      'END:VEVENT',

      'END:VCALENDAR'
    ].join('\r\n');

    this.triggerFileDownload(icsContent, `Recordatorio_Incubacion_${egg.name.replace(/\s+/g, '_')}.ics`, 'text/calendar;charset=utf-8;');
    this.showToast(`Recordatorios para ${egg.name} descargados.`, 'calendar_month');
  }

  downloadAllEggsIcs() {
    if (this.eggs.length === 0) {
      alert('No hay huevos registrados para generar recordatorios.');
      return;
    }

    const nowIcs = this.formatIcsDate(new Date());
    const events = [];

    this.eggs.forEach(egg => {
      const m = this.getEggMetrics(egg);
      const candlingStart = this.formatIcsDate(m.candlingDate);
      const candlingEnd = this.formatIcsDate(new Date(m.candlingDate.getTime() + MS_PER_HOUR));

      const pipStart = this.formatIcsDate(m.pipDate);
      const pipEnd = this.formatIcsDate(new Date(m.pipDate.getTime() + MS_PER_HOUR));

      const hatchStart = this.formatIcsDate(m.hatchDate);
      const hatchEnd = this.formatIcsDate(new Date(m.hatchDate.getTime() + MS_PER_HOUR));

      events.push(
        'BEGIN:VEVENT',
        `UID:candling-${egg.id}@impa-tracker`,
        `DTSTAMP:${nowIcs}`,
        `DTSTART:${candlingStart}`,
        `DTEND:${candlingEnd}`,
        `SUMMARY:🔦 Miraje / Ovoscopia: ${egg.name} (Ninfa Impa)`,
        `DESCRIPTION:Día 5 de incubación. Confirmar fertilidad al trasluz con linterna LED.`,
        'STATUS:CONFIRMED',
        'END:VEVENT',

        'BEGIN:VEVENT',
        `UID:pip-${egg.id}@impa-tracker`,
        `DTSTAMP:${nowIcs}`,
        `DTSTART:${pipStart}`,
        `DTEND:${pipEnd}`,
        `SUMMARY:💧 Subir Humedad (Día 18): ${egg.name}`,
        `DESCRIPTION:Día 18. Picaje interno del pichón de Impa. Elevar humedad al 65%-75%.`,
        'STATUS:CONFIRMED',
        'END:VEVENT',

        'BEGIN:VEVENT',
        `UID:hatch-${egg.id}@impa-tracker`,
        `DTSTAMP:${nowIcs}`,
        `DTSTART:${hatchStart}`,
        `DTEND:${hatchEnd}`,
        `SUMMARY:🐣 ¡Eclosión estimada!: ${egg.name}`,
        `DESCRIPTION:Día 21. Nacimiento del pichón de Ninfa Carolina de Impa.`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      );
    });

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Nido de Impa//Nidada Completa//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      ...events,
      'END:VCALENDAR'
    ].join('\r\n');

    this.triggerFileDownload(icsContent, `Recordatorios_Nidada_Impa_Completa.ics`, 'text/calendar;charset=utf-8;');
    this.showToast('¡Todos los recordatorios de la nidada descargados!', 'calendar_month');
  }

  // =========================================================================
  // Publicación Canónica y Respaldos (nest.json)
  // =========================================================================

  openPublishModal() {
    if (!this.isAdmin) return;
    const countEl = document.getElementById('publish-eggs-count');
    if (countEl) countEl.textContent = this.eggs.length;
    this.openModal('modal-publish-nest');
  }

  getCanonicalNestJsonString() {
    const payload = {
      updatedAt: new Date().toISOString(),
      species: "Nymphicus hollandicus",
      mother: "Impa",
      adminPinHash: this.activePinHash || this.DEFAULT_PIN_HASH,
      clutchCompleted: this.clutchCompleted,
      eggs: this.eggs,
      chicks: this.chicks
    };
    return JSON.stringify(payload, null, 2);
  }

  downloadCanonicalNestJson() {
    const jsonStr = this.getCanonicalNestJsonString();
    this.triggerFileDownload(jsonStr, 'nest.json', 'application/json');
    this.showToast('Archivo data/nest.json descargado con éxito.', 'cloud_download');
  }

  copyNestJsonToClipboard() {
    const jsonStr = this.getCanonicalNestJsonString();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(jsonStr).then(() => {
        const lbl = document.getElementById('btn-copy-nest-label');
        if (lbl) lbl.textContent = '¡COPIADO AL PORTAPAPELES!';
        setTimeout(() => {
          if (lbl) lbl.textContent = 'COPIAR JSON';
        }, 2500);
        this.showToast('Contenido JSON copiado al portapapeles.', 'content_copy');
      });
    } else {
      prompt('Copia el contenido JSON:', jsonStr);
    }
  }

  exportBackup() {
    const backupData = {
      version: '1.2.0',
      exportedAt: new Date().toISOString(),
      clutchCompleted: this.clutchCompleted,
      eggs: this.eggs,
      chicks: this.chicks
    };
    const dataStr = JSON.stringify(backupData, null, 2);
    this.triggerFileDownload(dataStr, `Respaldo_Nidada_Pollos_Impa_${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
    this.showToast('Copia de respaldo JSON exportada.');
  }

  importBackup(event) {
    if (!this.isAdmin) return;

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        const eggsList = Array.isArray(imported) ? imported : (imported.eggs && Array.isArray(imported.eggs) ? imported.eggs : null);
        if (eggsList) {
          this.eggs = eggsList;
          if (Array.isArray(imported.chicks)) {
            this.chicks = imported.chicks;
          }
          if (imported.clutchCompleted !== undefined) {
            this.clutchCompleted = Boolean(imported.clutchCompleted);
          }
          this.syncHatchedEggsWithChicks();
          this.saveData();
          this.render();
          this.showToast('¡Datos de la nidada y pollitos importados correctamente!');
        } else {
          alert('El archivo no tiene el formato esperado.');
        }
      } catch (err) {
        alert('Error al leer el archivo de respaldo JSON.');
      }
    };
    reader.readAsText(file);
  }

  triggerFileDownload(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  // =========================================================================
  // Notificaciones Toast y Modales
  // =========================================================================

  showToast(message, icon = 'check_circle') {
    const toast = document.getElementById('toast-container');
    const msgEl = document.getElementById('toast-message');
    const iconEl = document.getElementById('toast-icon');

    if (!toast || !msgEl) return;

    msgEl.textContent = message;
    if (iconEl) iconEl.textContent = icon;

    toast.classList.add('show');
    if (this._toastTimeout) clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
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
