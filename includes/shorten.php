<?php
// Conecte-se ao banco de dados
$conn = new mysqli("localhost", "root", "", "encurtar");

if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'));

    $customShortCode = $data->customShortCode;
    $originalUrl = $data->originalUrl; // Corrija para pegar a URL original

    // Verifique se o código personalizado já existe no banco de dados
    $sqlCheck = "SELECT * FROM url_shortener WHERE short_code = '$customShortCode'";
    $resultCheck = $conn->query($sqlCheck);

    if ($resultCheck->num_rows > 0) {
        echo json_encode(["error" => "Código personalizado já existe. Escolha outro."]);
    } else {
        // Insira os dados no banco de dados com o código personalizado
        $sql = "INSERT INTO url_shortener (original_url, short_code) VALUES ('$originalUrl', '$customShortCode')";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["shortCode" => $customShortCode]);
        } else {
            echo json_encode(["error" => "Erro ao encurtar a URL"]);
        }
    }
}

// Função para gerar um código curto personalizado
function generateShortCode() {
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    $shortCode = '';
    $length = 6; // Tamanho do código curto (você pode ajustar conforme necessário)

    for ($i = 0; $i < $length; $i++) {
        $shortCode .= $characters[rand(0, strlen($characters) - 1)];
    }

    return $shortCode;
}
?>
