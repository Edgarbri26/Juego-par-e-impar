<?php
// Incluir archivo de conexión
include './conexion.php';

// Obtener datos JSON del request
$data = json_decode(file_get_contents("php://input"), true);

// Verificar si se recibieron datos
if (!$data) {
    echo json_encode(array('success' => false, 'message' => 'No se recibieron datos'));
    exit;
}

// Extraer nombres de jugadores
$nombreJugadorPar = trim($data['nombreJugadorPar'] ?? '');
$nombreJugadorImpar = trim($data['nombreJugadorImpar'] ?? '');

// Validar que los nombres no estén vacíos
if (empty($nombreJugadorPar) || empty($nombreJugadorImpar)) {
    echo json_encode(array('success' => false, 'message' => 'Los nombres de los jugadores son requeridos'));
    exit;
}

/**
 * Verifica si un jugador ya existe en la base de datos
 * @param string $nombre Nombre del jugador
 * @param mysqli $conexion Conexión a la base de datos
 * @return bool True si el jugador existe, False si no
 */
function verificarJugador($nombre, $conexion) {
    $stmt = $conexion->prepare("SELECT id FROM jugadores WHERE nombre = ?");
    if (!$stmt) {
        return false;
    }
    
    $stmt->bind_param("s", $nombre);
    $stmt->execute();
    $result = $stmt->get_result();
    $existe = $result->num_rows > 0;
    $stmt->close();
    
    return $existe;
}

/**
 * Inserta un nuevo jugador en la base de datos
 * @param string $nombre Nombre del jugador
 * @param mysqli $conexion Conexión a la base de datos
 * @return bool True si se insertó correctamente, False si hubo error
 */
function insertarJugador($nombre, $conexion) {
    $stmt = $conexion->prepare("INSERT INTO jugadores(nombre) VALUES(?)");
    if (!$stmt) {
        return false;
    }
    
    $stmt->bind_param("s", $nombre);
    $resultado = $stmt->execute();
    $stmt->close();
    
    return $resultado;
}

// Procesar jugador par
$jugadorParExiste = verificarJugador($nombreJugadorPar, $conexion);
if (!$jugadorParExiste) {
    if (!insertarJugador($nombreJugadorPar, $conexion)) {
        echo json_encode(array('success' => false, 'message' => 'Error al insertar jugador par'));
        exit;
    }
}

// Procesar jugador impar
$jugadorImparExiste = verificarJugador($nombreJugadorImpar, $conexion);
if (!$jugadorImparExiste) {
    if (!insertarJugador($nombreJugadorImpar, $conexion)) {
        echo json_encode(array('success' => false, 'message' => 'Error al insertar jugador impar'));
        exit;
    }
}

// Respuesta exitosa
$response = array(
    'success' => true,
    'message' => 'Jugadores procesados correctamente',
    'data' => array(
        'jugadorPar' => array(
            'nombre' => $nombreJugadorPar,
            'existe' => $jugadorParExiste
        ),
        'jugadorImpar' => array(
            'nombre' => $nombreJugadorImpar,
            'existe' => $jugadorImparExiste
        )
    )
);

echo json_encode($response);
?>