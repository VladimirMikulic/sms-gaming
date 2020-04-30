const Process = require('./Process');
const MPGamesManager = require('../core/MPGamesManager');

const { isLength } = require('validator').default;

class GameCreation extends Process {
  constructor(pid) {
    super(pid);
    this.questions = [
      {
        question: '🎮 Name of the Game:',
        answer: null,
        validateAnswer: this.validateGameName,
        errorMsg: '⚠️ Name needs to contains 3 - 30 alphanumeric characters!'
      },
      {
        question: '🔢 Number of Players:',
        answer: null,
        validateAnswer: answ => Number.isInteger(Number(answ)) && answ > 1,
        errorMsg: '⚠️ Please specify a valid number of players.'
      }
    ];
  }

  validateGameName(name) {
    // Regex tests for alphanumeric string that can contain spaces but not special characters
    return (
      isLength(name, { min: 3, max: 30 }) && /^[a-zA-Z0-9 ]*$/gm.test(name)
    );
  }

  async postProcessAction(req) {
    const gameDetails = {
      creator: req.user,
      name: this.questions[0].answer,
      numOfPlayers: this.questions[1].answer
    };

    const game = await MPGamesManager.createGame(gameDetails, req);

    return (
      'The game has been created 🎉! Other players are now able to join 🚀\n' +
      `Your game ID is *${game.id}*. Invite them to join you! 🍻`
    );
  }
}

module.exports = GameCreation;
