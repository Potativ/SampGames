const http = require("http");
const TelegramBot = require("node-telegram-bot-api");
const https = require("https");

// ====== НАСТРОЙКИ ======
const TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL; // https://xxx.onrender.com

if (!TOKEN || !APP_URL) {
  console.error("❌ BOT_TOKEN or APP_URL not set");
  process.exit(1);
}

// ====== TELEGRAM BOT (WEBHOOK) ======
const bot = new TelegramBot(TOKEN);

bot.setWebHook(`${APP_URL}/bot${TOKEN}`);

bot.on("message", (msg) => {
  if (msg.text === "/start") {
    const name = msg.from.first_name || "друг";
    bot.sendMessage(
      msg.chat.id,
      `👋 Привет, ${name}!\n\n🎮 Добро пожаловать в SampGame бот\n💰 Стартовый баланс: 1000$`
    );
  }
});

// ====== HTTP SERVER (Render + Webhook) ======
const server = http.createServer((req, res) => {
  if (req.url === `/bot${TOKEN}` && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      bot.processUpdate(JSON.parse(body));
      res.writeHead(200);
      res.end("OK");
    });
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Bot is running");
  }
});

server.listen(PORT, () => {
  console.log("HTTP server running on port", PORT);
  console.log("🤖 Telegram bot started (webhook)");
});

// ====== ANTI-SLEEP ======
setInterval(() => {
  https.get(APP_URL, (res) => {
    console.log("🔁 Anti-sleep ping:", res.statusCode);
  }).on("error", () => {
    console.log("⚠️ Anti-sleep error");
  });
}, 5 * 60 * 1000); // каждые 5 минут
