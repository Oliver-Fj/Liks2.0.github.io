<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Eliminar cualquier parámetro de consulta de la URI
$request_uri = strtok($request_uri, '?');

error_log("Request URI: " . $request_uri);
error_log("Request Method: " . $request_method);

// Enrutamiento básico
switch ($request_uri) {
    case '/api/links':
        switch ($request_method) {
            case 'GET':
                require __DIR__ . '/../src/api/read_links.php';
                break;
            case 'POST':
                require __DIR__ . '/../src/api/create_link.php';
                break;
            case 'PUT':
                require __DIR__ . '/../src/api/update_link.php';
                break;
            case 'DELETE':
                require __DIR__ . '/../src/api/delete_link.php';
                break;
            default:
                http_response_code(405);
                echo json_encode(["message" => "Method not allowed"]);
                break;
        }
        break;
    case '/api/weeks':
        switch ($request_method) {
            case 'GET':
                require __DIR__ . '/../src/api/read_weeks.php';
                break;
            case 'POST':
                require __DIR__ . '/../src/api/create_week.php';
                break;
                case 'PUT':
                    require __DIR__ . '/../src/api/update_week.php';
                    break;
            default:
                http_response_code(405);
                echo json_encode(["message" => "Method not allowed for /api/weeks"]);
                break;
        }
        break;
    default:
        http_response_code(404);
        echo json_encode(["message" => "Route not found"]);
        break;
}