// ==========================================
// PERMISSIONS ENGINE - R.A DASHBOARD
// ==========================================

window.PermissionsEngine = {
    roles: {
        ADMIN: 'administrador',
        GERENTE_MERCADEO: 'gerente_mercadeo',
        GERENTE_CORP: 'gerente_mercadeo_corporativo',
        MARKETING_DIGITAL: 'marketing_digital',
        GERENTE_GENERAL: 'gerente_general'
    },

    _readOnlyActive: false,
    _observer: null,
    _scheduled: false,

    applyPermissions: function(email, role) {
        // Intento directo de respaldo buscando el correo en todo el localStorage
        if (!email) {
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    const val = localStorage.getItem(key);
                    if (val && val.includes('community.acqua@gmail.com')) {
                        email = 'community.acqua@gmail.com';
                        break;
                    }
                }
            } catch (e) {
                console.error("Error buscando sesión:", e);
            }
        }

        console.log(`Aplicando permisos para: ${email} | Rol: ${role}`);

        const cleanEmail = email ? String(email).trim().toLowerCase() : '';
        const isAdmin = role === this.roles.ADMIN || cleanEmail === 'community.acqua@gmail.com';

        // Ocultar elementos exclusivos de administración
        const adminElements = document.querySelectorAll('.admin-only, [data-role="administrador"]');
        adminElements.forEach(el => {
            if (!isAdmin) {
                el.style.display = 'none';
            } else {
                el.style.display = '';
            }
        });

        // Si NO es administrador, aplicar modo solo lectura
        if (!isAdmin) {
            this._readOnlyActive = true;
            this.setReadOnlyMode();
            this._startObserver();
        }
    },

    // Controles que SÍ deben seguir funcionando para consultar (filtros)
    isFilterControl: function(el) {
        // Marcado manual: <select class="filter-control"> o data-allow-readonly
        if (el.matches('[data-allow-readonly], .filter-control')) return true;

        const key = ((el.id || '') + ' ' + (el.name || '')).toLowerCase();

        // Si parece un campo de edición (metas, presupuesto, etc.), se bloquea siempre
        if (/meta|goal|inicial|initial|seguidor|follower|asignad|presupuesto|budget|monto|amount/.test(key)) {
            return false;
        }

        // Filtros dentro del encabezado (año, mes, empresa)
        if (el.closest('header')) return true;

        // Filtros por nombre típico
        return /filter|filtro|year|anio|año|month|mes|company|empresa|cuenta|account|network|red-?social/.test(key);
    },

    // Botones/etiquetas de edición detectados por su texto
    isEditAction: function(el) {
        const text = (el.textContent || '').trim().toLowerCase();
        if (!text || text.length > 60) return false;
        return /subir portada|cargar imagen|cambiar imagen|ingresar asignado|guardar|eliminar|editar/.test(text);
    },

    setReadOnlyMode: function() {
        // 1) Botones e inputs de edición conocidos por id/clase
        const editButtons = document.querySelectorAll('button[id*="edit"], button[id*="delete"], button[id*="save"], button[id*="upload"], input[type="file"], .btn-edit, .btn-save, .btn-delete');
        editButtons.forEach(btn => {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
        });

        // 2) Botones/etiquetas de edición detectados por texto
        const actionEls = document.querySelectorAll('button, label, a, [role="button"]');
        actionEls.forEach(el => {
            if (el.closest('#login-form')) return;
            if (this.isEditAction(el)) {
                el.disabled = true;
                el.classList.add('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
                el.setAttribute('aria-disabled', 'true');
            }
        });

        // 3) Campos de formulario: bloquear todos EXCEPTO los filtros
        const inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
        inputs.forEach(input => {
            if (input.closest('#login-form')) return;
            if (this.isFilterControl(input)) return;
            input.disabled = true;
            input.setAttribute('readonly', 'true');
            input.classList.add('opacity-60', 'cursor-not-allowed');
        });
    },

    // Vuelve a aplicar el modo solo lectura cuando se dibuja contenido nuevo
    _startObserver: function() {
        if (this._observer) return;
        this._observer = new MutationObserver(() => {
            if (!this._readOnlyActive || this._scheduled) return;
            this._scheduled = true;
            requestAnimationFrame(() => {
                this._scheduled = false;
                this.setReadOnlyMode();
            });
        });
        this._observer.observe(document.body, { childList: true, subtree: true });
    }
};
