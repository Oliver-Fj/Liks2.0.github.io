<?php
// Iniciar la sesión
session_start();

// Verificar si el usuario está autenticado
if(isset($_SESSION['user_id'])) {
    // Unset todas las variables de sesión
    $_SESSION = array();

    // Destruir la sesión
    session_destroy();

    // Destruir la cookie de sesión
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }

    // Establecer código de respuesta
    http_response_code(200);

    // Mostrar mensaje de éxito
    echo json_encode(array("message" => "Logout exitoso."));
} else {
    // Si no hay sesión activa
    http_response_code(400);
    echo json_encode(array("message" => "No hay sesión activa para cerrar."));
}
?>