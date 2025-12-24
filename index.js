// ================== HTTP SERVER (ДЛЯ RENDER) ==================
const http = require("http");

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Bot is running");
}).listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}`);
});

// ================== TELEGRAM BOT ==================
const TelegramBot = require("node-telegram-bot-api");

// Токен берём из Render Environment Variables
const TOKEN = process.env.BOT_TOKEN;

if (!TOKEN) {
  console.error("❌ BOT_TOKEN not found");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name || "друг";

  bot.sendMessage(
    chatId,
    `👋 Привет, ${name}!\n\n🎮 Добро пожаловать в SampGame бот\n💰 Стартовый баланс: 1000$`
  );
});

console.log("🤖 Telegram bot started");
	