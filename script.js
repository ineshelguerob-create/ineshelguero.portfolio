const piezas = document.querySelectorAll('.pieza');

document.addEventListener('mousemove', (evento) => {

    const centroX = window.innerWidth / 2;
    const centroY = window.innerHeight / 2;

    const movimientoX = (evento.clientX - centroX) / centroX;
    const movimientoY = (evento.clientY - centroY) / centroY;

    piezas.forEach((pieza, indice) => {

        const intensidad = 6 + (indice * 4);

        pieza.style.setProperty(
            '--mover-x',
            `${movimientoX * intensidad}px`
        );

        pieza.style.setProperty(
            '--mover-y',
            `${movimientoY * intensidad}px`
        );

    });

});
const entrada = document.querySelector('#entrada');

if (entrada) {

    entrada.addEventListener('click', () => {

        document.querySelector('#instrucciones').scrollIntoView({
            behavior: 'smooth'
        });

    });

}
const instrucciones = document.querySelector('#instrucciones');

if (instrucciones) {

    instrucciones.addEventListener('click', () => {

        document.querySelector('#portada-ines').scrollIntoView({
            behavior: 'smooth'
        });

    });

}
// ==========================================
// TRES EN RAYA — JUGADOR VS WEB
// ==========================================

const casillas = document.querySelectorAll('.casilla');
const mensajeJuego = document.querySelector('.mensaje-juego');
const mensajeFinal = document.querySelector('.mensaje-final');
const botonReiniciar = document.querySelector('#reiniciar-juego');

let tableroJuego = ['', '', '', '', '', '', '', '', ''];
let juegoTerminado = false;
let turnoWeb = false;

const combinacionesGanadoras = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

casillas.forEach((casilla, indice) => {
    casilla.addEventListener('click', () => {

        if (
            tableroJuego[indice] !== '' ||
            juegoTerminado ||
            turnoWeb
        ) {
            return;
        }

        colocarFicha(indice, 'jugador');

        if (comprobarFinal()) {
            return;
        }

        turnoWeb = true;
        mensajeJuego.textContent = 'La web está pensando...';

        setTimeout(() => {
            movimientoWeb();
            turnoWeb = false;

            if (!juegoTerminado) {
                mensajeJuego.textContent = '¿Dónde colocas tu silla?';
            }
        }, 600);
    });
});

function colocarFicha(indice, jugador) {
    tableroJuego[indice] = jugador;

    const imagen = document.createElement('img');

    if (jugador === 'jugador') {
        imagen.src = './recursos/imagenes/silla.png';
        imagen.alt = 'Silla';
    } else {
        imagen.src = './recursos/imagenes/lampara.png';
        imagen.alt = 'Lámpara';
    }

    casillas[indice].appendChild(imagen);
}

function movimientoWeb() {
    if (juegoTerminado) return;

    const libres = tableroJuego
        .map((valor, indice) => valor === '' ? indice : null)
        .filter(indice => indice !== null);

    if (libres.length === 0) return;

    let movimiento = null;


    // 1. Si la web puede ganar, gana
    movimiento = encontrarMovimiento('web');


    // 2. Si tú puedes ganar en el siguiente turno,
    // la web te bloquea el 85% de las veces
    if (movimiento === null || movimiento === undefined) {

        const bloqueo = encontrarMovimiento('jugador');

        if (bloqueo !== null && bloqueo !== undefined) {
            if (Math.random() < 0.85) {
                movimiento = bloqueo;
            }
        }
    }


    // 3. Intenta quedarse con el centro
    if (
        (movimiento === null || movimiento === undefined) &&
        tableroJuego[4] === '' &&
        Math.random() < 0.8
    ) {
        movimiento = 4;
    }


    // 4. Si no, prefiere una esquina
    if (movimiento === null || movimiento === undefined) {

        const esquinas = [0, 2, 6, 8].filter(
            indice => tableroJuego[indice] === ''
        );

        if (esquinas.length > 0 && Math.random() < 0.75) {
            movimiento =
                esquinas[Math.floor(Math.random() * esquinas.length)];
        }
    }


    // 5. Si no ha elegido nada, movimiento aleatorio
    if (movimiento === null || movimiento === undefined) {
        movimiento =
            libres[Math.floor(Math.random() * libres.length)];
    }


    colocarFicha(movimiento, 'web');
    comprobarFinal();
}

function encontrarMovimiento(jugador) {
    for (const combinacion of combinacionesGanadoras) {
        const [a, b, c] = combinacion;

        const valores = [
            tableroJuego[a],
            tableroJuego[b],
            tableroJuego[c]
        ];

        const fichasJugador =
            valores.filter(valor => valor === jugador).length;

        const vacias =
            valores.filter(valor => valor === '').length;

        if (fichasJugador === 2 && vacias === 1) {

            if (tableroJuego[a] === '') return a;
            if (tableroJuego[b] === '') return b;
            if (tableroJuego[c] === '') return c;
        }
    }

    return null;
}

function comprobarFinal() {
    for (const combinacion of combinacionesGanadoras) {

        const [a, b, c] = combinacion;

        if (
            tableroJuego[a] &&
            tableroJuego[a] === tableroJuego[b] &&
            tableroJuego[a] === tableroJuego[c]
        ) {
            juegoTerminado = true;

            if (tableroJuego[a] === 'jugador') {
                mensajeJuego.textContent = 'PARTIDA TERMINADA';
                mensajeFinal.textContent = '¡HAS GANADO! BUENA JUGADA :)';
            } else {
                mensajeJuego.textContent = 'PARTIDA TERMINADA';
                mensajeFinal.textContent = 'TE HA GANADO LA WEB. ¿OTRA?';
            }

            return true;
        }
    }

    if (!tableroJuego.includes('')) {
        juegoTerminado = true;
        mensajeJuego.textContent = 'PARTIDA TERMINADA';
        mensajeFinal.textContent = 'EMPATE. NADIE CEDE ESTA VEZ.';
        return true;
    }

    return false;
}

