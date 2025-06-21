const contents = document.querySelectorAll('.content');
const labels = document.querySelectorAll('.num');
let player = document.getElementById('player');
let board = document.getElementById('board')
let playerTurn = true;
let arrayImpar = [];
let arrayPar = [];

    resetGame(); // Inicializar el juego

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
            const mensaje = document.getElementById("resultado");
            mensaje.innerHTML = `<h2>El jugador ${winner} ha ganado la partida!</h2>`;
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
        const mensaje = document.getElementById("resultado");
        mensaje.innerHTML = `<h2>¡La partida ha terminado en empate!</h2>`;
        const Cambiartexto = document.getElementById('btn-reset');
        Cambiartexto.innerText =`Volver a jugar`;
    }
}


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