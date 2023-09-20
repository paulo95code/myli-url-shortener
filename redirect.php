<?php
// Conecte-se ao banco de dados
$conn = new mysqli("localhost", "root", "", "encurtar");

if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

if (isset($_GET['code'])) {
    $shortCode = $_GET['code'];

    // Consulte o banco de dados para obter a URL original correspondente
    $sql = "SELECT original_url FROM url_shortener WHERE short_code = '$shortCode'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $originalUrl = $row['original_url'];
        header("Location: $originalUrl");
        exit();
    } else {
        echo "URL não encontrada.";
    }
} else {
    echo "Código de URL não especificado.";
}
?>
