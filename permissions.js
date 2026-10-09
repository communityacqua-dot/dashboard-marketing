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
        console.log(`Aplicando permisos para: ${email} | Rol: ${role}`);

        const isAdmin = role === this.roles.ADMIN;

        // Ocultar elementos exclusivos de administración
        const adminElements = document.querySelectorAll('.admin-only, [data-role="administrador"]');
        adminElements.forEach(el => {
            if (!isAdmin) {
                el.style.display = 'none';
            } else {
                el.style.display = '';
            }
        });

        // Si NO es administrador, aplicar modo solo lectura a toda la interfaz
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
