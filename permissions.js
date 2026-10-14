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
        // Si el email llega vacío, intentar leerlo del localStorage de Supabase
        if (!email) {
            try {
                const sbSession = localStorage.getItem('sb-access-token') || localStorage.getItem('sb-refresh-token');
                // O buscar el objeto de sesión genérico de Supabase en el localStorage
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
                        const data = JSON.parse(localStorage.getItem(key));
                        if (data?.user?.email) {
                            email = data.user.email;
                        }
                    }
                }
            } catch (e) {
                console.error("Error leyendo sesión de respaldo:", e);
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

        // Si NO erres administrador, aplicar modo solo lectura a toda la interfaz
        if (!isAdmin) {
            this.setReadOnlyMode();
        }
    }, 

    setReadOnlyMode: function() {
        // Deshabilitar botones de edición, creación, eliminación, guardado y subida
        const editButtons = document.querySelectorAll('button[id*="edit"], button[id*="delete"], button[id*="save"], button[id*="upload"], input[type="file"], .btn-edit, .btn-save, .btn-delete');
        editButtons.forEach(btn => {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
        });

        // Bloquear inputs y selects para evitar que editen cantidades o valores en tablas/formularios
        const inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
        inputs.forEach(input => {
            // Ignorar el formulario de login para no bloquear el inicio de sesión
            if (!input.closest('#login-form')) {
                input.disabled = true;
                input.setAttribute('readonly', 'true');
                input.classList.add('opacity-60', 'cursor-not-allowed');
            }
        });
    }
};
