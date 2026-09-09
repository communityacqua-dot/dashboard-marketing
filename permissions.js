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

        // Ocultar sección de Administración si no es Admin
        const adminElements = document.querySelectorAll('.admin-only, [data-role="administrador"]');
        adminElements.forEach(el => {
            if (role !== this.roles.ADMIN) {
                el.style.display = 'none';
            } else {
                el.style.display = '';
            }
        });

        // Aplicar modo solo lectura para Don Marco / Gerente General
        if (role === this.roles.GERENTE_GENERAL || email.includes('marco')) {
            this.setReadOnlyMode();
        }
    },

    setReadOnlyMode: function() {
        // Deshabilitar botones de edición, creación, eliminación y subida
        const editButtons = document.querySelectorAll('button[id*="edit"], button[id*="delete"], button[id*="save"], button[id*="upload"], input[type="file"]');
        editButtons.forEach(btn => {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
        });
    }
};
