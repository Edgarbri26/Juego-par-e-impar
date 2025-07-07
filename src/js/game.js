const contents = document.querySelectorAll('.content');
const labels = document.querySelectorAll('.num');
let player = document.getElementById('player');
let board = document.getElementById('board')
let playerTurn = true;
let arrayImpar = [];
let arrayPar = [];
let modoJuego = null; // "pvp" o "cpu"
let mejorDe = 1;
let victoriasImpar = 0;
let victoriasPar = 0;

    // (Eliminado: resetGame() fuera de lugar)

    window.addEventListener('DOMContentLoaded', () => {
        resetGame(); // Inicializar el juego SOLO cuando el DOM esté listo
        document.getElementById('overlay').classList.remove('oculto'); // Mostrar modal al inicio
        document.body.classList.add('modal-abierto'); // Bloquear scroll de fondo
        jugadorEfectoHover();
        let reloadCount = parseInt(localStorage.getItem('reloadCount') || '0', 10);
        reloadCount += 1;
        localStorage.setItem('reloadCount', reloadCount);
        if (reloadCount === 2) {
            localStorage.removeItem('reloadCount');
            window.location.href = "inicio.html";
        }
        actualizarJugadorHeader();
    });

contents.forEach((content, index) => {
    updateCells(content); 

    content.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        if (selectedValue === "") return; // No hacer nada si es vacío
        const selectedNumber = parseInt(selectedValue);
        num = document.querySelectorAll('.num')[index];
        num.textContent = selectedNumber;
        event.target.value = "";
        if (playerTurn) {
            arrayImpar = arrayImpar.filter(num => num !== selectedNumber);
            let cell = event.target.parentElement;
            cell.classList.add("impar");
        } else {
            arrayPar = arrayPar.filter(num => num !== selectedNumber);
            let cell = event.target.parentElement;
            cell.classList.add("par");
        }
        // Deshabilitar completamente la celda
        let label = labels[index];
        label.removeEventListener("click", showSelect);
        label.style.pointerEvents = "none";
        event.target.classList.remove("show");
        event.target.disabled = true;
        validarGanador();
        playerTurn = !playerTurn;
        jugadorEfectoHover();
        updateCells();
        actualizarJugadorHeader();
        playerTurn ? player.textContent = "Jugador Impar" : player.textContent = "Jugador Par";
        const mensaje = document.getElementById('resultado');
        if (!mensaje.innerHTML == "") {
            player.innerText = `El Juego a Terminado`;
        }
        setTimeout(() => {
            if (modoJuego === "cpu" && !playerTurn && mensaje.innerHTML === "") {
                turnoPC();
            }
        }, 500);
    });
});



function updateCells() {
    let arrayActual = playerTurn ? arrayImpar : arrayPar;

    contents.forEach((content, idx) => {
        content.innerHTML = ""; // Limpiar el select
        // Eliminar mensaje previo si existe
        let msg = content.parentElement.querySelector('.mensaje-una-opcion');
        if (msg) msg.remove();
        // Eliminar clase de resaltado previa
        content.classList.remove('select-una-opcion');
        arrayActual.forEach((num, idx) => {
            let newNum = document.createElement("option"); // Crear opción
            newNum.value = num;
            newNum.textContent = num; // Texto visible
            content.appendChild(newNum); // Agregar al select
        });
        // Si solo queda una opción, resaltar y mostrar mensaje
        if (arrayActual.length === 1) {
            content.classList.add('select-una-opcion');
            let aviso = document.createElement('div');
            aviso.className = 'mensaje-una-opcion';
            aviso.textContent = 'Solo queda este número disponible. Haz clic para confirmar.';
            aviso.style.fontSize = '0.85rem';
            aviso.style.color = '#fbbf24';
            aviso.style.textAlign = 'center';
            aviso.style.marginTop = '0.3rem';
            content.parentElement.appendChild(aviso);
        }
    });   
}



