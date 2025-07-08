<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ranking | Par o Impar</title>
  <link rel="stylesheet" href="assets/output.css">
  <style>
    body {
      background: #181a20;
      color: #fff;
      font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
      min-height: 100vh;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }
    .ranking-header {
      margin-top: 2rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    .ranking-title {
      font-size: 2.5rem;
      font-weight: bold;
      letter-spacing: 1px;
      color: #60a5fa;
      text-shadow: 0 2px 8px rgba(59,130,246,0.15);
    }
    .table-container {
      background: #23272f;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.25);
      padding: 2rem 2.5rem;
      margin-bottom: 2rem;
      width: 100%;
      max-width: 600px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: transparent;
    }
    th, td {
      padding: 1rem 0.5rem;
      text-align: center;
    }
    th {
      background: #2563eb;
      color: #fff;
      font-size: 1.1rem;
      font-weight: 600;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    tr {
      background: #23272f;
      border-bottom: 1px solid #374151;
    }
    tr:last-child {
      border-bottom: none;
    }
    tr:hover {
      background: #1e293b;
      transition: background 0.2s;
    }
    .volver-container {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
    }
    .btn-volver {
      background: #3b82f6;
      color: #fff;
      font-size: 1.1rem;
      font-weight: bold;
      border: none;
      border-radius: 10px;
      padding: 0.8rem 2.5rem;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(59,130,246,0.15);
      transition: background 0.2s, transform 0.2s;
      display: inline-block;
    }
    .btn-volver:hover {
      background: #2563eb;
      transform: scale(1.05);
    }
  </style>
</head>

<body>
  <header class="ranking-header">
    <h1 class="ranking-title">Ranking de Jugadores</h1>
  </header>
  <main class="table-container">
    <table>
      <thead>
        <tr>
          <th>Ranking</th>
          <th>Jugador</th>
          <th>Victorias</th>
        </tr>
      </thead>
      <tbody id="tablaranking">
        <!-- Los datos se llenarán con JavaScript -->
      </tbody>
    </table>
    <div class="volver-container">
      <button class="btn-volver" onclick="window.location.href='index.php'">Volver al Inicio</button>
    </div>
  </main>

  <script>
    window.onload = function() {
      listarRanking()
    }
    function listarRanking() {
      fetch('modulos/Listaranking.php')
        .then(response => response.json())
        .then(respuesta => {
          if (respuesta.success) {
            var tbody = document.getElementById('tablaranking');
            tbody.innerHTML = '';
            respuesta.data.forEach(ranking => {
              var tr = document.createElement('tr');
              tr.innerHTML = `
                <td>${ranking.ranking}</td>
                <td>${ranking.jugador}</td>
                <td>${ranking.victorias}</td>  
              `;
              tbody.appendChild(tr);
            });
          } else {
            alert('Error al cargar los ranking.');
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  </script>
</body>

</html>