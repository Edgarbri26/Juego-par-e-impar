const contents = document.querySelectorAll('.content');
const labels = document.querySelectorAll('.num');
let player = document.getElementById('player');
let board = document.getElementById('board')
let playerTurn = true;
let arrayImpar = [];
let arrayPar = [];
let modoJuego = null; // "pvp" o "cpu"

    resetGame(); // Inicializar el juego

    window.addEventListener('DOMContentLoaded', () => {
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
    });

contents.forEach((content, index) => {
    updateCells(content); 

    content.addEventListener('change', (event) => {
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
        
        event.target.classList.remove("show"); // ocultAR el select
        
        playerTurn? player.textContent = "Jugador Impar" : player.textContent = "Jugador Par";
        const mensaje = document.getElementById('resultado');
        if (!mensaje.innerHTML == "") {
            player.innerText = `El Juego a Terminado`
        }
        label = labels[index];
        label.removeEventListener("click", showSelect); // Elimina el evento click para evitar múltiples activaciones
        // --- Si es modo CPU y es turno de la PC, que juegue ---
        setTimeout(() => {
            if (modoJuego === "cpu" && !playerTurn && mensaje.innerHTML === "") {
                turnoPC();
            }
        }, 500);
    });
});



function updateCells() {
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
    playerTurn = true;
    arrayImpar = ["",1, 3, 5, 7, 9];
    arrayPar = ["",2, 4, 6, 8];

    const Cambiartexto = document.getElementById('btn-reset');
    Cambiartexto.innerText =`Reiniciar`;

    contents.forEach((content) => {
        content.innerHTML = ""; // Limpiar el select
        content.classList.remove("show"); // Ocultar el select
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
            mostrarModalGanador(winner);
            hayGanador = true;
            const Cambiartexto = document.getElementById('btn-reset');
            Cambiartexto.innerText =`Volver a jugar`;

            labels.forEach((label) => {
              label.removeEventListener("click", showSelect);
            });
        }
    });

    // Si no hay ganador y todas las celdas tienen valor, es empate
    if (!hayGanador && celdas.slice(1).every(val => val !== null)) {
        mostrarModalGanador("Empate");
        const Cambiartexto = document.getElementById('btn-reset');
        Cambiartexto.innerText =`Volver a jugar`;
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
    modal.innerHTML = `<h2>${mensaje}</h2><button onclick="ocultarModalGanador(); resetGame();">Volver a jugar</button>`;
    document.body.appendChild(modal);
}

function ocultarModalGanador() {
    let modal = document.getElementById('mensaje-ganador');
    if (modal) modal.remove();
}

// Modifica resetGame para ocultar el modal si existe
const originalResetGame = resetGame;
resetGame = function() {
    ocultarModalGanador();
    originalResetGame();
}

// Agrega el CSS para el modal de ganador si no existe
(function(){
    if (!document.getElementById('css-mensaje-ganador')) {
        const style = document.createElement('style');
        style.id = 'css-mensaje-ganador';
        style.innerHTML = `
        .mensaje-ganador {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            color: #fff;
            font-size: 2.2rem;
            font-weight: bold;
            animation: fadeInScale 0.5s;
        }
        .mensaje-ganador.impar h2 { color: #e11d48; }
        .mensaje-ganador.par h2 { color: #2563eb; }
        .mensaje-ganador.empate h2 { color: #fbbf24; }
        .mensaje-ganador button {
            margin-top: 2rem;
            font-size: 1.2rem;
            padding: 0.7rem 2rem;
            border-radius: 8px;
            border: none;
            background: #fff;
            color: #222;
            cursor: pointer;
            font-weight: 600;
            transition: background 0.2s;
        }
        .mensaje-ganador button:hover {
            background: #f3f4f6;
        }
        @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.8);}
            to { opacity: 1; transform: scale(1);}
        }
        `;
        document.head.appendChild(style);
    }
})();

function jugadorEfectoHover() {
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

function seleccionarModo(modo) {
    modoJuego = modo;
    document.getElementById('overlay').classList.add('oculto'); // Ocultar modal
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