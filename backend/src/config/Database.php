<?php
class Database {
    private $host = "sql111.infinityfree.com";
    private $db_name = "if0_37567749_gestor_links";
    private $username = "if0_37567749";
    private $password = "Uj8OoK22AgW3";
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}