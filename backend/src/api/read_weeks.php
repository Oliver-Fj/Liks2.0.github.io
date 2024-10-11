<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../models/Week.php';

$database = new Database();
$db = $database->getConnection();

$week = new Week($db);

$stmt = $week->read();
$num = $stmt->rowCount();

if ($num > 0) {
    $weeks_arr = array();
    $weeks_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $week_item = array(
            "id" => $id,
            "name" => $name,
            "is_collapsed" => $is_collapsed
        );

        array_push($weeks_arr["records"], $week_item);
    }

    http_response_code(200);
    echo json_encode($weeks_arr);
} else {
    http_response_code(404);
    echo json_encode(
        array("message" => "No weeks found.")
    );
}