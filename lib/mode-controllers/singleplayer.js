const { invalidInputMsg } = require('../messages');
const commands = require('../commands').singlePlayerCommands;

const GameFactory = require('../games/GameFactory');
const SPGamesManager = require('../core/SPGamesManager');

module.exports = async (req, res) => {
  const { Body: userMsg } = req.body;

  if (req.user.gameSessId) {
    const gameId = req.user.gameSessId;
    const game = SPGamesManager.findGame(gameId);
    const responseMsg = game.handleUserResponse(userMsg);

    // Save new changes
    SPGamesManager.updateGame(game, gameId);

    if (game.state === 'gameover') {
      // Send gameover message
      SPGamesManager.destroyGame(gameId, req);
    }

    return res.sendMessage(responseMsg);
  }

  const command = commands.find(c => c.code === userMsg);

  if (command) {
    let responseMsg = command.message;

    if (typeof command.message === 'function') {
      responseMsg = await command.message(req);
    }

    return res.sendMessage(responseMsg);
  }

  const gameNum = Number(userMsg) - 1;
  const isGameNumValid =
    gameNum >= 0 && gameNum < GameFactory.getGames().length;

  if (isGameNumValid) {
    const game = GameFactory.createGame(gameNum);

    if (game.init) await game.init();

    await SPGamesManager.createGame(game, req);

    return res.sendMessage(game.welcomeMessage);
  }

  return res.sendMessage(invalidInputMsg);
};