function resetGame() {
    // Ocultar la línea ganadora y el modal de ganador de ronda
    const linea = document.getElementById('linea-ganadora');
    if (linea) linea.innerHTML = '';
    ocultarModalGanador();
    let modalFinal = document.getElementById('mensaje-ganador-final');
    if (modalFinal) modalFinal.remove();

    playerTurn = true;
    arrayImpar = ["", 1, 3, 5, 7, 9];
    arrayPar = ["", 2, 4, 6, 8];

    contents.forEach((content) => {
        content.innerHTML = ""; // Limpiar el select
        content.classList.remove("show"); // Ocultar el select
        updateCells(content); // Llamar a la función para actualizar las celdas
    });

    const mensaje = document.getElementById("resultado");
    mensaje.innerHTML = ""; // Limpiar el mensaje de resultado

    labels.forEach((label, idx) => {
        label.textContent = ""; // Limpiar el número en la celda
        label.addEventListener("click", showSelect); // Reagregar el evento click
        label.style.pointerEvents = "auto";
        if (contents[idx]) contents[idx].disabled = false;
    });

    player.textContent = "Jugador Impar";

    let contenCells = document.querySelectorAll('.cell');
    contenCells.forEach((cell) => {
        cell.classList.remove("impar"); // Limpiar la clase de celda impar
        cell.classList.remove("par"); // Limpiar la clase de celda par
    });

    actualizarJugadorHeader();
    // Si es la primera partida de la serie, reiniciar los contadores
    if (typeof resetGame.reiniciarSerie === 'undefined' || resetGame.reiniciarSerie) {
        victoriasImpar = 0;
        victoriasPar = 0;
        actualizarMarcadorSerie();
        resetGame.reiniciarSerie = false;
    }
}



function showSelect(event) {
    let label = event.currentTarget; // Obtiene el label que fue clickeado

    let selectId = label.getAttribute("for"); // Obtiene el ID del select vinculado
    let select = document.getElementById(selectId); // Accede al select por su ID
    
    contents.forEach((content) => {
        content.classList.remove("show"); // Ocultar el select
    });

    if (select) { // Verifica que el select exista
        select.classList.add("show"); // Aplicar la clase que lo hace visible
        select.size = select.options.length; // Expande el menú desplegable
        select.focus(); // Enfoca el select automáticamente
    }
    
}


function validarGanador() {
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
            if (winner === "Impar") {
                victoriasImpar++;
            } else {
                victoriasPar++;
            }
            actualizarMarcadorSerie();
            dibujarLineaGanadora(combo, winner);
            mostrarModalGanador(winner);
            hayGanador = true;
            const Cambiartexto = document.getElementById('btn-reset');
            Cambiartexto.innerText =`Volver a jugar`;

            labels.forEach((label) => {
              label.removeEventListener("click", showSelect);
            });
            // Verificar si alguien ya ganó la serie
            setTimeout(verificarGanadorSerie, 1200);
        }
    });

    // Si no hay ganador y todas las celdas tienen valor, es empate
    if (!hayGanador && celdas.slice(1).every(val => val !== null)) {
        actualizarMarcadorSerie();
        mostrarModalGanador("Empate");
        const Cambiartexto = document.getElementById('btn-reset');
        Cambiartexto.innerText =`Volver a jugar`;
        // No sumar puntos en empate, pero verificar si hay ganador de la serie (por si mejor de 1)
        setTimeout(verificarGanadorSerie, 1200);
    }
}

function mostrarModalGanador(ganador) {
    // Elimina cualquier modal anterior
    let modalExistente = document.getElementById('mensaje-ganador');
    if (modalExistente) modalExistente.remove();
    // Crea el modal
    const modal = document.createElement('div');
    modal.id = 'mensaje-ganador';
    modal.className = 'mensaje-ganador ' + (ganador === 'Par' ? 'par' : ganador === 'Impar' ? 'impar' : 'empate');
    let mensaje = '';
    if (ganador === 'Empate') {
        mensaje = '🤝 ¡La partida ha terminado en empate!';
    } else if (ganador === 'Par') {
        mensaje = '🎉 ¡El jugador Par ha ganado la partida! 🎉';
    } else {
        mensaje = '🎉 ¡El jugador Impar ha ganado la partida! 🎉';
    }
    // Verificar si ya hay ganador de la serie
    let necesario = Math.ceil(mejorDe / 2);
    let hayGanadorSerie = (victoriasImpar >= necesario || victoriasPar >= necesario);
    let botonSiguiente = '';
    if (!hayGanadorSerie) {
        botonSiguiente = '<button class="btn-siguiente-ronda" onclick="siguienteRonda()">▶ Siguiente ronda</button>';
    }
    modal.innerHTML = `<h2>${mensaje}</h2>${botonSiguiente}`;
    document.body.appendChild(modal);
    // Agregar el CSS del botón si no existe
    if (!document.getElementById('css-btn-siguiente-ronda')) {
        const style = document.createElement('style');
        style.id = 'css-btn-siguiente-ronda';
        style.innerHTML = `
        .btn-siguiente-ronda {
            display: block;
            margin: 2rem auto 0 auto;
            background: #22c55e;
            color: #fff;
            font-size: 1.3rem;
            font-weight: bold;
            border: none;
            border-radius: 10px;
            padding: 0.8rem 2.5rem;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(34,197,94,0.15);
            transition: background 0.2s, transform 0.2s;
        }
        .btn-siguiente-ronda:hover {
            background: #16a34a;
            transform: scale(1.05);
        }
        `;
        document.head.appendChild(style);
    }
}

