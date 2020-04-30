class GuessNumber {
  static name = 'Guess a Number';

  constructor(gameId) {
    this.state = 'play';
    this.gameId = gameId;
    this.maxNumOfAttemts = 5;
    this.numOfFailedAttempts = 0;
    this.randomNumber = Math.ceil(Math.random() * 100);
  }

  get welcomeMessage() {
    const message =
      "In this game, I've picked up a random number between " +
      '1 and 100. You have 5 attempts to guess it! 🍀';

    return message;
  }

  handleUserResponse(userMessage) {
    const { randomNumber, maxNumOfAttemts } = this;
    const number = Number(userMessage);
    const difference = Math.abs(randomNumber - number);

    if (typeof number === 'string') {
      return `✋ ${number} is not a valid answer!`;
    }

    if (difference === 0) {
      this.state = 'gameover';
      return `🎉 Bingo! ${number} is the right answer!`;
    }

    this.numOfFailedAttempts++;

    if (this.numOfFailedAttempts === maxNumOfAttemts) {
      this.state = 'gameover';
      return `☹️ The right answer was ${randomNumber}.`;
    }

    if (number - randomNumber > 25) {
      return `⬇️ ${number} is way too high!`;
    } else if (number - randomNumber > 0) {
      return `⬇️ It's lower than ${number}.`;
    } else if (randomNumber - number > 25) {
      return `⬆️ ${number} is way too low!`;
    } else if (randomNumber - number > 0) {
      return `⬆️ It's higher than ${number}.`;
    }
  }
}

module.exports = GuessNumber;
