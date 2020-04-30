const superb = require('superb');
const randomWords = require('random-words');
const { isAlpha } = require('validator').default;

class Hangman {
  static name = 'Hangman';

  constructor(gameId) {
    this.state = 'play';
    this.gameId = gameId;
    this.word = randomWords().toUpperCase();
    this.numOfFailedAttempts = 0;
    this.maxNumOfFailedAttemts = 5;
    this.guessedLetters = new Set();
  }

  get welcomeMessage() {
    const message =
      'Welcome to the well know Hangman game! ' +
      'Your job is to try to guess the right word 🔤\n\n' +
      this.gameMessage;

    return message;
  }

  /**
   * Generates word message in form A_T_
   * Unguess letters are replaced by _ and guessed letters are shown
   * @returns {String}
   */
  wordMessage() {
    const wordLetters = this.word.split('');
    let message = 'Word:\n';

    for (const letter of wordLetters) {
      if (this.guessedLetters.has(letter)) message += `${letter} `;
      else message += '_ ';
    }

    return message;
  }

  /**
   * Generates guessed letters list separated by /
   * @returns {String}
   */
  guessedLettersMessage() {
    let message = 'Guessed letters:\n';

    for (const letter of this.guessedLetters) {
      message += ` ${letter} /`;
    }

    return message;
  }

  validateMessage(userMessage) {
    return isAlpha(userMessage) && userMessage.length === 1;
  }

  get gameMessage() {
    const message = `${this.wordMessage()}\n\n${this.guessedLettersMessage()}`;
    return message;
  }

  get hasUserWon() {
    const hasGuessed = this.word
      .split('')
      .every(letter => this.guessedLetters.has(letter));

    return hasGuessed;
  }

  handleUserResponse(userMessage) {
    const isInputValid = this.validateMessage(userMessage);

    if (!isInputValid) {
      return '✋ Letters only!';
    }

    this.guessedLetters.add(userMessage.toUpperCase());

    const { word, numOfFailedAttempts, maxNumOfFailedAttemts } = this;

    if (this.hasUserWon) {
      this.state = 'gameover';
      return [this.gameMessage, `💯 ${superb.random()}!`];
    }

    if (!word.includes(userMessage)) this.numOfFailedAttempts++;

    if (maxNumOfFailedAttemts === numOfFailedAttempts) {
      this.state = 'gameover';
      return [
        this.gameMessage,
        `\n\n☹️ Better luck next time! The right word is: ${this.word}`
      ];
    }

    return this.gameMessage;
  }
}

module.exports = Hangman;
