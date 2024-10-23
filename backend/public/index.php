<?php
header("Access-Control-Allow-Origin: https://oliver-fj.github.io/Liks2.0.github.io");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuración de errores para debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Log para debugging
error_log("Request URI inicial: " . $request_uri);

// Eliminar parámetros de consulta y normalizar la ruta
$request_uri = strtok($request_uri, '?');
$request_uri = rtrim($request_uri, '/');

// Si la URL no empieza con /api/, añadirlo
if (strpos($request_uri, '/api/') === false) {
    $request_uri = '/api' . $request_uri;
}

error_log("Request URI: " . $request_uri);
error_log("Request Method: " . $request_method);

// Definir la ruta base al directorio src
$base_path = dirname(__DIR__) . '/src';

// Mapeo de rutas y métodos a archivos
$routes = [
    'GET' => [
        '/api/links' => $base_path . '/api/read_links.php',
        '/api/weeks' => $base_path . '/api/read_weeks.php',
        '/api/check-auth' => $base_path . '/api/check_auth.php'
    ],
    'POST' => [
        '/api/links' => $base_path . '/api/create_link.php',
        '/api/weeks' => $base_path . '/api/create_week.php',
        '/api/login' => $base_path . '/api/login.php',
        '/api/logout' => $base_path . '/api/logout.php'
    ],
    'PUT' => [
        '/api/links' => $base_path . '/api/update_link.php',
        '/api/weeks' => $base_path . '/api/update_week.php'
    ],
    'DELETE' => [
        '/api/links' => $base_path . '/api/delete_link.php'
    ]
];

// Verificar si la ruta y el método existen
if (isset($routes[$request_method][$request_uri])) {
    $file_path = $routes[$request_method][$request_uri];
    
    if (file_exists($file_path)) {
        require $file_path;
    } else {
        error_log("File not found: " . $file_path);
        http_response_code(404);
        echo json_encode([
            "message" => "API endpoint file not found",
            "path" => $file_path
        ]);
    }
} else {
    error_log("Route not found or method not allowed: " . $request_method . " " . $request_uri);
    http_response_code(404);
    echo json_encode([
        "message" => "Route not found or method not allowed",
        "method" => $request_method,
        "uri" => $request_uri
    ]);
}
?>