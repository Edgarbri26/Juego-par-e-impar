<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css">
  <title>Document</title>
</head>

<body>

  <div class="container">
    <div class="row mt-3">
      <div class="col-md-12">
        <table class="table table-striped table-bordered mt-3">
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

      </div>
    </div>
  </div>

</body>
<script src="	https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"></script>
<script>
  window.onload = function() {
    listarRanking()
  }
  function listarRanking() {
    
    fetch('modulos/Listaranking.php')
      .then(response => response.json())
      .then(respuesta => {
        Listaranking = respuesta.data;
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

</html>