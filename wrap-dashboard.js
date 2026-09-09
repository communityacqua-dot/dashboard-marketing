// ==========================================
// AUTOMATIC DASHBOARD WRAPPER
// ==========================================

(function wrapDashboardBody() {
    function initWrap() {
        if (document.getElementById('dashboard-container')) return;

        const dashboardContainer = document.createElement('div');
        dashboardContainer.id = 'dashboard-container';
        dashboardContainer.className = 'w-full min-h-screen flex flex-col md:flex-row';

        // Mover solo el contenido del dashboard, excluyendo el login
        const nodes = Array.from(document.body.childNodes);
        nodes.forEach(node => {
            if (
                node.id !== 'login-screen' && 
                node.id !== 'auth-loading-screen' && 
                node.tagName !== 'SCRIPT' && 
                node.tagName !== 'STYLE'
            ) {
                dashboardContainer.appendChild(node);
            }
        });

        document.body.appendChild(dashboardContainer);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWrap);
    } else {
        initWrap();
    }
})();