function siguienteRonda() {
    ocultarModalGanador();
    // Solo reiniciar el tablero, no el marcador de la serie
    resetGame.reiniciarSerie = false;
    resetGame();
}

function ocultarModalGanador() {
    let modal = document.getElementById('mensaje-ganador');
    if (modal) modal.remove();
}

function jugadorEfectoHover() {
    const celdas = document.querySelectorAll('.cell');
    // Elimina cualquier clase de hover previa
    celdas.forEach(cell => {
        cell.classList.remove('hover-impar', 'hover-par');
    });

    // Aplica hover solo a celdas vacías (sin número)
    labels.forEach((label, idx) => {
        if (!label.textContent) {
            if (playerTurn) {
                celdas[idx].classList.add('hover-impar');
            } else {
                celdas[idx].classList.add('hover-par');
            }
        }
    });
}

function seleccionarModo(modo) {
    modoJuego = modo;
    // Leer el valor del selector mejorDe
    const selectMejorDe = document.getElementById('mejorDe');
    mejorDe = parseInt(selectMejorDe.value, 10);
    document.getElementById('overlay').classList.add('oculto'); // Ocultar modal
    document.body.classList.remove('modal-abierto'); // Quitar clase para permitir scroll
    resetGame.reiniciarSerie = true;
    resetGame();
}
function ocultarModal() {
    document.getElementById('modalJugador').classList.add('oculto'); // Ocultar modal
    document.body.classList.remove('modal-abierto'); // Quitar clase para permitir scroll
    resetGame();
}
window.seleccionarModo = seleccionarModo; // Para acceso desde HTML

function turnoPC() {
    // La PC es el jugador PAR
    if (!playerTurn && modoJuego === "cpu") {
        let celdasDisponibles = [];
        labels.forEach((label, idx) => {
            if (!label.textContent) celdasDisponibles.push(idx);
        });
        if (celdasDisponibles.length === 0) return;
        let idx = celdasDisponibles[Math.floor(Math.random() * celdasDisponibles.length)];
        let select = contents[idx];
        let opciones = Array.from(select.options).map(opt => parseInt(opt.value)).filter(n => n);
        if (opciones.length === 0) return;
        let numElegido = opciones[Math.floor(Math.random() * opciones.length)];
        select.value = numElegido;
        select.dispatchEvent(new Event('change'));
    }
}

function dibujarLineaGanadora(combo, ganador) {
    const linea = document.getElementById('linea-ganadora');
    if (!linea) return;
    linea.innerHTML = '';
    // Determinar el color según el ganador
    let color = ganador === 'Par' ? '#0d6efd' : '#e11d48'; // Azul para par, rojo para impar
    let style = "position:absolute; z-index:3000; opacity:0.85; background:" + color + ";";
    let claseAnim = '';
    switch (combo.toString()) {
        case '1,2,3': // Fila superior
            style += ' top:16.5%; left:0; width:0; height:8px;';
            claseAnim = 'linea-animada-horizontal';
            break;
        case '4,5,6': // Fila central
            style += ' top:50%; left:0; width:0; height:8px; transform:translateY(-50%);';
            claseAnim = 'linea-animada-horizontal';
            break;
        case '7,8,9': // Fila inferior
            style += ' bottom:16.5%; left:0; width:0; height:8px;';
            claseAnim = 'linea-animada-horizontal';
            break;
        case '1,4,7': // Columna izquierda
            style += ' left:16.5%; top:0; width:8px; height:0;';
            claseAnim = 'linea-animada-vertical';
            break;
        case '2,5,8': // Columna central
            style += ' left:50%; top:0; width:8px; height:0; transform:translateX(-50%);';
            claseAnim = 'linea-animada-vertical';
            break;
        case '3,6,9': // Columna derecha
            style += ' right:16.5%; top:0; width:8px; height:0;';
            claseAnim = 'linea-animada-vertical';
            break;
        case '1,5,9': // Diagonal principal
            style += ' left:0; top:0; width:0; height:8px; transform:translateY(-50%) rotate(45deg);';
            claseAnim = 'linea-animada-diagonal';
            break;
        case '3,5,7': // Diagonal secundaria
            style += ' left:0; bottom:0; width:0; height:8px; transform:translateY(50%) rotate(-45deg);';
            claseAnim = 'linea-animada-diagonal';
            break;
        default:
            return;
    }
    linea.innerHTML = `<div class='${claseAnim}' style="${style}; transform-origin: left center;"></div>`;
    setTimeout(() => {
        const animada = linea.querySelector('div');
        if (animada) animada.classList.add('mostrar');
    }, 10);
}

