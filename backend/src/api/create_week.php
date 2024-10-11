<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../models/Week.php';

$database = new Database();
$db = $database->getConnection();

$week = new Week($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->name)) {
    $week->name = $data->name;
    $week->is_collapsed = $data->is_collapsed ?? false;

    if ($week->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "Week was created.", "id" => $week->id));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create week."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create week. Data is incomplete."));
}