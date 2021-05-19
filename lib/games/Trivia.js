const superb = require('superb');
const axios = require('axios').default;
const { shuffleArray, alphabet } = require('./utils');

const { decode } = require('html-entities');

class Trivia {
  static name = 'Trivia';

  constructor(gameId) {
    this.state = 'play';
    this.gameId = gameId;
    this.quizStarted = false;
    this.currentQuestionIndex = 0;
    this.questions = null;
    this.numOfCorrectAnswers = 0;
  }

  async init() {
    const { data } = await axios.get('https://opentdb.com/api.php?amount=5');
    this.questions = data.results;

    for (let i = 0; i < this.questions.length; i++) {
      this.questions[i].shuffled_answers = this.getShuffledAnswers(i);
      this.questions[i].question = decode(this.questions[i].question);
    }
    console.log(data.results);
  }

  get welcomeMessage() {
    const message =
      'How much do you know about anything, really❓\n' +
      "Let's find out in this 5 questions Trivia.\n" +
      'Type "Go" when you are ready to get started. 🔥';

    return message;
  }

  askNextQuestion() {
    const { question, shuffled_answers } = this.questions[
      this.currentQuestionIndex
    ];
    let message = question;

    for (let i = 0; i < alphabet.length; i++) {
      const letter = alphabet[i].toUpperCase();
      const possibleAnswer = shuffled_answers[i];

      if (!possibleAnswer) break;
      message += `\n*${letter}* ${possibleAnswer}`;
    }

    this.currentQuestionIndex++;
    return message;
  }

  getShuffledAnswers(questionIndex) {
    const question = this.questions[questionIndex];
    const answers = [...question.incorrect_answers, question.correct_answer];

    return shuffleArray(answers);
  }

  isAnswerCorrect(code) {
    const { questions, currentQuestionIndex } = this;
    const question = questions[currentQuestionIndex - 1];
    const answerIndex = alphabet.indexOf(code.toLowerCase());

    return question.correct_answer === question.shuffled_answers[answerIndex];
  }

  generateQuizReport() {
    const { numOfCorrectAnswers } = this;
    const ratio = `${numOfCorrectAnswers}/5`;

    if (numOfCorrectAnswers < 2) return `☹️ ${ratio} Better luck next time.`;
    else if (numOfCorrectAnswers < 4) return `😐 ${ratio} Could be better.`;
    else return `😀 ${ratio} ${superb.random()}!`;
  }

  handleUserResponse(answer) {
    const messages = [];

    if (!this.quizStarted) {
      this.quizStarted = answer.toLowerCase() === 'go';

      if (!this.quizStarted) return 'We can "Go" whenever you are ready 😉';
      return this.askNextQuestion();
    }

    const isValidAnswer = alphabet.indexOf(answer.toLowerCase()) !== -1;
    if (!isValidAnswer) return '🙃 Invalid answer';

    if (this.isAnswerCorrect(answer)) {
      this.numOfCorrectAnswers++;
      messages.push('✔️');
    } else {
      messages.push('❌');
    }

    if (this.currentQuestionIndex > 4) {
      this.state = 'gameover';
      messages.push(this.generateQuizReport());
    } else {
      messages.push(this.askNextQuestion());
    }

    return messages;
  }
}

module.exports = Trivia;
