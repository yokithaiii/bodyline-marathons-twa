require('dotenv').config();
const { Telegraf, Scenes, session } = require('telegraf');
const scenes = require('./scenes');
const { START_MESSAGE } = require('./config/constants');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(token);
const stage = new Scenes.Stage(scenes);

bot.use(session());
bot.use(stage.middleware());

bot.command('start', ctx => {

    const timestamp = Date.now();
    const webAppUrl = `https://marathonsbot.bodylineapp.com?t=${timestamp}`;

    const openTMAButton = {
        text: 'Открыть мини-приложение 🚀',
        web_app: { url: webAppUrl }
    };

    ctx.reply(START_MESSAGE(ctx.from.first_name), {
        reply_markup: {
            inline_keyboard: [[openTMAButton]]
        }
    });
});

bot.launch();

process.on('unhandledRejection', error => {
    console.error('Unhandled Rejection:', error);
});
