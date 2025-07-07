<?php
  $DATABASE_HOST = 'localhost';
  $DATABASE_USER = 'root';
  $DATABASE_PASS = '12345';
  $DATABASE_NAME = 'juegoparimpar';

  // conexion a la base de datos
  $conexion = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
  if (mysqli_connect_error()) {
    // si se encuentra error en la conexión
    exit('Fallo en la conexión de MySQL:' . mysqli_connect_error());
  }
?>