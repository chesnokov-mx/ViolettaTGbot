const {Telegraf, session} = require('telegraf')
const { Markup } = require('telegraf')
const { Keyboard, Key } = require('telegram-keyboard')
const { cnt } = require("./content.js")
const fs  = require("fs")

require('dotenv').config();

function getResponses(){
    let responses;
    try {
        responses = JSON.parse(fs.readFileSync('responses.json'));
    } catch (err) {
        console.error(err);
        responses = {};
    }
    return responses;
}
function setResponses(responses){
    fs.writeFileSync('responses.json', JSON.stringify(responses, null, 4));
}

console.log("Bot started...")

const bot = new Telegraf(process.env.BOT_TOKEN);

function BTNfromArray(array){
    return Keyboard.make(array.map(([txt, name, flag = 0]) => {
            if (flag) {
                return [Key.url(txt, name)]
            } else {
                return [Key.callback(txt, name)]
            }
        }
    )).inline()
}
function MyScene(name, content, scr =''){
    this.name = name
    this.arrayButtons = []
    this.addButton = function (text, callbackData){
        this.arrayButtons.push([text, callbackData, 0])
    }
    this.addUrl = function (text, url){
        this.arrayButtons.push([text, url, 1])
    }
    function BTNfromArray(array){
        return Keyboard.make(array.map(([txt, name, flag = 0]) => {
                if (flag) {
                    return [Key.url(txt, name)]
                } else {
                    return [Key.callback(txt, name)]
                }
            }
        )).inline()
    }
    function deleteDoublerPrev(ctx){
        try {
            ctx.deleteMessage(ctx.update.callback_query.message.message_id - 2).catch((e)=>{})
            ctx.deleteMessage(ctx.update.callback_query.message.message_id - 1).catch((e)=>{})
            ctx.deleteMessage(ctx.update.callback_query.message.message_id).catch((e) =>{})
        }catch (e){}
    }
    this.reply = async (ctx) => {
        // console.log(ctx)
        const Username = ctx?.message?.from?.first_name || ctx.update.callback_query.from.first_name;
        deleteDoublerPrev(ctx)
        if (scr) {
            await ctx.replyWithPhoto({
                source: scr
            })
        }
        content = content.replace('[userName]', Username)
        ctx.replyWithHTML(content, BTNfromArray(this.arrayButtons))
    }
    bot.action(name, async (ctx) =>{
        this.reply(ctx)
    })
}

const Intro = new MyScene("Intro", cnt.Intro, "./images/main.jpg")
bot.start((ctx) => Intro.reply(ctx))
Intro.addButton('Общая информация', 'GenInfo')
Intro.addButton('Подобрать услугу', 'Quest')
Intro.addButton("Подать заявку", "PostForm")

const GenInfo = new MyScene("GenInfo", cnt.GenInfo)
GenInfo.addButton("об Основателе и ее личной работе", "AboutFounder")
GenInfo.addButton('О брендинговом агенстве', 'AboutAlex')
GenInfo.addButton("Кейсы", "Cases")
GenInfo.addUrl("Youtube канал", "https://www.youtube.com/channel/UCV-0hoNf08XkqoZQeKO_pMQ")
GenInfo.addButton("Назад", "Intro")

const Quest = new MyScene("Quest", cnt.Quest)
Quest.addButton("Начать опрос", "Quest1")
Quest.addButton("Назад", "Intro")

const PostFrom = new MyScene("PostForm", cnt.PostForm)
PostFrom.addUrl("Да!", "https://www.google.com")
PostFrom.addButton("Назад", "Intro")

const Cases = new MyScene("Cases", cnt.Cases)
Cases.addButton('Кейс #1', 'Case1')
Cases.addButton('Кейс #2', 'Case2')
Cases.addButton('Кейс #3 (в разработке)', 'Case3')
Cases.addButton('Кейс #4', 'Case4')
Cases.addButton("Назад", "GenInfo")


const Case1 = new MyScene('Case1', cnt.case1)
Case1.addUrl("Подать заявку", "https://www.google.com")
Case1.addButton("Назад", "Cases")


const Case2 = new MyScene('Case2', cnt.case2, "./images/case2.jpg")
Case2.addUrl("Хочу создать новую нишу как Lindi", "https://www.google.com")
Case2.addButton("Назад", "Cases")

