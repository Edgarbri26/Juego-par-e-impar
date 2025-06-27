const contents = document.querySelectorAll('.content');
const labels = document.querySelectorAll('.num');
let player = document.getElementById('player');
let board = document.getElementById('board')
let playerTurn = true;
let arrayImpar = [];
let arrayPar = [];
let totalPartidas = 1;
let partidasGanadasImpar = 0;
let partidasGanadasPar = 0;
let partidasJugadas = 0;
let modoJuego = 'pvp';

const partidasSelect = document.getElementById('partidas-select');
const marcador = document.getElementById('marcador');
const modoSelect = document.getElementById('modo-select');

// --- SOCKET.IO CLIENT ---
let socket = null;
let codigoSala = '';
let soyJugador = 1; // 1: impar, 2: par
const onlineForm = document.getElementById('online-form');
const inputCodigoSala = document.getElementById('codigo-sala');
const btnCrearSala = document.getElementById('btn-crear-sala');
const btnUnirseSala = document.getElementById('btn-unirse-sala');
const onlineMsg = document.getElementById('online-msg');

const boardSection = document.getElementById('board');

// Estado para saber si el juego online está listo
let onlineListo = false;

function mostrarTableroOnline(mostrar) {
    if (boardSection) {
        boardSection.style.pointerEvents = mostrar ? 'auto' : 'none';
        boardSection.style.opacity = mostrar ? '1' : '0.5';
    }
    // También puedes ocultar los selects si no está listo
    contents.forEach((content) => {
        if (!mostrar) content.classList.add('hidden');
    });
}

if (partidasSelect) {
    partidasSelect.addEventListener('change', (e) => {
        totalPartidas = parseInt(e.target.value);
        resetMarcador();
        resetGame();
    });
}

if (modoSelect) {
    modoSelect.addEventListener('change', (e) => {
        modoJuego = e.target.value;
        resetMarcador();
        resetGame();
        if (modoJuego === 'online') {
            if (onlineForm) onlineForm.classList.remove('hidden');
        } else {
            if (onlineForm) onlineForm.classList.add('hidden');
        }
    });
}

if (btnCrearSala) {
    btnCrearSala.addEventListener('click', () => {
        if (!socket) conectarSocket();
        codigoSala = inputCodigoSala.value.trim() || generarCodigoSala();
        inputCodigoSala.value = codigoSala;
        onlineMsg.textContent = 'Creando sala...';
        socket.emit('unirse-partida', codigoSala);
    });
}
if (btnUnirseSala) {
    btnUnirseSala.addEventListener('click', () => {
        if (!socket) conectarSocket();
        codigoSala = inputCodigoSala.value.trim();
        if (!codigoSala) {
            onlineMsg.textContent = 'Ingresa un código de sala.';
            return;
        }
        onlineMsg.textContent = 'Uniéndose a sala...';
        socket.emit('unirse-partida', codigoSala);
    });
}

function resetMarcador() {
    partidasGanadasImpar = 0;
    partidasGanadasPar = 0;
    partidasJugadas = 0;
    actualizarMarcador();
}

function actualizarMarcador() {
    if (marcador) {
        marcador.innerHTML = `Impar: ${partidasGanadasImpar} - Par: ${partidasGanadasPar} <br> Partida ${partidasJugadas + 1} de ${totalPartidas}`;
    }
}

resetGame(); // Inicializar el juego
    
// Agregar eventos click a los labels inicialmente
labels.forEach((label) => {
    label.addEventListener("click", showSelect);
});

// window.addEventListener('DOMContentLoaded', () => {
//     jugadorEfectoHover();
//     let reloadCount = parseInt(localStorage.getItem('reloadCount') || '0', 10);

//     reloadCount += 1;
//     localStorage.setItem('reloadCount', reloadCount);

//     if (reloadCount === 2) {
//         // Redirige solo en la segunda recarga
//         localStorage.removeItem('reloadCount'); // Limpia el contador para futuras recargas
//         window.location.href = "inicio.html"; // Cambia por la ruta que necesites
//     }
// });


function ocultarSelect() {
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.classList.add('hidden');
    });
}

