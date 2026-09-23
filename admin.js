// ============================================================
// Panel administrativo — Capital Risk Brokers
// Requiere que supabase-config.js ya tenga la URL y anon key.
// ============================================================

const loginScreen = document.getElementById('loginScreen');
const panel = document.getElementById('panel');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

function verificarConfig() {
    if (!supabaseClient) {
        document.body.innerHTML = `
            <div style="max-width:500px;margin:80px auto;text-align:center;font-family:sans-serif;padding:0 20px;">
                <h2>Falta configurar Supabase</h2>
                <p>Abre <code>supabase-config.js</code> y reemplaza SUPABASE_URL y SUPABASE_ANON_KEY
                con los datos de tu proyecto (Supabase → Project Settings → API).</p>
            </div>`;
        return false;
    }
    return true;
}

// ==================== SESIÓN ====================
async function mostrarSegunSesion() {
    const { data } = await supabaseClient.auth.getSession();
    if (data.session) {
        loginScreen.style.display = 'none';
        panel.style.display = 'block';
        cargarContenidoEnFormulario();
    } else {
        loginScreen.style.display = 'flex';
        panel.style.display = 'none';
    }
}

loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
        loginError.textContent = 'Correo o contraseña incorrectos.';
        return;
    }
    mostrarSegunSesion();
});

document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    mostrarSegunSesion();
});

// ==================== CARGAR CONTENIDO ====================
let enlacesActuales = [];

async function cargarContenidoEnFormulario() {
    const { data, error } = await supabaseClient
        .from('site_content')
        .select('data')
        .eq('id', 1)
        .single();

    if (error || !data) return;
    const c = data.data || {};

    document.getElementById('f_hero_titulo').value = c.hero?.titulo || '';
    document.getElementById('f_hero_subtitulo').value = c.hero?.subtitulo || '';

    document.getElementById('f_stats_clientes').value = c.stats?.clientes || '';
    document.getElementById('f_stats_anios').value = c.stats?.anios || '';
    document.getElementById('f_stats_aseguradoras').value = c.stats?.aseguradoras || '';

    document.getElementById('f_contacto_direccion').value = c.contacto?.direccion || '';
    document.getElementById('f_contacto_telefono').value = c.contacto?.telefono || '';
    document.getElementById('f_contacto_email').value = c.contacto?.email || '';
    document.getElementById('f_contacto_horario').value = c.contacto?.horario || '';

    document.getElementById('f_wa_numero').value = c.whatsapp?.numero || '';
    document.getElementById('f_wa_mensaje').value = c.whatsapp?.mensaje || '';

    enlacesActuales = Array.isArray(c.enlaces_interes) ? [...c.enlaces_interes] : [];
    pintarEnlaces();
}

// ==================== EDITOR DE ENLACES ====================
function pintarEnlaces() {
    const contenedor = document.getElementById('enlacesEditor');
    contenedor.innerHTML = enlacesActuales.map((link, i) => `
        <div class="enlace-row" data-i="${i}">
            <input type="text" placeholder="Título" value="${escapeHtml(link.titulo || '')}" data-campo="titulo">
            <input type="text" placeholder="https://..." value="${escapeHtml(link.url || '')}" data-campo="url">
            <button type="button" class="remove-enlace" title="Eliminar"><i class="fas fa-trash"></i></button>
        </div>
    `).join('');

    contenedor.querySelectorAll('.enlace-row').forEach(row => {
        const i = Number(row.dataset.i);
        row.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                enlacesActuales[i][input.dataset.campo] = input.value;
            });
        });
        row.querySelector('.remove-enlace').addEventListener('click', () => {
            enlacesActuales.splice(i, 1);
            pintarEnlaces();
        });
    });
}

document.getElementById('addEnlaceBtn')?.addEventListener('click', () => {
    enlacesActuales.push({ titulo: '', url: '' });
    pintarEnlaces();
});

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[s]));
}

// ==================== GUARDAR ====================
document.getElementById('saveBtn')?.addEventListener('click', async () => {
    const nuevoContenido = {
        hero: {
            titulo: document.getElementById('f_hero_titulo').value.trim(),
            subtitulo: document.getElementById('f_hero_subtitulo').value.trim()
        },
        stats: {
            clientes: document.getElementById('f_stats_clientes').value.trim(),
            anios: document.getElementById('f_stats_anios').value.trim(),
            aseguradoras: document.getElementById('f_stats_aseguradoras').value.trim()
        },
        contacto: {
            direccion: document.getElementById('f_contacto_direccion').value.trim(),
            telefono: document.getElementById('f_contacto_telefono').value.trim(),
            email: document.getElementById('f_contacto_email').value.trim(),
            horario: document.getElementById('f_contacto_horario').value.trim()
        },
        whatsapp: {
            numero: document.getElementById('f_wa_numero').value.trim(),
            mensaje: document.getElementById('f_wa_mensaje').value.trim()
        },
        enlaces_interes: enlacesActuales.filter(l => l.titulo && l.url)
    };

    const saveMessage = document.getElementById('saveMessage');
    const { error } = await supabaseClient
        .from('site_content')
        .update({ data: nuevoContenido, updated_at: new Date().toISOString() })
        .eq('id', 1);

    if (error) {
        saveMessage.className = 'form-message error';
        saveMessage.textContent = '⚠️ No se pudo guardar. Verifica tu conexión e inicio de sesión.';
    } else {
        saveMessage.className = 'form-message success';
        saveMessage.textContent = '✅ Cambios guardados. Ya están visibles en el sitio.';
        setTimeout(() => { saveMessage.textContent = ''; }, 5000);
    }
});

// ==================== INICIO ====================
if (verificarConfig()) {
    mostrarSegunSesion();
}
