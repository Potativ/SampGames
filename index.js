const TelegramBot = require('node-telegram-bot-api');
const sqlite3 = require('sqlite3').verbose();

// === ВСТАВЬ СЮДА СВОЙ НОВЫЙ ТОКЕН ===
const TOKEN = '8380711756:AAEic316hiIVTHaVYf_OSvxa3jozycpWweE';

// === BOT ===
const bot = new TelegramBot(TOKEN, { polling: true });

// === DATABASE ===
const db = new sqlite3.Database('./game.db');

db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  money INTEGER DEFAULT 1000,
  business INTEGER DEFAULT 0,
  last_income INTEGER DEFAULT 0
)
`);

// === /start COMMAND ===
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const name = msg.from.first_name || 'Игрок';

  db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, user) => {
    if (err) {
      console.error(err);
      return bot.sendMessage(chatId, '❌ Ошибка базы данных');
    }

    if (!user) {
      db.run(
        `INSERT INTO users (id, money, business, last_income)
         VALUES (?, 1000, 0, 0)`,
        [userId]
      );

      bot.sendMessage(
        chatId,
        `👋 Привет, ${name}!\n\n🎮 Добро пожаловать в *SampGame бот*\n💰 Стартовый баланс: *1000$*`,
        { parse_mode: 'Markdown' }
      );
    } else {
      bot.sendMessage(
        chatId,
        `🔁 С возвращением, ${name}!\n💰 Баланс: *${user.money}$*`,
        { parse_mode: 'Markdown' }
      );
    }
  });
});