function mostrarSelect() {
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.classList.remove('hidden');
    });
}


contents.forEach((content, index) => {
    updateCells(content); 

    content.addEventListener('change', (event) => {
        if (modoJuego === 'online' && !onlineListo) {
            event.preventDefault();
            return;
        }
        console.log('content.addEventListener');
        const selectedValue = parseInt(event.target.value);
        num = document.querySelectorAll('.num')[index];
        num.textContent = selectedValue; // Actualizar el número en la celda
        event.target.value = ""; // Limpiar el select
        if (playerTurn) {
            arrayImpar = arrayImpar.filter(num => num !== selectedValue);
            let cell = event.target.parentElement; // para seleccionar el elemento padre
            cell.classList.add("impar");
        } else {
            arrayPar = arrayPar.filter(num => num !== selectedValue);
            let cell = event.target.parentElement;
            cell.classList.add("par");
        }
        
        validarGanador();
        
        playerTurn = !playerTurn; // Cambiar turno
        jugadorEfectoHover()
        updateCells();
        
        // Ocultar el select después de seleccionar
        event.target.classList.add('hidden');
        
        playerTurn? player.textContent = "Jugador Impar" : player.textContent = "Jugador Par";
        const mensaje = document.getElementById('resultado');
        if (!mensaje.innerHTML == "") {
            player.innerText = `El Juego a Terminado`
        }
        label = labels[index];
        label.removeEventListener("click", showSelect); // Elimina el evento click para evitar múltiples activaciones

        // --- NUEVO: Si es modo CPU y es turno de la computadora, que juegue ---
        if (modoJuego === 'cpu' && !playerTurn && mensaje.innerHTML === "") {
            setTimeout(jugadaComputadora, 700);
        }

        notificarMovimiento();
    });
});



function updateCells() {
    console.log('updateCells');
    let arrayActual = playerTurn ? arrayImpar : arrayPar;

    contents.forEach((content) => {
        content.innerHTML = ""; // Limpiar el select
        arrayActual.forEach((num) => {
            let newNum = document.createElement("option"); // Crear opción
            newNum.value = num;
            newNum.textContent = num; // Texto visible
            content.appendChild(newNum); // Agregar al select
        });
    });   
}

function resetGame() {
    console.log('resetGame');
    playerTurn = true;
    arrayImpar = ["",1, 3, 5, 7, 9];
    arrayPar = ["",2, 4, 6, 8];

    const Cambiartexto = document.getElementById('btn-reset');
    Cambiartexto.innerText =`Reiniciar`;

    contents.forEach((content) => {
        content.innerHTML = ""; // Limpiar el select
        content.classList.add('hidden'); // Ocultar el select
        updateCells(content); // Llamar a la función para actualizar las celdas
    });

    const mensaje = document.getElementById("resultado");
    mensaje.innerHTML = ""; // Limpiar el mensaje de resultado

    labels.forEach((label) => {
        label.textContent = ""; // Limpiar el número en la celda
        label.addEventListener("click", showSelect); // Reagregar el evento click
    });

    player.textContent = "Jugador Impar";

    let contenCells = document.querySelectorAll('.cell');
    contenCells.forEach((cell) => {
        cell.classList.remove("impar"); // Limpiar la clase de celda impar
        cell.classList.remove("par"); // Limpiar la clase de celda par
    });
    limpiarLineaGanadora();
    actualizarMarcador();
}



function showSelect(event) {
    console.log('showSelect');
    let label = event.currentTarget; // Obtiene el label que fue clickeado

    let selectId = label.getAttribute("for"); // Obtiene el ID del select vinculado
    let select = document.getElementById(selectId); // Accede al select por su ID
    
    // Ocultar todos los selects primero
    contents.forEach((content) => {
        content.classList.add('hidden');
    });

    if (select) { // Verifica que el select exista
        select.classList.remove('hidden'); // Mostrar solo el select clickeado
        select.size = select.options.length; // Expande el menú desplegable
        select.focus(); // Enfoca el select automáticamente
    }
    
}


