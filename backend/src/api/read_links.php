<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../models/Link.php';

$database = new Database();
$db = $database->getConnection();

$link = new Link($db);

$stmt = $link->read();
$num = $stmt->rowCount();

if ($num > 0) {
    $links_arr = array();
    $links_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $link_item = array(
            "id" => $id,
            "title" => $title,
            "url" => $url,
            "week_id" => $week_id
        );

        array_push($links_arr["records"], $link_item);
    }

    http_response_code(200);
    echo json_encode($links_arr);
} else {
    http_response_code(200);
    echo json_encode(
        array("message" => "No links found.", "No links found", "records" =>[] )
    );
}