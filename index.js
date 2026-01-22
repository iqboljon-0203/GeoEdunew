require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEBAPP_URL;

if (!BOT_TOKEN) {
  console.warn('⚠️ BOT_TOKEN .env faylida topilmadi. Iltimos tekshirib ko\'ring.');
}

const bot = new Telegraf(BOT_TOKEN);

// 1. Set the Menu Button (persistent button)
const setupMenuButton = async () => {
    try {
        await bot.telegram.setChatMenuButton({
            menuButton: {
                type: 'web_app',
                text: 'GeoEdu',
                web_app: { url: WEB_APP_URL }
            }
        });
        console.log('✅ Menu tugmasi sozlandi');
    } catch (error) {
        console.error('❌ Menu tugmasini sozlashda xato:', error.message);
    }
};

// 2. /start command handler
bot.start(async (ctx) => {
  const name = ctx.from.first_name || 'foydalanuvchi';
  
  const welcomeMessage = `
👋 *Salom, ${name}!*

*GeoEdu* — interaktiv ta'lim platformasi.

Platformani ochish uchun pastdagi tugmani bosing! 🌊
  `;

  return ctx.replyWithMarkdown(
    welcomeMessage,
    Markup.inlineKeyboard([
      [Markup.button.webApp('🚀 GeoEdu ni ochish', WEB_APP_URL)]
    ])
  );
});

// 3. Fallback for any other message
bot.on('message', (ctx) => {
    return ctx.reply('Platformani ochish uchun pastdagi tugmani bosing:', 
        Markup.inlineKeyboard([
            [Markup.button.webApp('🚀 GeoEdu ni ochish', WEB_APP_URL)]
        ])
    );
});

// Initialize and start
setupMenuButton();

bot.launch()
  .then(() => console.log('🚀 GeoEdu Bot is live!'))
  .catch((err) => console.error('Failed to launch bot:', err));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
