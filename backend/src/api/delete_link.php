<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../models/Link.php';

$database = new Database();
$db = $database->getConnection();

$link = new Link($db);

// Obtener los datos enviados
$data = json_decode(file_get_contents("php://input"));

// Asegurarse de que el ID no esté vacío
if (!empty($data->id)) {
    $link->id = $data->id;

    if ($link->delete()) {
        http_response_code(200);
        echo json_encode(array("message" => "Link was deleted."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to delete link."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to delete link. No id provided."));
}