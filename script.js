// ==================== WHATSAPP: NÚMERO FIJO + MENSAJE ====================
// Valores por defecto (se usan si aún no hay contenido en Supabase).
// El número y el mensaje se pueden editar luego desde el panel admin.
function aplicarWhatsapp(numero, mensaje) {
    const waLink = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    document.getElementById('waFloat')?.setAttribute('href', waLink);
    document.getElementById('waSocialLink')?.setAttribute('href', waLink);
}
aplicarWhatsapp('50589049798', 'Hola, vengo de la página web de Capital Risk Brokers y quisiera más información.');

// ==================== CONTENIDO EDITABLE (Supabase) ====================
// Lee la fila de contenido guardada por el panel administrativo (admin.html)
// y actualiza los textos marcados con [data-field] y la lista de enlaces de interés.
async function cargarContenido() {
    if (typeof supabaseClient === 'undefined' || !supabaseClient) return;

    const { data, error } = await supabaseClient
        .from('site_content')
        .select('data')
        .eq('id', 1)
        .single();

    if (error || !data) return;
    const c = data.data || {};

    document.querySelectorAll('[data-field]').forEach(el => {
        const path = el.getAttribute('data-field').split('.');
        let value = c;
        for (const key of path) value = value?.[key];
        if (value !== undefined && value !== null && value !== '') {
            el.textContent = value;
        }
    });

    if (c.whatsapp && c.whatsapp.numero) {
        aplicarWhatsapp(c.whatsapp.numero, c.whatsapp.mensaje || '');
    }

    if (Array.isArray(c.enlaces_interes) && c.enlaces_interes.length) {
        const lista = document.getElementById('enlacesList');
        lista.innerHTML = c.enlaces_interes.map(link => `
            <li><a href="${link.url}" target="_blank" rel="noopener">
                <i class="fas fa-arrow-up-right-from-square"></i> ${link.titulo}
            </a></li>
        `).join('');
    }
}

cargarContenido();

// ==================== MENÚ HAMBURGUESA ====================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Cerrar menú al hacer click en un enlace (móvil)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ==================== NAVBAR ACTIVO AL HACER SCROLL ====================
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (link) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
});

// ==================== FORMULARIO DE CONTACTO ====================
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const tipo = document.getElementById('tipo').value;
    const mensaje = document.getElementById('mensaje').value.trim();

    // Validación básica
    if (!nombre || !email || !tipo || !mensaje) {
        formMessage.className = 'form-message error';
        formMessage.textContent = '⚠️ Por favor, completa todos los campos obligatorios.';
        return;
    }

    // Simulación de envío (aquí conectarías con tu backend o servicio de email)
    formMessage.className = 'form-message success';
    formMessage.innerHTML = `✅ ¡Gracias, ${nombre}! Hemos recibido tu mensaje. Nos pondremos en contacto contigo a la brevedad.`;

    contactForm.reset();

    // Ocultar mensaje después de 6 segundos
    setTimeout(() => {
        formMessage.className = 'form-message';
        formMessage.textContent = '';
    }, 6000);
});

// ==================== ANIMACIÓN AL HACER SCROLL ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animación a tarjetas
document.querySelectorAll('.stat-card, .mv-card, .service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ==================== SCROLL SUAVE PARA ENLACES INTERNOS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== NAVBAR CON SOMBRA AL SCROLL ====================
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 25px rgba(0, 0, 0, 0.12)';
    } else {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
    }
});