<?php
// Aquí puedes implementar la lógica para verificar si el usuario está autenticado
// Por ejemplo, verificar si existe una sesión válida

session_start();

if(isset($_SESSION['user_id'])){
    // Usuario autenticado
    http_response_code(200);
    echo json_encode(array("isAdmin" => true, "message" => "Usuario autenticado"));
} else {
    // Usuario no autenticado
    http_response_code(401);
    echo json_encode(array("isAdmin" => false, "message" => "Usuario no autenticado"));
}
?>