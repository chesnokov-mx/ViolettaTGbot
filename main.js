const {Telegraf} = require('telegraf')
const { Markup } = require('telegraf')

const { Keyboard, Key } = require('telegram-keyboard')
const {cnt} = require("./content.js")


require('dotenv').config()

console.log(process.env.BOT_TOKEN)

const bot = new Telegraf(process.env.BOT_TOKEN);

async function introduction(ctx){
    let userName = ctx?.message?.from?.first_name || ctx.update.callback_query.from.first_name
    const keyboard = Keyboard.make([
        [Key.callback('Подобрать услугу', 'getService')],
        [Key.callback('Общая информация', 'generalInfo')],
        [Key.callback('Подать заявку', 'postForm')],
    ])
    await ctx.replyWithPhoto({
        source: './images/main.jpg'
    })
    ctx.reply("Привет, " + userName + "! Мы очень рады, что ты " +
        "проявил интерес к нашему боту, разрешаю тебе совершенно бесплатно потыкать на кнопки",
        keyboard.inline())
}

async function getService(ctx){
    const keyboard = Keyboard.make([
        [Key.callback('Назад', 'introduction')],
    ])

    ctx.replyWithHTML(cnt.getServiceContent, keyboard.inline())
}

async function postForm(ctx){
    const keyboard = Keyboard.make([
        [Key.callback('Назад', 'introduction')],
    ])
    ctx.replyWithHTML(cnt.postForm, keyboard.inline())
}

async function generalInfo(ctx){
    const keyboard = Keyboard.make([
        [Key.callback('Об основателе не раб', 'aboutFounder')],
        [Key.callback('Об Alex не раб', 'aboutAlex')],
        [Key.callback('Кейсы', 'cases')],
        [Key.callback('Блог Виолетты в телеге не раб', 'blogLink')],
        [Key.callback('Наш Youtube не раб', 'youtibeLink')],
        [Key.callback('Назад', 'introduction')],
    ])
    await ctx.replyWithPhoto({
        source: "./images/geninfo.jpg"
    })
    ctx.replyWithHTML(cnt.generalInfo, keyboard.inline())
}

async function cases(ctx){
    const keyboard = Keyboard.make([
        [Key.callback('кейс1 не раб', '')],
        [Key.callback('кейс2 не раб', '')],
        [Key.callback('кейс3 не раб', '')],
        [Key.callback('Назад к общей информации', 'generalInfo')],
        [Key.callback('Назад в меню', 'introduction')],
    ])
    ctx.replyWithHTML(cnt.cases, keyboard.inline())
}


bot.start(async (ctx) => introduction(ctx));

bot.on("callback_query",(ctx)=>{
    switch (ctx.callbackQuery.data) {
        case "getService":
            getService(ctx);
            break;
        case "introduction":
            introduction(ctx);
            break;
        case "postForm":
            postForm(ctx);
            break;
        case "generalInfo":
            generalInfo(ctx);
            break;
        case "cases":
            cases(ctx);
            break;

    }
})

bot.launch()
