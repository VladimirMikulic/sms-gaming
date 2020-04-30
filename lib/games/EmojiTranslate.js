const superb = require('superb');
const txtgen = require('txtgen');
const emojiTranslate = require('moji-translate');

class EmojiTranslate {
  static name = 'Emoji Translate';

  constructor(gameId) {
    this.state = 'play';
    this.gameId = gameId;
    this.sentence = txtgen.sentence();
    this.emojiSentence = this.generateEmojiSentence();
  }

  generateEmojiSentence() {
    console.log('EMOJISEN', emojiTranslate.translate(this.sentence).trim());
    return emojiTranslate.translate(this.sentence).trim();
  }

  get welcomeMessage() {
    const message =
      'Are you truly Emoji Master❓ Do you have what it takes ' +
      ' to translate the whole sentence to emojis❓' +
      `Let's find out 😎\n\n ${this.sentence}`;

    return message;
  }

  handleUserResponse(userMessage) {
    this.state = 'gameover';

    if (userMessage === this.emojiSentence) {
      return `👑 ${superb.random()}! You are truly Emoji Master!`;
    } else {
      return `☹️ I've expected more from you!\n The answer is:\n*${this.emojiSentence}*`;
    }
  }
}

module.exports = EmojiTranslate;
