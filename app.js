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
    this.visualizer = null;
    this.activeEggForVisualizer = null;
    this.activeEggForEdit = null;

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
        const saved = localStorage.getItem('impa_egg_tracker_data');
        if (saved) {
          this.eggs = JSON.parse(saved);
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
          if (Array.isArray(nestData.eggs) && nestData.eggs.length > 0) {
            this.eggs = nestData.eggs;
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
      const saved = localStorage.getItem('impa_egg_tracker_data');
      if (saved) {
        this.eggs = JSON.parse(saved);
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

    if (this.isAdmin) {
      this.saveData();
    }
  }

  saveData() {
    if (!this.isAdmin) {
      console.warn('Acción bloqueada: Solo el dueño de Impa puede modificar datos.');
      return;
    }
    try {
      localStorage.setItem('impa_egg_tracker_data', JSON.stringify(this.eggs));
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

    // Ordenar huevos por fecha de puesta
    const sorted = [...this.eggs].sort((a, b) => new Date(a.layDate) - new Date(b.layDate));
    const lastEgg = sorted[sorted.length - 1];
    const lastLayTime = new Date(lastEgg.layDate).getTime();
    const nextLayTargetMs = lastLayTime + (EGG_INTERVAL_HOURS * MS_PER_HOUR);
    const nextNumber = sorted.length + 1;

    const titleEl = document.getElementById('next-egg-title');
    const descEl = document.getElementById('next-egg-desc');
    const timerEl = document.getElementById('next-egg-timer');

    if (titleEl) titleEl.textContent = `Próximo huevo estimado: Huevo #${nextNumber}`;
    if (descEl) descEl.textContent = `Las ninfas suelen poner cada ~48 horas. Última puesta: ${this.formatDate(new Date(lastLayTime))}`;

    const now = Date.now();
    const msRemaining = nextLayTargetMs - now;

    if (timerEl) {
      if (msRemaining > 0) {
        timerEl.textContent = `Faltan ~${this.formatDuration(msRemaining)}`;
        timerEl.className = 'font-data font-bold text-sm sm:text-base text-accent px-3 py-1.5 rounded-lg bg-black/30 border border-accent/30';
      } else {
        timerEl.textContent = `¡Ventana de puesta abierta! (hace ${this.formatDuration(Math.abs(msRemaining))})`;
        timerEl.className = 'font-data font-bold text-sm sm:text-base text-emerald-400 px-3 py-1.5 rounded-lg bg-black/30 border border-emerald-500/40 animate-pulse';
      }
    }

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
                <span class="material-symbols-outlined text-[16px] text-emerald-400">pest_control_rodent</span>
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
            <button class="btn-primary flex-1 py-2 px-2.5 sm:px-3 rounded-xl text-xs font-label-caps tracking-wider flex items-center justify-center gap-1 shadow-sm min-w-[110px]" onclick="app.openVisualizerForEgg('${egg.id}')">
              <span class="material-symbols-outlined text-[16px]">biotech</span>
              <span>VER DÍA ${m.currentDay}</span>
            </button>

            <!-- Botón de descarga de recordatorio individual (abierto a todos) -->
            <button class="btn-secondary py-2 px-2.5 sm:px-3 rounded-xl text-xs font-label-caps flex items-center justify-center gap-1 text-accent border-accent/30 hover:border-accent hover:bg-accent/10 shrink-0" onclick="app.downloadIcsForEgg('${egg.id}')" title="Descargar recordatorios a tu calendario (.ics)">
              <span class="material-symbols-outlined text-[16px]">calendar_add_on</span>
              <span class="hidden sm:inline">RECORDATORIO</span>
            </button>

            ${this.isAdmin ? `
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

    // Actualizar timer del próximo huevo
    if (this.eggs.length > 0) {
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
      eggs: this.eggs
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
    const dataStr = JSON.stringify(this.eggs, null, 2);
    this.triggerFileDownload(dataStr, `Respaldo_Nidada_Impa_${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
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
          this.saveData();
          this.render();
          this.showToast('¡Datos de la nidada importados correctamente!');
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