function actualizarJugadorHeader() {
    const jugadorSpan = document.getElementById('jugador-impar');
    if (playerTurn) {
        jugadorSpan.textContent = 'Impar';
        jugadorSpan.style.color = '#e11d48';
    } else {
        jugadorSpan.textContent = 'Par';
        jugadorSpan.style.color = '#0d6efd';
    }
}

function verificarGanadorSerie() {
    let necesario = Math.floor(mejorDe / 2) + 1;
    if (victoriasImpar >= necesario) {
        mostrarModalGanadorFinal('Impar');
        resetGame.reiniciarSerie = true;
    } else if (victoriasPar >= necesario) {
        mostrarModalGanadorFinal('Par');
        resetGame.reiniciarSerie = true;
    }
}

function mostrarModalGanadorFinal(ganador) {
    let modalExistente = document.getElementById('mensaje-ganador-final');
    if (modalExistente) modalExistente.remove();
    const modal = document.createElement('div');
    modal.id = 'mensaje-ganador-final';
    modal.className = 'mensaje-ganador-final ' + (ganador === 'Par' ? 'par' : 'impar');
    let mensaje = '';
    if (ganador === 'Par') {
        mensaje = '🏆 ¡El jugador Par ha ganado la serie! 🏆';
    } else {
        mensaje = '🏆 ¡El jugador Impar ha ganado la serie! 🏆';
    }
    // Depuración
    console.log('Mostrando modal ganador final con botones');
    modal.innerHTML = `<h2>${mensaje}</h2>
        <div class="botones-final">
            <button class='btn-volver-inicio' onclick="volverAlInicio()">Volver al inicio</button>
            <button class='btn-revancha' onclick="revancha()">Revancha</button>
        </div>`;
    document.body.appendChild(modal);
    // Agregar el CSS de los botones si no existe
    if (!document.getElementById('css-btn-volver-inicio')) {
        const style = document.createElement('style');
        style.id = 'css-btn-volver-inicio';
        style.innerHTML = `
        .botones-final {
            text-align: center;
        }
        .btn-volver-inicio, .btn-revancha {
            display: inline-block;
            margin: 2rem 1rem 0 1rem;
            background: #3b82f6;
            color: #fff;
            font-size: 1.3rem;
            font-weight: bold;
            border: none;
            border-radius: 10px;
            padding: 0.8rem 2.5rem;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(59,130,246,0.15);
            transition: background 0.2s, transform 0.2s;
        }
        .btn-volver-inicio:hover, .btn-revancha:hover {
            background: #2563eb;
            transform: scale(1.05);
        }
        .btn-revancha {
            background: #22c55e;
        }
        .btn-revancha:hover {
            background: #16a34a;
        }
        `;
        document.head.appendChild(style);
    }
}

function revancha() {
    let modal = document.getElementById('mensaje-ganador-final');
    if (modal) modal.remove();
    resetGame.reiniciarSerie = true;
    resetGame();
}

function volverAlInicio() {
    let modal = document.getElementById('mensaje-ganador-final');
    if (modal) modal.remove();
    // Mostrar el modal de selección de modo
    document.getElementById('overlay').classList.remove('oculto');
    document.body.classList.add('modal-abierto');
}

function actualizarMarcadorSerie() {
    let marcador = document.getElementById('marcador-serie');
    if (!marcador) {
        marcador = document.createElement('div');
        marcador.id = 'marcador-serie';
        marcador.style.textAlign = 'center';
        marcador.style.fontWeight = 'bold';
        marcador.style.fontSize = '1.2rem';
        marcador.style.margin = '1rem auto';
        document.querySelector('main.container').insertBefore(marcador, document.querySelector('.game-section'));
    }
    marcador.innerHTML = `Marcador de la serie: <span style='color:#e11d48'>Impar</span> ${victoriasImpar} - ${victoriasPar} <span style='color:#0d6efd'>Par</span> <br> (Mejor de ${mejorDe})`;
}

// Refuerza el z-index del modal de ganador final en el CSS
if (!document.getElementById('css-modal-ganador-final')) {
    const style = document.createElement('style');
    style.id = 'css-modal-ganador-final';
    style.innerHTML = `
    .mensaje-ganador-final {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: #fff;
        font-size: 2.2rem;
        font-weight: bold;
        animation: fadeInScale 0.5s;
    }
    `;
    document.head.appendChild(style);
}