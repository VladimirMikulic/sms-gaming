const { multiPlayerWelcomeMsg } = require('../messages');
const { isAlphanumeric, isLength } = require('validator').default;

const Process = require('./Process');

class UsernameCreation extends Process {
  constructor(pid) {
    super(pid);
    this.questions = [
      {
        question: '⚡ Please enter your username:',
        answer: null,
        validateAnswer: this.validateUsername,
        errorMsg: '⚠️ Username needs to contain 3 - 10 alphanumeric characters!'
      }
    ];
  }

  validateUsername(username) {
    return isLength(username, { min: 3, max: 10 }) && isAlphanumeric(username);
  }

  async postProcessAction(req) {
    req.user.username = this.questions[0].answer;
    await req.saveUserSession(req.user);

    return [`🍻 Welcome ${req.user.username}!`, multiPlayerWelcomeMsg];
  }
}

module.exports = UsernameCreation;
