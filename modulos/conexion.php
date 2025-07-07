<?php
  $DATABASE_HOST = 'bjhfosqcyrygcuze7pil-mysql.services.clever-cloud.com';
  $DATABASE_USER = 'u0c6tqlkz9o2nh8z';
  $DATABASE_PASS = 'JloGvFtiOJnsY92YeeEq';
  $DATABASE_NAME = 'bjhfosqcyrygcuze7pil';

  // conexion a la base de datos
  $conexion = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
  if (mysqli_connect_error()) {
    // si se encuentra error en la conexión
    exit('Fallo en la conexión de MySQL:' . mysqli_connect_error());
  }
?>