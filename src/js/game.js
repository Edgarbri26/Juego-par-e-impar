const contents = document.querySelectorAll('.content');
let player = document.querySelectorAll('.player');
let playerTurn = true;
let arrayImpar = ["",1, 3, 5, 7, 9];
let arrayPar = ["",2, 4, 6, 8];

contents.forEach((content, index) => {
    updateCells(content); 

    content.addEventListener('change', (event) => {
        const selectedValue = parseInt(event.target.value);
        num = document.querySelectorAll('.num')[index];
        num.textContent = selectedValue; // Actualizar el número en la celda
        event.target.value = ""; // Limpiar el select
        if (playerTurn) {
            arrayImpar = arrayImpar.filter(num => num !== selectedValue);
            let cell = event.target.parentElement;
            cell.classList.add("impar");
        } else {
            arrayPar = arrayPar.filter(num => num !== selectedValue);
            let cell = event.target.parentElement;
            cell.classList.add("par");
        }

        playerTurn? player.textContent = "Jugador Impar" : player.textContent = "Jugador Par"; 

        playerTurn = !playerTurn; // Cambiar turno
        updateCells();

        //para ocultar el select
        event.target.classList.add("hiden");
    });
});

function updateCells() {
    let arrayActual = playerTurn ? arrayImpar : arrayPar;
    console.log(arrayActual);

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

