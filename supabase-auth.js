// Configuración pública de Supabase
const SUPABASE_URL = 'https://lmlphqqmelaedrbycuwg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtbHBocXFtZWxhZWRyYnljdXdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NzA3NDcsImV4cCI6MjEwNDU0Njc0N30.Ulg2HgFCrV0vQUrozVXjMPdNIaLHmdMMSAWwf9rNTeU';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUserProfile = null;

// Inicialización de sesión al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  initAuthSession();
});

async function initAuthSession() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    showLoginUI();
    return;
  }

  // Carga de perfil y rol desde Supabase
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error || !profile || !profile.active) {
    alert('Acceso no autorizado o usuario inactivo.');
    await supabase.auth.signOut();
    showLoginUI();
    return;
  }

  currentUserProfile = profile;
  applyRolePermissions(profile);
  showDashboardUI();
}

// Aplicación de permisos según el rol
function applyRolePermissions(profile) {
  const role = profile.role;

  // Etiqueta de usuario en la interfaz
  const userDisplay = document.getElementById('user-profile-display');
  if (userDisplay) {
    userDisplay.innerText = `Hola, ${profile.full_name} (${formatRoleName(role)})`;
  }

  // Pestaña de administración solo para el rol administrador
  const adminTab = document.getElementById('nav-admin-tab');
  if (adminTab) {
    adminTab.style.display = (role === 'administrador') ? 'block' : 'none';
  }

  // Restricción para Marketing Digital
  if (role === 'marketing_digital') {
    const restrictedModules = document.querySelectorAll('.module-presupuesto, .module-gerencial');
    restrictedModules.forEach(mod => mod.style.display = 'none');
  }

  // Modo solo lectura para Gerente General (Marco)
  if (role === 'gerente_general') {
    const editControls = document.querySelectorAll('button:not(.logout-btn):not(.nav-tab), input, select');
    editControls.forEach(control => {
      control.disabled = true;
      control.setAttribute('title', 'Modo lectura para Gerente General');
    });
  }
}

function formatRoleName(role) {
  const roles = {
    'administrador': 'Administrador',
    'gerente_mercadeo': 'Gerente de Mercadeo',
    'gerente_mercadeo_corporativo': 'Gerente de Mercadeo Corp.',
    'marketing_digital': 'Marketing Digital',
    'gerente_general': 'Gerente General'
  };
  return roles[role] || role;
}

// Control visual de pantallas
function showLoginUI() {
  const loginScreen = document.getElementById('login-screen');
  const dashboardContainer = document.getElementById('dashboard-container');
  if (loginScreen) loginScreen.style.display = 'flex';
  if (dashboardContainer) dashboardContainer.style.display = 'none';
}

function showDashboardUI() {
  const loginScreen = document.getElementById('login-screen');
  const dashboardContainer = document.getElementById('dashboard-container');
  if (loginScreen) loginScreen.style.display = 'none';
  if (dashboardContainer) dashboardContainer.style.display = 'block';
}

// Escuchar cambios de estado en la autenticación
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || !session) {
    showLoginUI();
  }
});
