const superb = require('superb');
const randomWords = require('random-words');
const { shuffleArray } = require('./utils');

class JumbledWord {
  static name = 'Jumbled Word';

  constructor(gameId) {
    this.state = 'play';
    this.gameId = gameId;
    this.originalWord = randomWords();
    this.shuffledWord = this.shuffleOriginalWord();
  }

  get welcomeMessage() {
    const message =
      "In this game, I've taken a random 🇬🇧 word and shuffled it :)\n" +
      'Can you guess the original word❓\n' +
      'You have only 1️⃣ chance!\n\nWORD: ' +
      this.shuffledWord;

    return message;
  }

  shuffleOriginalWord() {
    return shuffleArray([...this.originalWord]).join('');
  }

  handleUserResponse(word) {
    this.state = 'gameover';

    if (word.toLowerCase() === this.originalWord) {
      return `✔️ ${superb.random()}!`;
    } else {
      return `❌ The correct word is ${this.originalWord}.`;
    }
  }
}

module.exports = JumbledWord;
