# Architecture

This guide describes the architecture of this platform and serves as a guide to potential contributors. To  fully understand this documentation, I would recommend first trying out the platform (playing a few games :) and looking at the source code.

## Basics

This project has a different architecture than most of the server-side Node.js projects that you are used to. It's because this is not a normal web application Node.js backend. Instead of returning HTML pages, we return a message to the user.  (we return it to the Twilio which forwards it to the user)

At a high level, this platform uses the concept of **modes** to determine how it should reply to the user's message.

### Modes

##### unknown user

This is the first mode. It is not explicitly written anywhere in the code, but it is the term that I use for users that have sent their **first** message to the platform. (the platform doesn't know the user, **no session**)

**single-player**

After the user had sent the first message, the platform switches the user to the **single-player** mode and saves some data (phone number and the current mode) in the session so it remembers the user during the whole conversation. This is possible thanks to the Twilio API which allows us to send cookies from our server and maintain a session. In this mode, user can play games from _games_ folder. 

> Twilio expires cookie after 4 hours by default

**multi-player**

User can switch to **multi-player** mode if he wants to play with his friends or complete strangers. This mode doesn't have any games by default. The reason why this mode was even created is that it allows users to be creative. They are not limited by X number of games to play. Users can create their own games or join other game sessions.

### Commands

Commands direct the flow of conversation. User can use commands to switch modes, get help or perform any other action (create a game, join a game, etc.). Commands have format of **/\<letter>**.

All commands can be found in **lib/commands.js** file. This concept is inspired by Telegram's bot commands.

### Processes

We use processes to gather some data from the user. A process will ask user questions defined in **questions** array. Messages will differ depending on the user's answers. If it's valid the platform asks the next question, if not it sends an error message.

All processes are stored in the _processes_ folder and managed by **ProcessManager**.

The example below, shows an example process implementation.

```javascript
const Process = require('./Process');

class ExampleProcess extends Process {
  constructor(pid) {
    // Intialize process id
    super(pid);
    // An array of questions.
    // Each question has a validator function which validates the user's answer
    this.questions = [
      {
        question: 'Question 1',
        answer: null,
        validateAnswer: this.validateQuestion1,
        errorMsg: '⚠️ Custom error message'
      },
      {
        question: 'Question 2',
        answer: null,
        validateAnswer: this.validateQuestion2,
        errorMsg: '⚠️ Custom error message'
      }
    ];
  }

  // Validates the answer for question 1
  // If it returns true, the answer is set to be user's message and we move onto the next   // question, otherwise the answer remains `null` and we send an error message
  validateQuestion1(answer1) {
    // validation code
    // @returns {Boolean}
  }

  validateQuestion2(answer2) {
    // validation code
    // @returns {Boolean}
  }

  // Does something with user's data (starts a new process, informs user...)
  async postProcessAction(req) {
    // @returns {String} message to the user
  }
}

module.exports = ExampleProcess;
```

## Game Creation

The games are stored in _games_ folder and are playable in single-player mode. Essentially, a user plays with the machine (server).

```javascript
class ExampleGame {
  // The name of the game that is shown to the user
  static name = "Example Game"  

  constructor(gameId) {
    // State property which can be "play" or "gameover"
    // As you might guess, you set this to "gameover" once the game is finished
    // (i.e. user runned out of attempts)
    // "play" signalizes the server that the game should be saved because it is not over
    this.state = 'play';
    // Set game ID
    this.gameId = gameId;
    this.yourCustomProp = "Something";
  }

  get welcomeMessage() {
    return "In this game you need to..."
  }

  // You can define more methods except handleUserResponse() to make your code easier
  // to understand and maintain

  handleUserResponse(message) {
    // Your game logic
    // @returns {String} message to the user
  }
}

module.exports = ExampleGame;
```

Lastly, add your game to the `#games` array in GameFactory class which is responsible for creating games.