<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="src/css/game.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer">
  <title>Par impar</title>
</head>

<body>
  <div class="idioma-bar">
    <select id="idioma-select" class="idioma-select">
      <option value="es">🇪🇸 Español</option>
      <option value="en">🇬🇧 English</option>
    </select>
  </div>
  <!-- Modal de selección de modo de juego (estilo moderno) -->
  <div id="overlay" class="overlay">
    <div class="modal-modo-juego">
      <h2 class="modal-title" id="modal-title">Selecciona el modo de juego</h2>
      <div class="modal-options">
        <div class="option-card bg-green" onclick="seleccionarModo('cpu')">
          <div class="option-icon">
            <i class="fa-solid fa-robot icono" id="icono-cpu"></i>
          </div>
          <div class="option-text" id="text-cpu">Contra la PC</div>
        </div>
        <div class="option-card bg-blue" onclick="seleccionarModo('pvp')">
          <div class="option-icon">
            <i class="fa-solid fa-user-group icono" id="icono-pvp"></i>
          </div>
          <div class="option-text" id="text-pvp">Jugador vs Jugador</div>
        </div>
        <div class="option-card bg-purple option-disabled">
          <div class="option-icon">
            <i class="fa-solid fa-globe icono" id="icono-online"></i>
          </div>
          <div class="option-text" id="text-online">Modo Online</div>
        </div>
      </div>
      <div class="mejor-de-selector">
        <label for="mejorDe" class="mejor-de-label" id="label-mejor-de">¿Mejor de cuántas partidas?</label>
        <select id="mejorDe" class="mejor-de-select">
          <option value="1">1</option>
          <option value="3">3</option>
          <option value="5">5</option>
          <option value="7">7</option>
        </select>
      </div>
      <button type="button" class="btn-volver-inicio-modal" onclick="window.location.href='index.php'">
        Volver al home
      </button>
    </div>
  </div>

  <div id="modalJugador">
    <div class="modal-modo-juego">
      <h2 class="modal-title">Ingresar Jugadores</h2>
      <div class="modal-body">
        <div class="mb-3">
          <label for="nombrePar" class="form-label" style="font-size: 20px;">Nombre del Par:</label>
          <input type="text" class="form-control" id="nombrePar">
        </div>
        <div class="mb-3">
          <label for="nombreImpar" class="form-label" style="font-size: 20px;">Nombre del Impar:</label>
          <input type="text" class="form-control" id="nombreImpar">
        </div>
      </div>
      <div id="resultadoDelFormJugadores"></div>
      <div class="modal-footer" style="display: flex; flex-direction: row; justify-content: center; gap: 20px; ">
        <form action="juego.php">
          <button type="submit" class="btn btn-secondary">Cancelar</button>
        </form>
          <button type="button" onclick="IngresarJugador()">Iniciar juego</button>
      </div>
    </div>
  </div>

  <main class="container">
    <section class="game-section">
      <h2 class="player" id="player">
        Jugador <span id="jugador-impar">Impar</span>
      </h2>
      <div id="numeros-disponibles" style="margin-bottom: 1rem; text-align: center;"></div>
      <div id="board">
        <div id="linea-ganadora" class="linea-ganadora"></div>

        <div class="cell" id="c1">
          <select class="content hiden" name="cell1" id="cell1"></select>
          <label class="num" for="cell1"></label>
        </div>

        <div class="cell" id="c2">
          <select class="content hiden" name="cell2" id="cell2"></select>
          <label class="num" for="cell2"></label>
        </div>

        <div class="cell" id="c3">
          <select class="content hiden" name="cell3" id="cell3"></select>
          <label class="num" for="cell3"></label>
        </div>

        <div class="cell" id="c4">
          <select class="content hiden" name="cell4" id="cell4"></select>
          <label class="num" for="cell4"></label>
        </div>

        <div class="cell" id="c5">
          <select class="content hiden" name="cell5" id="cell5"></select>
          <label class="num" for="cell5"></label>
        </div>

        <div class="cell" id="c6">
          <select class="content hiden" name="cell6" id="cell6"></select>
          <label class="num" for="cell6"></label>
        </div>

        <div class="cell" id="c7">
          <select class="content hiden" name="cell7" id="cell7"></select>
          <label class="num" for="cell7"></label>
        </div>

        <div class="cell" id="c8">
          <select class="content hiden" name="cell8" id="cell8"></select>
          <label class="num" for="cell8"></label>
        </div>

        <div class="cell" id="c9">
          <select class="content hiden" name="cell9" id="cell9"></select>
          <label class="num" for="cell9"></label>
        </div>
      </div>

      <div id="resultado"></div>
    </section>
  </main>
  <script src="src/js/game.js"></script>
  <script>
    const traducciones = {
      es: {
        modalTitle: 'Selecciona el modo de juego',
        cpu: 'Contra la PC',
        pvp: 'Jugador vs Jugador',
        online: 'Modo Online',
        mejorDe: '¿Mejor de cuántas partidas?'
      },
      en: {
        modalTitle: 'Select game mode',
        cpu: 'Play vs Computer',
        pvp: 'Player vs Player',
        online: 'Online Mode',
        mejorDe: 'Best of how many rounds?'
      }
    };

    function aplicarTraduccionModal(idioma) {
      document.getElementById('modal-title').textContent = traducciones[idioma].modalTitle;
      document.getElementById('text-cpu').textContent = traducciones[idioma].cpu;
      document.getElementById('text-pvp').textContent = traducciones[idioma].pvp;
      document.getElementById('text-online').textContent = traducciones[idioma].online;
      document.getElementById('label-mejor-de').textContent = traducciones[idioma].mejorDe;
    }
    document.getElementById('idioma-select').addEventListener('change', function() {
      const idioma = this.value;
      localStorage.setItem('idioma', idioma);
      aplicarTraduccionModal(idioma);
    });
    window.addEventListener('DOMContentLoaded', () => {
      const idioma = localStorage.getItem('idioma') || 'es';
      document.getElementById('idioma-select').value = idioma;
      aplicarTraduccionModal(idioma);
    });
  </script>
</body>

</html>