function validarGanador() {
    console.log('validarGanador');
    // Obtén los valores numéricos de cada celda
    const celdas = [];
    for (let i = 1; i <= 9; i++) {
        const label = document.querySelector(`#cell${i} ~ .num`);
        celdas[i] = label && label.textContent ? parseInt(label.textContent) : null;
    }

    // Combinaciones ganadoras (índices de las celdas)
    const combinaciones = [
        [1,2,3], [4,5,6], [7,8,9], // filas
        [1,4,7], [2,5,8], [3,6,9], // columnas
        [1,5,9], [3,5,7]           // diagonales
    ];

    let hayGanador = false;
    combinaciones.forEach((combo) => {
        const [a, b, c] = combo;
        if (
            celdas[a] !== null && celdas[b] !== null && celdas[c] !== null &&
            (celdas[a] + celdas[b] + celdas[c] === 15)
        ) {
            const winner = playerTurn ? "Impar" : "Par";
            const mensaje = document.getElementById("resultado");
            mensaje.innerHTML = `<h2>El jugador ${winner} ha ganado la partida!</h2>`;
            hayGanador = true;
            const Cambiartexto = document.getElementById('btn-reset');
            Cambiartexto.innerText =`Volver a jugar`;

            labels.forEach((label) => {
              label.removeEventListener("click", showSelect);
            });

            // Actualizar marcador
            if (winner === "Impar") {
                partidasGanadasImpar++;
            } else {
                partidasGanadasPar++;
            }
            partidasJugadas++;
            actualizarMarcador();

            // Verificar si alguien ganó la serie
            const necesarias = Math.ceil(totalPartidas / 2);
            if (partidasGanadasImpar === necesarias || partidasGanadasPar === necesarias) {
                setTimeout(() => {
                    mensaje.innerHTML += `<br><strong>¡El jugador ${partidasGanadasImpar === necesarias ? 'Impar' : 'Par'} gana la serie!</strong>`;
                }, 500);
            } else {
                setTimeout(() => {
                    resetGame();
                }, 1500);
            }

            dibujarLineaGanadora(combo, winner);
        }
    });

    // Si no hay ganador y todas las celdas tienen valor, es empate
    if (!hayGanador && celdas.slice(1).every(val => val !== null)) {
        const mensaje = document.getElementById("resultado");
        mensaje.innerHTML = `<h2>¡La partida ha terminado en empate!</h2>`;
        const Cambiartexto = document.getElementById('btn-reset');
        Cambiartexto.innerText =`Volver a jugar`;
        partidasJugadas++;
        actualizarMarcador();
        if (partidasJugadas < totalPartidas) {
            setTimeout(() => {
                resetGame();
            }, 1500);
        }
        limpiarLineaGanadora();
    }
}


function jugadorEfectoHover() {
    console.log('jugadorEfectoHover');
    const celdas = document.querySelectorAll('.cell');
    // Elimina cualquier clase de hover previa
    celdas.forEach(cell => {
        cell.classList.remove('hover-impar', 'hover-par');
    });

    if (playerTurn) {
        // Jugador Impar
        celdas.forEach(cell => {
            if (!cell.classList.contains('impar') && !cell.classList.contains('par')) {
                cell.classList.add('hover-impar');
            }
        });
    } else {
        // Jugador Par
        celdas.forEach(cell => {
            if (!cell.classList.contains('impar') && !cell.classList.contains('par')) {
                cell.classList.add('hover-par');
            }
        });
    }
}

function dibujarLineaGanadora(combo, ganador) {
    const linea = document.getElementById('linea-ganadora');
    if (!linea) return;
    linea.innerHTML = '';
    let color = ganador === 'Impar' ? 'bg-blue-500' : 'bg-green-500';
    let clases = 'absolute rounded-2xl z-30 animate-zoom-in ' + color;
    switch (combo.toString()) {
        case '1,2,3':
            clases += ' top-[16.66%] left-0 w-full h-2';
            break;
        case '4,5,6':
            clases += ' top-1/2 left-0 w-full h-2 -translate-y-1/2';
            break;
        case '7,8,9':
            clases += ' bottom-[16.66%] left-0 w-full h-2';
            break;
        case '1,4,7':
            clases += ' left-[16.66%] top-0 h-full w-2';
            break;
        case '2,5,8':
            clases += ' left-1/2 top-0 h-full w-2 -translate-x-1/2';
            break;
        case '3,6,9':
            clases += ' right-[16.66%] top-0 h-full w-2';
            break;
        case '1,5,9':
            clases += ' left-1/2 top-1/2 w-full h-2 -translate-x-1/2  rotate-45';
            break;
        case '3,5,7':
            clases += ' left-1/2 top-1/2 w-full h-2 -translate-x-1/2  -rotate-45';
            break;
        default:
            return;
    }
    linea.innerHTML = `<div class='${clases}'></div>`;
}

