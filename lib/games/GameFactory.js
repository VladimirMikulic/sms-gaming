const { randomUUID } = require('crypto');

class GameFactory {
  static #games = [
    require('./Hangman'),
    require('./GuessNumber'),
    require('./EmojiTranslate'),
    require('./JumbledWord'),
    require('./Trivia')
  ];

  static createGame(index) {
    const gameId = randomUUID();
    const Game = GameFactory.#games[index];

    return new Game(gameId);
  }

  static getGames() {
    return GameFactory.#games;
  }
}

module.exports = GameFactory;
