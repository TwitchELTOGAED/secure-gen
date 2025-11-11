/* ========== CAMBIAR ENTRE SECCIONES ========== */

document.querySelectorAll('.btn-tipo').forEach(boton => {
    boton.addEventListener('click', function() {
        const tipo = this.getAttribute('data-tipo');
        cambiarGenerador(tipo);
    });
});

function cambiarGenerador(tipo) {
    document.querySelectorAll('.generador').forEach(seccion => {
        seccion.classList.remove('activo');
    });

    document.querySelectorAll('.btn-tipo').forEach(boton => {
        boton.classList.remove('activo');
    });

    document.getElementById(tipo).classList.add('activo');
    document.querySelector(`[data-tipo="${tipo}"]`).classList.add('activo');
}

/* ========== ACTUALIZAR LONGITUD EN TIEMPO REAL ========== */

document.getElementById('longitud-password').addEventListener('input', function() {
    document.getElementById('valor-longitud').textContent = this.value;
});

/* ========== GENERADOR DE CONTRASEÑAS ========== */

function generarPassword() {
    const mayusculas = document.getElementById('mayusculas').checked;
    const minusculas = document.getElementById('minusculas').checked;
    const numeros = document.getElementById('numeros').checked;
    const simbolos = document.getElementById('simbolos').checked;
    const longitud = parseInt(document.getElementById('longitud-password').value);

    let caracteres = '';
    if (mayusculas) caracteres += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (minusculas) caracteres += 'abcdefghijklmnopqrstuvwxyz';
    if (numeros) caracteres += '0123456789';
    if (simbolos) caracteres += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (caracteres.length === 0) {
        alert('⚠️ Debes marcar al menos una opción');
        return;
    }

    let password = '';
    for (let i = 0; i < longitud; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        password += caracteres[indiceAleatorio];
    }

    document.getElementById('resultado-password').value = password;
}

/* ========== GENERADOR DE CORREOS TEMPORALES ========== */

let correoActual = null;

function generarEmail() {
    const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let usuario = '';
    
    for (let i = 0; i < 10; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        usuario += caracteres[indice];
    }

    const email = usuario + '@1secmail.com';
    correoActual = usuario;

    document.getElementById('resultado-email').value = email;
    document.getElementById('bandeja-info').style.display = 'block';
    document.getElementById('lista-emails').innerHTML = '<p class="texto-vacio">Esperando correos...</p>';

    actualizarBandeja();
}

/* ========== ACTUALIZAR BANDEJA DE ENTRADA ========== */

function actualizarBandeja() {
    if (!correoActual) {
        alert('⚠️ Primero genera un correo temporal');
        return;
    }

    const url = `https://www.1secmail.com/api/v1/?action=getMessages&login=${correoActual}&domain=1secmail.com`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(emails => mostrarEmails(emails))
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('lista-emails').innerHTML = 
                '<p class="texto-vacio">Error al actualizar. Intenta de nuevo.</p>';
        });
}

/* ========== MOSTRAR EMAILS EN LA BANDEJA ========== */

function mostrarEmails(emails) {
    const listaEmails = document.getElementById('lista-emails');

    if (emails.length === 0) {
        listaEmails.innerHTML = '<p class="texto-vacio">📭 Sin correos. Úsalo para registrarte en sitios.</p>';
        return;
    }

    let html = '';
    emails.forEach((email, indice) => {
        html += `
            <div class="email-item" onclick="verContenidoEmail(${email.id}, '${correoActual}')">
                <div class="email-from">De: ${email.from}</div>
                <div class="email-asunto">Asunto: ${email.subject}</div>
                <div class="email-fecha">Fecha: ${new Date(email.date).toLocaleString('es-ES')}</div>
            </div>
        `;
    });

    listaEmails.innerHTML = html;
}

/* ========== VER CONTENIDO DE UN EMAIL ========== */

function verContenidoEmail(emailId, usuario) {
    const url = `https://www.1secmail.com/api/v1/?action=readMessage&login=${usuario}&domain=1secmail.com&id=${emailId}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(email => {
            const emailItem = event.currentTarget;
            
            if (emailItem.querySelector('.email-contenido')) {
                emailItem.querySelector('.email-contenido').remove();
                return;
            }

            const contenido = document.createElement('div');
            contenido.className = 'email-contenido';
            
            if (email.textBody) {
                contenido.textContent = email.textBody;
            } else if (email.htmlBody) {
                contenido.innerHTML = email.htmlBody;
            } else {
                contenido.textContent = '(Sin contenido)';
            }

            emailItem.appendChild(contenido);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al obtener el correo');
        });
}

/* ========== FUNCIÓN PARA COPIAR AL PORTAPAPELES ========== */

function copiar(elementoId) {
    const elemento = document.getElementById(elementoId);
    elemento.select();
    document.execCommand('copy');

    const boton = event.target;
    const textoOriginal = boton.textContent;
    boton.textContent = '✅ ¡Copiado!';

    setTimeout(() => {
        boton.textContent = textoOriginal;
    }, 2000);
}
