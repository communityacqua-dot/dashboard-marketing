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
            this.setReadOnlyMode();
        }
    },

    setReadOnlyMode: function() {
        const editButtons = document.querySelectorAll('button[id*="edit"], button[id*="delete"], button[id*="save"], button[id*="upload"], input[type="file"], .btn-edit, .btn-save, .btn-delete');
        editButtons.forEach(btn => {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
        });

        const inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
        inputs.forEach(input => {
            if (!input.closest('#login-form')) {
                input.disabled = true;
                input.setAttribute('readonly', 'true');
                input.classList.add('opacity-60', 'cursor-not-allowed');
            }
        });
    }
};
