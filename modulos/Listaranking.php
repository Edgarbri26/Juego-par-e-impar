<?php
include "./conexion.php";

$sql = "SELECT DENSE_RANK() OVER (ORDER BY COUNT(p.id_jugador_ganador) DESC) AS ranking, j.nombre AS jugador, COUNT(p.id_jugador_ganador) AS victorias FROM partidas p INNER JOIN jugadores j ON p.id_jugador_ganador = j.id WHERE p.id_jugador_ganador IS NOT NULL GROUP BY p.id_jugador_ganador, j.nombre ORDER BY victorias DESC";
$result = mysqli_query($conexion, $sql);

$ranking = array();
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $roles[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode(array('success' => true, 'data' => $ranking));

?>
