const { nanoid } = require('nanoid');

/**
 * MultiPlayer Games Manager
 */
class MPGamesManager {
  static #games = [];

  static async createGame(gameDetails, req) {
    const game = {
      id: nanoid(5),
      name: gameDetails.name,
      numOfPlayers: gameDetails.numOfPlayers,
      players: [gameDetails.creator]
    };

    req.user.gameSessId = game.id;
    await req.saveUserSession(req.user);

    MPGamesManager.#games.push(game);

    return game;
  }

  static findGame(id) {
    return MPGamesManager.#games.find(g => g.id === id) || {};
  }

  static async joinGame(id, req) {
    const game = MPGamesManager.findGame(id);
    req.user.gameSessId = game.id;
    game.players.push(req.user);

    await req.saveUserSession(req.user);

    return game;
  }

  static async destroyGame(id, req) {
    const sessionIndex = MPGamesManager.#games.findIndex(
      sess => sess.id === id
    );

    req.user.gameSessId = null;
    await req.saveUserSession(req.user);

    return MPGamesManager.#games.splice(sessionIndex, 1);
  }

  static getAvailableToJoinGames(num = 5) {
    const games = MPGamesManager.#games.filter(
      g => g.players.length !== g.numOfPlayers
    );

    return games.slice(0, num);
  }
}

module.exports = MPGamesManager;
