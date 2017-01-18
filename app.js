'use strict';

const TeleBot = require('telebot');
const bot = new TeleBot('309827121:AAEQzgetqCKOZ_wEd8ui8wCToF92jlOi4vs');


// Great API for this bot
const API = 'https://thecatapi.com/api/images/get?format=src&type=';

// Command keyboard
const markup = bot.keyboard([
  ['/kitty', '/kittygif']
], { resize: true, once: false });

// Log every text message
bot.on('text', function(msg) {
  console.log(`[text] ${ msg.chat.id } ${ msg.text } from ${ msg.from.first_name}`)
  console.log( msg )
});

// On command "start" or "help"
bot.on(['/start', '/help'], function(msg) {

  return bot.sendMessage(msg.chat.id,
    '😺 Use commands: /kitty, /kittygif and /about', { markup }
  );

});

// On command "about"
bot.on('/about', function(msg) {

  let text = '😽 This bot is powered by TeleBot library ' +
    'https://github.com/kosmodrey/telebot Go check the source code!';

  return bot.sendMessage(msg.chat.id, text);

});

// On command "kitty" or "kittygif"
bot.on(['/kitty', '/kittygif'], function(msg) {

  let promise;
  let id = msg.chat.id;
  let cmd = msg.text.split(' ')[0];

  // Photo or gif?
  if (cmd == '/kitty') {
    promise = bot.sendPhoto(id, API + 'jpg', { fileName: 'kitty.jpg' });
  } else {
    promise = bot.sendDocument(id, API + 'gif', { fileName: 'kitty.gif' });
  }

  // Send "uploading photo" action
  bot.sendAction(id, 'upload_photo');

  return promise.catch(error => {
    console.log('[error]', error);
    // Send an error
    bot.sendMessage(id, `😿 An error ${ error } occurred, try again.`);
  });

});

// On inline query
bot.on('inlineQuery', msg => {

  let query = msg.query;
  console.log(`inline query: ${ query }`);

  // Create a new answer list object
  const answers = bot.answerList(msg.id, { cacheTime: 60 });

  // Article
  answers.addArticle({
    id: 'query',
    title: 'Inline Title',
    description: `Your query: ${ query }`,
    message_text: 'Click!'
  });

  // Photo
  answers.addPhoto({
    id: 'photo',
    caption: 'Telegram logo.',
    photo_url: 'https://telegram.org/img/t_logo.png',
    thumb_url: 'https://telegram.org/img/t_logo.png'
  });

  // Gif
  answers.addGif({
    id: 'gif',
    gif_url: 'https://telegram.org/img/tl_card_wecandoit.gif',
    thumb_url: 'https://telegram.org/img/tl_card_wecandoit.gif'
  });

  // Send answers
  return bot.answerQuery(answers);

});


// Start getting updates
bot.connect();