const Case4 = new MyScene("Case4", cnt.case4, "./images/case4.jpg")
Case4.addUrl("Подать заявку", "https://www.google.com")
Case4.addButton("Назад", "Cases")

const AboutFounder = new MyScene("AboutFounder", cnt.AboutFounder)
AboutFounder.addUrl("Мой youtube-канал", "https://www.youtube.com/channel/UCV-0hoNf08XkqoZQeKO_pMQ")
AboutFounder.addUrl("Мой путь", "https://www.instagram.com/stories/highlights/17959538558245376/")
AboutFounder.addUrl("КАК ПОВЫСИТЬ СРЕДНИЙ ЧЕК", "https://forms.gle/LCbzVDjDKBQo57MX6")
// AboutFounder.addUrl("КАК ЭКСПЕРТУ ПРОДАВАТЬ В ОНЛАЙНЕ", "https://www.google.com")
AboutFounder.addUrl("Личная Консультация", "https://forms.gle/kDp4zdsYCTQdG16s5")
AboutFounder.addUrl("Программа путь Капитана", "https://www.google.com")
AboutFounder.addButton("Назад", "GenInfo")

const AboutAlex = new MyScene("AboutAlex", cnt.AboutAlex, "./images/brand.jpg")
AboutAlex.addButton("Наше видение", "OurVision")
AboutAlex.addButton('Наша миссия','OurMission')
AboutAlex.addButton('Услуги','OurService')
AboutAlex.addButton("Про цены",'OurPrices')
AboutAlex.addButton("Назад", "GenInfo")

const OurVision = new MyScene("OurVision", cnt.OurVision)
OurVision.addButton("Назад","AboutAlex")

const OurMission = new MyScene("OurMission", cnt.OurMission)
OurMission.addButton("Назад", "AboutAlex")

const OurService = new MyScene('OurService', cnt.OurService)
OurService.addUrl("Подать заявку", "https://www.google.com")
OurService.addButton("Назад",'AboutAlex')

const OurPrices = new MyScene("OurPrices", cnt.OurPrices, "./images/prices.jpeg")
OurPrices.addButton("Назад", "AboutAlex")


const questions = [
    {
        question: 'Напишите, пожалуйста, ваши фамилию и имя'
    },
    {
        question: 'Вы эксперт/специалист или предприниматель?',
        options: [
            ["Эксперт","IamExs"],
            ["Предприниматель","IamBis"]
            ]
    },
    {
        question: 'Напишите, пожалуйста вашу сферу деятельности'
    },

    {
        question: "Напишите, пожалуйста, ваш доход"
    },
    {
        question: "Что вас беспокоит?",
        options: [
            ["Нужно выйти в онлайн",'pb1'],
            ["Нужен визуал",'pb2'],
            ["Не понимаю, что мне продавать",'pb3'],
            ["Разработать историю бренда",'pb4'],
            ["Как мне выделиться среди конкурентов",'pb5'],
            ["Я не знаю, кто мои клиенты",'pb6'],
            ["Разработать бренд под ключ",'pb7'],
            ["Как мне увеличить средний чек?",'pb8'],
            ["Я застрял на одном месте",'pb9'],
            ["Мне нужен буст и конкретные решения",'pb10']
        ]
    },
    {
        question: "Вы бы хотели связаться с нами для дальнейшей консультации ?",
        options: [
            ["Да","consultingYes"],
            ["Нет","consultingNo"]
        ]
    },
    {
        question: "Напишите, пожалуйста, удобный для вас способ связи и данные для связи",
    },
    {
        question: "Благодарим за ваш интерес 🙏🏻☺️\n\nВаши данные были успешно сохранены, в ближайшее время мы с вами свяжемся. \n\nНажмите на кнопку ниже, " +
            "чтобы вернуться в главное меню бота",
        options: [
            ["В меню", 'Intro']
        ]
    },
    {
        question: "Спасибо за прохождение анкеты, надеемся она вам помогла сориентироваться в наших продуктах. \n\n" +
            "Нажмите кнопку ниже, чтобы вернуться в главное меню бота.",
        options: [
            ["В меню", 'Intro']
        ]
    }
];

