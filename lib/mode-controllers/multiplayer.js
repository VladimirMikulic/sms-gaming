const { invalidInputMsg } = require('../messages');
const commands = require('../commands').multiPlayerCommands;

const MPGamesManager = require('../core/MPGamesManager');
const ProcessManager = require('../core/ProcessManager');

module.exports = async (req, res) => {
  const { Body: userMsg } = req.body;

  if (userMsg === '/q') {
    const gameId = req.user.gameSessId;

    if (gameId) {
      const game = MPGamesManager.findGame(gameId);
      const players = game.players.filter(
        p => p.username !== req.user.username
      );
      game.players = players;

      if (players.length === 0) {
        await MPGamesManager.destroyGame(gameId, req);
      } else {
        await req.broadcastMessage(
          `User ${req.user.username} has left the game!`,
          players
        );
      }
    }

    req.user.processId = null;
    req.user.gameSessId = null;

    await req.saveUserSession(req.user);
    return res.sendMessage("You exited the current conversation. 🚪");
  }

  if (req.user.gameSessId) {
    const game = MPGamesManager.findGame(req.user.gameSessId);
    const gameParticipants = game.players.filter(
      p => p.phone !== req.user.phone
    );

    const message = `${req.user.username}: ${userMsg}`;
    await req.broadcastMessage(message, gameParticipants);

    return res.status(200).end();
  }

  if (req.user.processId) {
    const process = ProcessManager.findProcess(req.user.processId);
    let responseMsg = process.handleUserResponse(userMsg);

    if (responseMsg === null) {
      responseMsg = await process.postProcessAction(req);
      await ProcessManager.destroyProcess(process.pid, req);
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

  return res.sendMessage(invalidInputMsg);
};