function limpiarLineaGanadora() {
    const linea = document.getElementById('linea-ganadora');
    if (linea) linea.innerHTML = '';
}

function jugadaComputadora() {
    // Buscar celdas disponibles
    let celdasDisponibles = [];
    contents.forEach((content, idx) => {
        if (labels[idx].textContent === "") {
            celdasDisponibles.push({content, idx});
        }
    });
    if (celdasDisponibles.length === 0) return;
    // Elegir una celda al azar
    let {content, idx} = celdasDisponibles[Math.floor(Math.random() * celdasDisponibles.length)];
    // Elegir un número par disponible al azar
    let opciones = Array.from(content.options).filter(opt => opt.value && arrayPar.includes(parseInt(opt.value)));
    if (opciones.length === 0) return;
    let opcion = opciones[Math.floor(Math.random() * opciones.length)];
    // Simular la jugada
    content.value = opcion.value;
    // Disparar el evento change
    content.dispatchEvent(new Event('change'));
}

function conectarSocket() {
    socket = io('http://localhost:3000');
    socket.on('unido', (numJugador) => {
        soyJugador = numJugador;
        onlineMsg.textContent = `Conectado como jugador ${numJugador === 1 ? 'Impar' : 'Par'}. Esperando al otro jugador...`;
        onlineListo = false;
        mostrarTableroOnline(false);
    });
    socket.on('sala-llena', () => {
        onlineMsg.textContent = 'La sala ya está llena.';
        onlineListo = false;
        mostrarTableroOnline(false);
    });
    socket.on('actualizar-tablero', (estadoTablero) => {
        aplicarEstadoTablero(estadoTablero);
    });
    socket.on('juego-listo', () => {
        onlineMsg.textContent = '¡Ambos jugadores conectados! Puedes empezar a jugar.';
        onlineListo = true;
        mostrarTableroOnline(true);
    });
    socket.on('actualizar-turno', (turno) => {
        playerTurn = (turno === 1);
        jugadorEfectoHover();
    });
}

function generarCodigoSala() {
    return 'sala' + Math.floor(Math.random() * 10000);
}

// Inicializar marcador al cargar
resetMarcador();

// Estado del tablero para sincronizar (puedes adaptar esto a tu estructura)
function obtenerEstadoTablero() {
    return Array.from(labels).map(label => label.textContent);
}
function aplicarEstadoTablero(estado) {
    if (!estado) return;
    labels.forEach((label, i) => {
        label.textContent = estado[i] || "";
    });
}

// Cuando el jugador hace un movimiento:
function notificarMovimiento() {
    if (modoJuego === 'online' && socket && codigoSala) {
        socket.emit('movimiento', {
            codigo: codigoSala,
            estadoTablero: obtenerEstadoTablero(),
            turno: playerTurn ? 1 : 2
        });
    }
}

// Llama a notificarMovimiento() después de cada jugada válida

// Al recibir un movimiento del otro jugador:
if (socket) {
    socket.on('actualizar-tablero', (estadoTablero) => {
        aplicarEstadoTablero(estadoTablero);
        // Aquí puedes actualizar playerTurn y el UI según el turno recibido
    });
    socket.on('actualizar-turno', (turno) => {
        playerTurn = (turno === 1);
        jugadorEfectoHover();
        // Actualiza el UI del turno
    });
}

if (socket) {
    socket.on('juego-listo', () => {
        onlineMsg.textContent = '¡Ambos jugadores conectados! Puedes empezar a jugar.';
        // Aquí puedes mostrar el tablero y habilitar la jugada
    });
}