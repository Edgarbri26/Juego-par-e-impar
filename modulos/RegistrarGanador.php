<?php
include './conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'No se recibieron datos']);
    exit;
}

$nombreGanador = trim($data['nombreGanador'] ?? '');

if (empty($nombreGanador)) {
    echo json_encode(['success' => false, 'message' => 'Nombre del ganador es requerido']);
    exit;
}

// Buscar el ID del jugador por nombre
$stmt = $conexion->prepare("SELECT id FROM jugadores WHERE nombre = ?");
$stmt->bind_param("s", $nombreGanador);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // Si no existe, crearlo
    $stmt_insert = $conexion->prepare("INSERT INTO jugadores (nombre) VALUES (?)");
    $stmt_insert->bind_param("s", $nombreGanador);
    if ($stmt_insert->execute()) {
        $idGanador = $stmt_insert->insert_id;
    } else {
        echo json_encode(['success' => false, 'message' => 'No se pudo crear el jugador ganador']);
        $stmt_insert->close();
        exit;
    }
    $stmt_insert->close();
} else {
    $row = $result->fetch_assoc();
    $idGanador = $row['id'];
}
$stmt->close();

// Insertar en la tabla partidas
$stmt2 = $conexion->prepare("INSERT INTO partidas (id_jugador_ganador) VALUES (?)");
$stmt2->bind_param("i", $idGanador);
$ok = $stmt2->execute();
$stmt2->close();

if ($ok) {
    echo json_encode(['success' => true, 'message' => 'Partida registrada correctamente', 'id_jugador_ganador' => $idGanador]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al registrar la partida']);
}
?>
