<?php
class Link {
    private $conn;
    private $table_name = "links";

    public $id;
    public $title;
    public $url;
    public $week_id;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET title=:title, url=:url, week_id=:week_id";

        $stmt = $this->conn->prepare($query);

        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->url = htmlspecialchars(strip_tags($this->url));
        $this->week_id = htmlspecialchars(strip_tags($this->week_id));

        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":url", $this->url);
        $stmt->bindParam(":week_id", $this->week_id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function read() {
        $query = "SELECT id, title, url, week_id FROM " . $this->table_name . " ORDER BY week_id";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . "
                SET title = :title, url = :url, week_id = :week_id
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->url = htmlspecialchars(strip_tags($this->url));
        $this->week_id = htmlspecialchars(strip_tags($this->week_id));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':url', $this->url);
        $stmt->bindParam(':week_id', $this->week_id);
        $stmt->bindParam(':id', $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";

        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(1, $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}