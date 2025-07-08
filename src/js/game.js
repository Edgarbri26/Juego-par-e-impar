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
let JugadoresValidados = [];
let nombreJugadorPar = '';
let nombreJugadorImpar = '';

    // window.addEventListener('DOMContentLoaded', () => {
    //     resetGame(); // Inicializar el juego SOLO cuando el DOM esté listo
    //     document.getElementById('overlay').classList.remove('oculto'); // Mostrar modal al inicio
    //     document.body.classList.add('modal-abierto'); // Bloquear scroll de fondo
    //     jugadorEfectoHover();
    //     let reloadCount = parseInt(localStorage.getItem('reloadCount') || '0', 10);
    //     reloadCount += 1;
    //     localStorage.setItem('reloadCount', reloadCount);
    //     if (reloadCount === 2) {
    //         localStorage.removeItem('reloadCount');
    //         window.location.href = "inicio.html";
    //     }
    //     actualizarJugadorHeader();
    // });

   function IngresarJugador(){
    let nombrePar = document.getElementById('nombrePar').value;
    let nombreImpar = document.getElementById('nombreImpar').value;

    if(nombrePar == '' || nombreImpar == ''){
        const divResultado = document.getElementById('resultadoDelFormJugadores');
      divResultado.innerHTML = '<div style="color: red;" role="alert">Por favor, complete todos los campos.</div>';
      return;
    }

    fetch('modulos/ingresarJugadores.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombreJugadorPar: nombrePar,
        nombreJugadorImpar: nombreImpar
      })
    })
    .then(response => response.json())
    .then(respuesta => {
      if (respuesta.success) {
        // Guardar los nombres de los jugadores globalmente
        nombreJugadorPar = nombrePar;
        nombreJugadorImpar = nombreImpar;
        
        // Actualizar las traducciones con los nombres reales
        actualizarTraduccionesConNombres();
        
        // Ocultar modal y actualizar la interfaz
        ocultarModal();
        
        // Actualizar el marcador y header del jugador
        actualizarMarcadorSerie();
        actualizarJugadorHeader();
        
      } else {
        alert('Error al ingresar jugadores');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
   }

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
            player.innerText = `El Juego ha Terminado`;
        }

        if (modoJuego === "cpu" && !playerTurn && mensaje.innerHTML === "") {
            console.log('Llamando a turnoPC()');
            setTimeout(() => {
                turnoPC();
            }, 500);
        }
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
    });   
}



