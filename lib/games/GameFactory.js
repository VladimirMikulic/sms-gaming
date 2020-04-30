const { nanoid } = require('nanoid');

class GameFactory {
  static #games = [
    require('./Hangman'),
    require('./GuessNumber'),
    require('./EmojiTranslate'),
    require('./JumbledWord'),
    require('./Trivia')
  ];

  static createGame(index) {
    const gameId = nanoid();
    const Game = GameFactory.#games[index];

    return new Game(gameId);
  }

  static getGames() {
    return GameFactory.#games;
  }
}

module.exports = GameFactory;
