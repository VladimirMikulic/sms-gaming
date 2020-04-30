const Process = require('./Process');
const MPGamesManager = require('../core/MPGamesManager');

class JoinGame extends Process {
  constructor(pid) {
    super(pid);
    this.questions = [
      {
        question: '🎮 Please enter game session ID:',
        answer: null,
        validateAnswer: this.validateGameSessionId,
        errorMsg:
          '⚠️ We were not able to find the session with the specified ID.'
      }
    ];
  }

  validateGameSessionId(id) {
    const game = MPGamesManager.findGame(id);
    return game.id !== undefined;
  }

  async postProcessAction(req) {
    const gameId = this.questions[0].answer;
    const game = MPGamesManager.findGame(gameId);

    await req.broadcastMessage(
      `🔥 User ${req.user.username} has joined!`,
      game.players
    );

    req.user.gameSessId = gameId;
    await req.saveUserSession(req.user);

    game.players.push(req.user);

    return (
      `You have successfully joined ${game.name}! 🎉\n` +
      'Introduce yourself to other players 👋'
    );
  }
}

module.exports = JoinGame;
