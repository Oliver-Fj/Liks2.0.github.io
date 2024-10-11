<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../models/Link.php';

$database = new Database();
$db = $database->getConnection();

$link = new Link($db);

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->title) &&
    !empty($data->url) &&
    !empty($data->week_id)
) {
    $link->title = $data->title;
    $link->url = $data->url;
    $link->week_id = $data->week_id;

    if ($link->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "Link was created."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create link."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create link. Data is incomplete."));
}