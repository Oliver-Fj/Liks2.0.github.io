<?php

header("Access-Control-Allow-Origin: https://oliver-fj.github.io/Liks2.0.github.io");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


class Week {
    private $conn;
    private $table_name = "weeks";

    public $id;
    public $name;
    public $is_collapsed;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {

        $query = "INSERT INTO " . $this->table_name . " SET name=:name, is_collapsed=:is_collapsed";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->is_collapsed = $this->is_collapsed ? 1 : 0;

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":is_collapsed", $this->is_collapsed);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    public function read() {
        $query = "SELECT id, name, is_collapsed FROM " . $this->table_name . " ORDER BY id";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET is_collapsed = :is_collapsed 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Sanitize and bind
        $this->is_collapsed = $this->is_collapsed ? 1 : 0;
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(':is_collapsed', $this->is_collapsed);
        $stmt->bindParam(':id', $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}