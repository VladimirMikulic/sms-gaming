class Process {
  constructor(pid) {
    this.pid = pid;
  }

  get welcomeMessage() {
    return this.nextQuestion().question;
  }

  nextQuestion() {
    return this.questions.find(q => q.answer === null) || {};
  }

  handleUserResponse(message) {
    const question = this.nextQuestion();

    const isAnswerValid = question.validateAnswer(message);

    if (!isAnswerValid) {
      return question.errorMsg;
    }

    question.answer = message;
    return this.nextQuestion().question || null;
  }
}

module.exports = Process;