bot.action("Quest1", (ctx) =>{
    let responses = getResponses()
    responses[ctx.from.id] === undefined ? responses[ctx.from.id] = {} : 0;
    responses[ctx.from.id]['currentQuestion'] = 1;
    responses[ctx.from.id]["UserName"] = ctx.update.callback_query.from.username;

    try {
        ctx.deleteMessage(ctx.update.callback_query.message.message_id - 2).catch((e)=>{})
        ctx.deleteMessage(ctx.update.callback_query.message.message_id - 1).catch((e)=>{})
        ctx.deleteMessage(ctx.update.callback_query.message.message_id).catch((e) =>{})
    }catch (e){}
    ctx.reply(questions[0].question)
    setResponses(responses)
})
bot.on("message", (ctx)=>{
    let responses = getResponses()
    if(responses[ctx.from.id] && responses[ctx.from.id]['currentQuestion']){
        if(responses[ctx.from.id]['currentQuestion'] === 10 || responses[ctx.from.id]['currentQuestion'] === 9) return
        responses[ctx.from.id][responses[ctx.from.id]['currentQuestion']] = ctx.message.text
        try {
            ctx.deleteMessage(ctx.update.message.message_id - 2).catch((e)=>{})
            ctx.deleteMessage(ctx.update.message.message_id - 1).catch((e)=>{})
            ctx.deleteMessage(ctx.update.message.message_id).catch((e) =>{})
        }catch (e){}
        let cq = questions[responses[ctx.from.id]['currentQuestion']]
        ctx.reply(cq.question, cq.options === undefined? undefined : BTNfromArray(cq.options))
        responses[ctx.from.id]['currentQuestion']++
        setResponses(responses)
    }
})
const regexB = /IamExs|IamBis/
bot.action(regexB, (ctx)=>{
    let responses = getResponses()
    try {
        ctx.deleteMessage(ctx.update.callback_query.message.message_id - 2).catch((e)=>{})
        ctx.deleteMessage(ctx.update.callback_query.message.message_id - 1).catch((e)=>{})
        ctx.deleteMessage(ctx.update.callback_query.message.message_id).catch((e) =>{})
    }catch (e){}
    let currentQ = responses[ctx.chat.id]["currentQuestion"]
    let cq = questions[responses[ctx.from.id]['currentQuestion']]
    // console.log(ctx)
    responses[ctx.chat.id][currentQ] = ctx.update.callback_query.data
    ctx.reply(cq.question, cq.options === undefined? undefined : BTNfromArray(cq.options))
    responses[ctx.from.id]['currentQuestion']++
    setResponses(responses)
})

const regex = /pb[1-9]|pb10/
bot.action(regex, (ctx)=>{
    const string = 'Вам подойдет следующая услуга:\n\n'
    let responses = getResponses()

    try {
        ctx.deleteMessage(ctx.update.callback_query.message.message_id - 2).catch((e)=>{})
        ctx.deleteMessage(ctx.update.callback_query.message.message_id - 1).catch((e)=>{})
        ctx.deleteMessage(ctx.update.callback_query.message.message_id).catch((e) =>{})
    }catch (e){}
    let currentQ = responses[ctx.chat.id]["currentQuestion"]
    let cq = questions[responses[ctx.from.id]['currentQuestion']]
    const answer = string + cnt[ctx.update.callback_query.data] + "\n\n" + cq.question;
    responses[ctx.chat.id][currentQ] = ctx.update.callback_query.data
    ctx.replyWithHTML(answer, cq.options === undefined? undefined : BTNfromArray(cq.options))
    responses[ctx.from.id]['currentQuestion']++
    setResponses(responses)
})
const regexCons = /consultingYes|consultingNo/
bot.action(regexCons, (ctx) =>{
    let responses = getResponses()
    try {
        ctx.deleteMessage(ctx.update.callback_query.message.message_id - 2).catch((e)=>{})
        ctx.deleteMessage(ctx.update.callback_query.message.message_id - 1).catch((e)=>{})
        ctx.deleteMessage(ctx.update.callback_query.message.message_id).catch((e) =>{})
    }catch (e){}


    if(ctx.update.callback_query.data === 'consultingNo'){
        responses[ctx.from.id]['currentQuestion'] += 2;
    }
    let currentQ = responses[ctx.chat.id]["currentQuestion"]
    let cq = questions[responses[ctx.from.id]['currentQuestion']]
    responses[ctx.chat.id][currentQ] = ctx.update.callback_query.data
    ctx.replyWithHTML(cq.question, cq.options === undefined? undefined : BTNfromArray(cq.options))
    responses[ctx.from.id]['currentQuestion']++
    setResponses(responses)
})

bot.launch()