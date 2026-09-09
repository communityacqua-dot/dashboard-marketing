// ==========================================
// SUPABASE AUTHENTICATION ENGINE - R.A DASHBOARD
// ==========================================

const SUPABASE_URL = 'https://lmlphqqmelaedrbycuwg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtbHBocXFtZWxhZWRyYnljdXdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU0Mzc5MzQsImV4cCI6MjAzMTAxMzkzNH0.D5s-E1_zO2b2LXZQ3Z3v1Y1v';

let supabaseClient = null;

function getSupabase() {
    if (!supabaseClient && window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return supabaseClient;
}

// Inyección de la UI de Login
(function injectAuthUI() {
    if (document.getElementById('login-screen')) return;

    const loginDiv = document.createElement('div');
    loginDiv.id = 'login-screen';
    loginDiv.className = 'fixed inset-0 bg-slate-900 z-50 flex items-center justify-center p-4';
    loginDiv.innerHTML = `
        <div class="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600/10 mb-4 border border-red-500/20">
                    <i class="fa-solid fa-chart-line text-red-500 text-2xl"></i>
                </div>
                <h1 class="text-2xl font-bold text-white tracking-wide">Repuestos Acquaroni</h1>
                <p class="text-sm text-slate-400 mt-1">R.A Dashboard Consolidado</p>
            </div>

            <div id="login-error" class="hidden mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start gap-3">
                <i class="fa-solid fa-circle-exclamation text-base mt-0.5 shrink-0"></i>
                <span id="login-error-msg">Credenciales incorrectas.</span>
            </div>

            <form id="login-form" class="space-y-5" onsubmit="handleLoginSubmit(event)">
                <div>
                    <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Correo Electrónico</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                            <i class="fa-solid fa-envelope"></i>
                        </span>
                        <input type="email" id="login-email" required
                            class="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                            placeholder="usuario@acquaroni.com">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Contraseña</label>
                    <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                            <i class="fa-solid fa-lock"></i>
                        </span>
                        <input type="password" id="login-password" required
                            class="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                            placeholder="••••••••">
                    </div>
                </div>

                <button type="submit" id="login-btn"
                    class="w-full py-3 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2">
                    <span id="login-btn-text">Iniciar Sesión</span>
                </button>
            </form>

            <div class="mt-8 pt-6 border-t border-slate-700/60 text-center">
                <p class="text-xs text-slate-500">R.A Dashboard &copy; 2026 — Sistema de Control Interno</p>
            </div>
        </div>
    `;
    
    if (document.body) {
        document.body.prepend(loginDiv);
    } else {
        document.addEventListener('DOMContentLoaded', () => document.body.prepend(loginDiv));
    }
})();

// Verificación de sesión al cargar
document.addEventListener('DOMContentLoaded', async () => {
    const client = getSupabase();
    if (!client) {
        console.error('Supabase no está disponible aún.');
        return;
    }

    try {
        const { data: { session } } = await client.auth.getSession();
        if (session) {
            grantAccess(session.user);
        } else {
            revokeAccess();
        }

        client.auth.onAuthStateChange((event, session) => {
            if (session) {
                grantAccess(session.user);
            } else {
                revokeAccess();
            }
        });
    } catch (err) {
        console.error('Error al inicializar sesión:', err);
        revokeAccess();
    }
});

function grantAccess(user) {
    document.body.classList.add('authenticated');
    const userRole = user.user_metadata?.role || getUserRoleByEmail(user.email);

    if (window.PermissionsEngine) {
        window.PermissionsEngine.applyPermissions(user.email, userRole);
    }
}

function revokeAccess() {
    document.body.classList.remove('authenticated');
}

async function handleLoginSubmit(e) {
    e.preventDefault();
    const client = getSupabase();
    if (!client) return alert('Error de conexión con el servicio de autenticación.');

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorBox = document.getElementById('login-error');
    const errorMsg = document.getElementById('login-error-msg');

    if (errorBox) errorBox.classList.add('hidden');

    try {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
    } catch (err) {
        if (errorBox && errorMsg) {
            errorMsg.innerText = err.message || 'Credenciales incorrectas.';
            errorBox.classList.remove('hidden');
        }
    }
}

function getUserRoleByEmail(email = '') {
    const map = {
        'community.acqua@gmail.com': 'administrador',
        'orlando2216146@gmail.com': 'administrador',
        'admin@acquaroni.com': 'administrador',
        'nery@acquaroni.com': 'gerente_mercadeo',
        'otto@acquaroni.com': 'gerente_mercadeo_corporativo',
        'jose@acquaroni.com': 'marketing_digital',
        'marco@acquaroni.com': 'gerente_general'
    };
    return map[email.toLowerCase()] || 'gerente_general';
}
