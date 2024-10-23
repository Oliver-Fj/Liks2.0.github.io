<?php
class Database {
    // Datos de conexión para InfinityFree
    private $host = "sql301.infinityfree.com";
    private $db_name = "if0_37569446_gestor_links";
    private $username = "if0_37569446";
    private $password = "UmLZLmbkQq6j";
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_PERSISTENT => true,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ];

            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
            return $this->conn;
        } catch(PDOException $e) {
            // Log el error pero no mostrar detalles sensibles
            error_log("Error de conexión a la base de datos: " . $e->getMessage());
            
            // Enviar una respuesta JSON con un mensaje genérico
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode([
                "error" => true,
                "message" => "Error en la conexión a la base de datos"
            ]);
            exit();
        }
    }

    // Método para verificar la conexión
    public function testConnection() {
        try {
            $conn = $this->getConnection();
            return $conn !== null;
        } catch(Exception $e) {
            return false;
        }
    }
}

// Verificar la conexión al instanciar
if (defined('VERIFY_CONNECTION') && VERIFY_CONNECTION) {
    $database = new Database();
    if (!$database->testConnection()) {
        error_log("No se pudo establecer la conexión con la base de datos");
    }
}
?>