function resetGame() {
    // Ocultar la línea ganadora y el modal de ganador de ronda
    const linea = document.getElementById('linea-ganadora');
    if (linea) linea.innerHTML = '';
    ocultarModalGanador();


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

    // Usar nombre real del jugador impar si está disponible
    if (nombreJugadorImpar) {
        player.textContent = nombreJugadorImpar;
    } else {
        player.textContent = "Jugador Impar";
    }

    let contenCells = document.querySelectorAll('.cell');
    contenCells.forEach((cell) => {
        cell.classList.remove("impar"); // Limpiar la clase de celda impar
        cell.classList.remove("par"); // Limpiar la clase de celda par
    });

    actualizarJugadorHeader();
    jugadorEfectoHover();
    actualizarNumerosDisponibles();
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
    // Esperar 1 segundo antes de mostrar la modal
    setTimeout(() => {
        const modal = document.createElement('div');
        modal.id = 'mensaje-ganador';
        modal.className = 'mensaje-ganador ' + (ganador === 'Par' ? 'par' : ganador === 'Impar' ? 'impar' : 'empate');
        const idioma = getIdiomaActual();
        let mensaje = '';
        // Verificar si ya hay ganador de la serie
        let necesario = Math.ceil(mejorDe / 2);
        let hayGanadorSerie = (victoriasImpar >= necesario || victoriasPar >= necesario);
        let botonSiguiente = '';


        if (hayGanadorSerie) {
            if (ganador === 'Par') {
                mensaje = traduccionesJuego[idioma].ganadorSeriePar ;
            } else {
                mensaje = traduccionesJuego[idioma].ganadorSerieImpar;
            }

            
            botonRevancha = `<button class="btn-revancha" onclick="revancha()">${traduccionesJuego[idioma].btnRevancha}</button>`;
            botonVolver = `<button class="btn-volver" onclick="volverAlInicio()">${traduccionesJuego[idioma].btnVolver}</button>`;
            modal.innerHTML = `<h2>${mensaje}</h2>
                <div class="botones-modal">
                    ${botonRevancha}
                    ${botonVolver}
                </div>`;
        }else{
            if (ganador === 'Empate') {
                mensaje = traduccionesJuego[idioma].empate;
            } else if (ganador === 'Par') {
                mensaje = traduccionesJuego[idioma].ganadorPar;
            } else {
                mensaje = traduccionesJuego[idioma].ganadorImpar;
            }

            botonSiguiente = `<button class="btn-siguiente-ronda" onclick="siguienteRonda()">${traduccionesJuego[idioma].btnSiguiente}</button>`;
            botonVolver = `<button class="btn-volver" onclick="volverAlInicio()">${traduccionesJuego[idioma].btnVolver}</button>`;
            modal.innerHTML = `<h2>${mensaje}</h2>
                <div class="botones-modal">
                    ${botonSiguiente}
                    ${botonVolver}
                </div>`;
        }
        // Solo mostrar mensaje y botón de siguiente ronda si aplica
        document.body.appendChild(modal);
    }, 1000);
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
    modoJuego = modo; // Asegura que se setea correctamente
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
        actualizarNumerosDisponibles();
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

// --- Traducciones globales ---
const traduccionesJuego = {
    es: {
        marcador: 'Marcador de la serie:',
        impar: 'Impar',
        par: 'Par',
        mejorDe: '(Mejor de',
        jugador: 'Jugador',
        jugadorImpar: 'Jugador Impar',
        jugadorPar: 'Jugador Par',
        ganadorImpar: '🎉 ¡El jugador Impar ha ganado la partida! 🎉',
        ganadorPar: '🎉 ¡El jugador Par ha ganado la partida! 🎉',
        empate: '🤝 ¡La partida ha terminado en empate!',
        btnSiguiente: '▶ Siguiente ronda',
        btnVolver: 'Volver al inicio',
        btnRevancha: 'Revancha',
        ganadorSerieImpar: '🏆 ¡El jugador Impar ha ganado la serie! 🏆',
        ganadorSeriePar: '🏆 ¡El jugador Par ha ganado la serie! 🏆',
        numerosDisponibles: 'Números disponibles:'
    },
    en: {
        marcador: 'Series score:',
        impar: 'Odd',
        par: 'Even',
        mejorDe: '(Best of',
        jugador: 'Player',
        jugadorImpar: 'Odd Player',
        jugadorPar: 'Even Player',
        ganadorImpar: '🎉 Odd Player has won the game! 🎉',
        ganadorPar: '🎉 Even Player has won the game! 🎉',
        empate: '🤝 The game ended in a draw!',
        btnSiguiente: '▶ Next round',
        btnVolver: 'Back to start',
        btnRevancha: 'Rematch',
        ganadorSerieImpar: '🏆 Odd Player has won the series! 🏆',
        ganadorSeriePar: '🏆 Even Player has won the series! 🏆',
        numerosDisponibles: 'Available numbers:'
    }
};

function getIdiomaActual() {
    return localStorage.getItem('idioma') || 'es';
}

function actualizarTraduccionesConNombres() {
    const idioma = getIdiomaActual();
    
    // Actualizar traducciones con nombres reales si están disponibles
    if (nombreJugadorPar && nombreJugadorImpar) {
        traduccionesJuego[idioma].jugadorImpar = nombreJugadorImpar;
        traduccionesJuego[idioma].jugadorPar = nombreJugadorPar;
        traduccionesJuego[idioma].ganadorImpar = `🎉 ¡${nombreJugadorImpar} ha ganado la partida! 🎉`;
        traduccionesJuego[idioma].ganadorPar = `🎉 ¡${nombreJugadorPar} ha ganado la partida! 🎉`;
        traduccionesJuego[idioma].ganadorSerieImpar = `🏆 ¡${nombreJugadorImpar} ha ganado la serie! 🏆`;
        traduccionesJuego[idioma].ganadorSeriePar = `🏆 ¡${nombreJugadorPar} ha ganado la serie! 🏆`;
    }
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
    const idioma = getIdiomaActual();
    
    // Usar nombres reales si están disponibles, sino usar los genéricos
    const nombreImpar = nombreJugadorImpar || traduccionesJuego[idioma].impar;
    const nombrePar = nombreJugadorPar || traduccionesJuego[idioma].par;
    
    marcador.innerHTML = `${traduccionesJuego[idioma].marcador} <span style='color:#e11d48'>${nombreImpar}</span> ${victoriasImpar} - ${victoriasPar} <span style='color:#0d6efd'>${nombrePar}</span> <br> ${traduccionesJuego[idioma].mejorDe} ${mejorDe})`;
}

function actualizarJugadorHeader() {
    const jugadorSpan = document.getElementById('jugador-impar');
    const playerHeader = document.getElementById('player');
    const idioma = getIdiomaActual();
    if (!jugadorSpan || !playerHeader) return;
    
    // Usar nombres reales si están disponibles, sino usar los genéricos
    const nombreImpar = nombreJugadorImpar || traduccionesJuego[idioma].impar;
    const nombrePar = nombreJugadorPar || traduccionesJuego[idioma].par;
    
    if (playerTurn) {
        jugadorSpan.textContent = nombreImpar;
        jugadorSpan.style.color = '#e11d48';
        playerHeader.textContent = nombreImpar;
    } else {
        jugadorSpan.textContent = nombrePar;
        jugadorSpan.style.color = '#0d6efd';
        playerHeader.textContent = nombrePar;
    }
}

function actualizarNumerosDisponibles() {
    const contenedor = document.getElementById('numeros-disponibles');
    let numeros = playerTurn ? arrayImpar : arrayPar;
    // Filtra el string vacío si existe
    numeros = numeros.filter(n => n !== "");
    const idioma = getIdiomaActual();
    const label = traduccionesJuego[idioma] && traduccionesJuego[idioma].numerosDisponibles ? traduccionesJuego[idioma].numerosDisponibles : 'Números disponibles:';
    contenedor.textContent = label + ' ' + (numeros.length > 0 ? numeros.join(", ") : (idioma === 'en' ? 'None' : 'Ninguno'));
}

// --- Cambio de idioma dinámico ---
if (typeof window !== 'undefined') {
    const idiomaSelect = document.getElementById('idioma-select');
    if (idiomaSelect) {
        idiomaSelect.addEventListener('change', function() {
            actualizarMarcadorSerie();
            actualizarJugadorHeader();
            // Si hay modal de ganador de ronda abierto, actualizarlo
            const modalGanador = document.getElementById('mensaje-ganador');
            if (modalGanador) {
                // Detectar si fue empate, impar o par
                let texto = modalGanador.textContent;
                if (texto.includes('empate') || texto.includes('draw')) {
                    mostrarModalGanador('Empate');
                } else if (texto.includes('Par') || texto.includes('Even')) {
                    mostrarModalGanador('Par');
                } else {
                    mostrarModalGanador('Impar');
                }
            }
            // Si hay modal de ganador final abierto, actualizarlo
            const modalFinal = document.getElementById('mensaje-ganador-final');
            if (modalFinal) {
                // Detectar si fue impar o par
                let texto = modalFinal.textContent;
                if (texto.includes('Par') || texto.includes('Even')) {
                    mostrarModalGanadorFinal('Par');
                } else {
                    mostrarModalGanadorFinal('Impar');
                }
            }
        });
    }
    window.addEventListener('DOMContentLoaded', () => {
        // Actualizar traducciones con nombres reales si están disponibles
        actualizarTraduccionesConNombres();
        actualizarMarcadorSerie();
        actualizarJugadorHeader();
    });
}

function verificarGanadorSerie() {
    let necesario = Math.floor(mejorDe / 2) + 1;
    if (victoriasImpar >= necesario) {
        mostrarModalGanadorFinal('Impar');
        // NO reiniciar el juego aquí
        // resetGame.reiniciarSerie = true;
    } else if (victoriasPar >= necesario) {
        mostrarModalGanadorFinal('Par');
        // NO reiniciar el juego aquí
        // resetGame.reiniciarSerie = true;
    }
}

// function mostrarModalGanadorFinal(ganador) {
//     let modalExistente = document.getElementById('mensaje-ganador-final');
//     if (modalExistente) modalExistente.remove();
//     const modal = document.createElement('div');
//     modal.id = 'mensaje-ganador-final';
//     modal.className = 'mensaje-ganador-final ' + (ganador === 'Par' ? 'par' : 'impar');
//     const idioma = getIdiomaActual();
//     let mensaje = '';
//     if (ganador === 'Par') {
//         mensaje = traduccionesJuego[idioma].ganadorSeriePar;
//     } else {
//         mensaje = traduccionesJuego[idioma].ganadorSerieImpar;
//     }
//     modal.innerHTML = `<h2>${mensaje}</h2>
//         <div class="botones-final">
//             <button class='btn-volver-inicio' onclick="volverAlInicio()">${traduccionesJuego[idioma].btnVolver}</button>
//             <button class='btn-revancha' onclick="revancha()">${traduccionesJuego[idioma].btnRevancha}</button>
//         </div>`;
//     document.body.appendChild(modal);
//     // Refuerza el CSS de los botones si no existe
//     if (!document.getElementById('css-btn-volver-inicio')) {
//         const style = document.createElement('style');
//         style.id = 'css-btn-volver-inicio';
//         style.innerHTML = `
//         .botones-final {
//             text-align: center;
//             margin-top: 1.5rem;
//         }
//         .btn-volver-inicio, .btn-revancha {
//             display: inline-block;
//             margin: 0 1rem;
//             background: #3b82f6;
//             color: #fff;
//             font-size: 1.3rem;
//             font-weight: bold;
//             border: none;
//             border-radius: 10px;
//             padding: 0.8rem 2.5rem;
//             cursor: pointer;
//             box-shadow: 0 2px 8px rgba(59,130,246,0.15);
//             transition: background 0.2s, transform 0.2s;
//         }
//         .btn-volver-inicio:hover, .btn-revancha:hover {
//             background: #2563eb;
//             transform: scale(1.05);
//         }
//         .btn-revancha {
//             background: #22c55e;
//         }
//         .btn-revancha:hover {
//             background: #16a34a;
//         }
//         `;
//         document.head.appendChild(style);
//     }
// }

function revancha() {
    // Cerrar cualquier modal de ganador
    let modalFinal = document.getElementById('mensaje-ganador-final');
    if (modalFinal) modalFinal.remove();
    let modalRonda = document.getElementById('mensaje-ganador');
    if (modalRonda) modalRonda.remove();
    resetGame.reiniciarSerie = true;
    resetGame();
}

function volverAlInicio() {
    // Cerrar cualquier modal de ganador
    let modalFinal = document.getElementById('mensaje-ganador-final');
    if (modalFinal) modalFinal.remove();
    let modalRonda = document.getElementById('mensaje-ganador');
    if (modalRonda) modalRonda.remove();
    // Mostrar el modal de selección de modo
    document.getElementById('overlay').classList.remove('oculto');
    document.body.classList.add('modal-abierto');
}