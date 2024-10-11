<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../models/Week.php';

$database = new Database();
$db = $database->getConnection();

$week = new Week($db);

// Obtener los datos enviados
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id) && isset($data->is_collapsed)) {
    $week->id = $data->id;
    $week->is_collapsed = $data->is_collapsed;

    if ($week->update()) {
        http_response_code(200);
        echo json_encode(array("message" => "Week was updated successfully."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to update week."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to update week. Data is incomplete."));
}