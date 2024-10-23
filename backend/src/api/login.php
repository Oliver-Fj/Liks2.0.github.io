<?php
// Habilitar visualización de errores para debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Headers necesarios
header("Access-Control-Allow-Origin: https://oliver-fj.github.io/Liks2.0.github.io"");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Manejar solicitud OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar método HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Método no permitido"]);
    exit();
}

// Incluir archivos necesarios
require_once dirname(__DIR__) . '/config/Database.php';
require_once dirname(__DIR__) . '/models/User.php';

try {
    // Obtener datos POST
    $data = json_decode(file_get_contents("php://input"));
    
    // Log para debugging
    error_log("Datos recibidos: " . print_r($data, true));

    if (!$data || !isset($data->username) || !isset($data->password)) {
        throw new Exception("Datos incompletos");
    }

    // Crear conexión a la base de datos
    $database = new Database();
    $db = $database->getConnection();
    
    // Crear instancia de usuario
    $user = new User($db);
    
    // Intentar login
    if ($user->login($data->username, $data->password)) {
        // Iniciar sesión
        session_start();
        $_SESSION['user_id'] = $user->id;
        $_SESSION['username'] = $user->username;
        $_SESSION['is_admin'] = true;

        // Enviar respuesta exitosa
        http_response_code(200);
        echo json_encode([
            "message" => "Login exitoso",
            "isAdmin" => true,
            "username" => $user->username
        ]);
    } else {
        throw new Exception("Credenciales inválidas");
    }
} catch (Exception $e) {
    error_log("Error en login: " . $e->getMessage());
    http_response_code(401);
    echo json_encode([
        "message" => "Error en el inicio de sesión",
        "error" => $e->getMessage()
    ]);
}
?>