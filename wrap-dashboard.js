// ==========================================
// AUTOMATIC DASHBOARD WRAPPER
// ==========================================

(function wrapDashboardBody() {
    if (document.getElementById('dashboard-container')) return;

    const dashboardContainer = document.createElement('div');
    dashboardContainer.id = 'dashboard-container';
    dashboardContainer.className = 'w-full min-h-screen flex flex-col md:flex-row';

    // Mover todos los nodos hijos del body dentro del dashboard-container
    while (document.body.firstChild) {
        dashboardContainer.appendChild(document.body.firstChild);
    }

    document.body.appendChild(dashboardContainer);
})();