botonReiniciar.addEventListener('click', () => {

    tableroJuego = ['', '', '', '', '', '', '', '', ''];

    juegoTerminado = false;
    turnoWeb = false;

    casillas.forEach((casilla) => {
        casilla.innerHTML = '';
    });

    mensajeJuego.textContent = '¿Dónde colocas tu silla?';
    mensajeFinal.textContent = '';
});
/* ==========================================
   MENÚ LATERAL
   ========================================== */

const abrirMenu = document.querySelector('#abrir-menu');
const cerrarMenu = document.querySelector('#cerrar-menu');
const menuLateral = document.querySelector('#menu-lateral');
const enlacesMenu = document.querySelectorAll('.menu-enlaces a');

abrirMenu.addEventListener('click', () => {
    menuLateral.classList.add('abierto');
});

cerrarMenu.addEventListener('click', () => {
    menuLateral.classList.remove('abierto');
});

enlacesMenu.forEach((enlace) => {
    enlace.addEventListener('click', () => {
        menuLateral.classList.remove('abierto');
    });
});
/* ==========================================
   SCROLL SUAVE DEL MENÚ
   ========================================== */

document.querySelectorAll('.menu-enlaces a').forEach(enlace => {

    enlace.addEventListener('click', function(e) {

        const destino = document.querySelector(this.getAttribute('href'));

        if (!destino) return;

        e.preventDefault();

        destino.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });

});
/* ==========================================
   APARICIÓN DE SECCIONES AL HACER SCROLL
   ========================================== */

const seccionesAnimadas = document.querySelectorAll(
    '#sobre-mi, #proyectos, #arte, #tres-en-raya, #contacto'
);

seccionesAnimadas.forEach(seccion => {
    seccion.classList.add('aparece-scroll');
});

const observadorScroll = new IntersectionObserver((entradas) => {

    entradas.forEach(entrada => {

        if (entrada.isIntersecting) {
            entrada.target.classList.add('visible');
        }

    });

}, {
    threshold: 0.08
});

seccionesAnimadas.forEach(seccion => {
    observadorScroll.observe(seccion);
});
/* ==========================================
   CURSOR PERSONALIZADO — PROYECTOS
   ========================================== */

const cursorProyecto = document.querySelector('#cursor-proyecto');
const cartasProyecto = document.querySelectorAll('.cartas-proyecto');

cartasProyecto.forEach(cartas => {

    cartas.addEventListener('mouseenter', () => {
        cursorProyecto.classList.add('visible');
    });

    cartas.addEventListener('mouseleave', () => {
        cursorProyecto.classList.remove('visible');
    });

    cartas.addEventListener('mousemove', (e) => {
        cursorProyecto.style.left = `${e.clientX}px`;
        cursorProyecto.style.top = `${e.clientY}px`;
    });

});
/* ==========================================
   PROGRESO DE LA PARTIDA
   ========================================== */

const barraProgreso = document.querySelector('#progreso-partida-barra');

window.addEventListener('scroll', () => {

    const scrollActual = window.scrollY;

    const alturaTotal =
        document.documentElement.scrollHeight - window.innerHeight;

    const porcentaje =
        alturaTotal > 0
            ? (scrollActual / alturaTotal) * 100
            : 0;

    barraProgreso.style.width = `${porcentaje}%`;

});
/* ==========================================
   VISOR CREACIÓN ARTÍSTICA
   ========================================== */

const fotosArte = document.querySelectorAll('.galeria-arte img');

const visorArte = document.querySelector('#visor-arte');
const imagenVisor = document.querySelector('#imagen-visor');
const cerrarVisor = document.querySelector('#cerrar-visor');

const anteriorVisor = document.querySelector('#anterior-visor');
const siguienteVisor = document.querySelector('#siguiente-visor');

let fotoActual = 0;


/* ABRIR FOTO */

fotosArte.forEach((foto, indice) => {

    foto.addEventListener('click', () => {

        fotoActual = indice;

        mostrarFoto();

        visorArte.classList.add('abierto');

        document.body.style.overflow = 'hidden';

    });

});


/* MOSTRAR FOTO ACTUAL */

function mostrarFoto() {

    imagenVisor.src = fotosArte[fotoActual].src;

}


/* SIGUIENTE */

function siguienteFoto() {

    fotoActual++;

    if (fotoActual >= fotosArte.length) {
        fotoActual = 0;
    }

    mostrarFoto();

}


/* ANTERIOR */

function anteriorFoto() {

    fotoActual--;

    if (fotoActual < 0) {
        fotoActual = fotosArte.length - 1;
    }

    mostrarFoto();

}


siguienteVisor.addEventListener('click', siguienteFoto);

anteriorVisor.addEventListener('click', anteriorFoto);


/* CERRAR */

function cerrarGaleria() {

    visorArte.classList.remove('abierto');

    document.body.style.overflow = '';

}


cerrarVisor.addEventListener('click', cerrarGaleria);


/* CLIC EN EL FONDO */

visorArte.addEventListener('click', (e) => {

    if (e.target === visorArte) {
        cerrarGaleria();
    }

});


/* TECLADO */

document.addEventListener('keydown', (e) => {

    if (!visorArte.classList.contains('abierto')) return;

    if (e.key === 'Escape') {
        cerrarGaleria();
    }

    if (e.key === 'ArrowRight') {
        siguienteFoto();
    }

    if (e.key === 'ArrowLeft') {
        anteriorFoto();
    }

});