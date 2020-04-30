/**
 * SinglePlayer Games Manager
 */
class SPGamesManager {
  static #games = [];

  static async createGame(gameSession, req) {
    const { gameId } = gameSession;
    req.user.gameSessId = gameId;

    SPGamesManager.#games.push(gameSession);

    await req.saveUserSession(req.user);
    return gameSession;
  }

  static updateGame(newGameSession, gameId) {
    const sessionIndex = SPGamesManager.#games.findIndex(
      gs => gs.gameId === gameId
    );
    SPGamesManager.#games[sessionIndex] = newGameSession;

    return newGameSession;
  }

  static findGame(id) {
    return SPGamesManager.#games.find(gs => gs.gameId === id);
  }

  static async destroyGame(id, req) {
    req.user.gameSessId = null;
    await req.saveUserSession(req.user);

    const sessionIndex = SPGamesManager.#games.findIndex(
      gs => gs.gameId === id
    );

    return SPGamesManager.#games.splice(sessionIndex, 1);
  }
}

module.exports = SPGamesManager;
