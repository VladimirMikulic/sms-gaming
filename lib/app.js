require('dotenv').config();

const multiPlayerModeHandler = require('./mode-controllers/multiplayer');
const singlePlayerModeHandler = require('./mode-controllers/singleplayer');

const express = require('express');
const session = require('express-session');

const { singlePlayerWelcomeMsg, serverErrorMsg } = require('./messages');
const {
  sendMessage,
  saveUserSession,
  broadcastMessage,
  sessionConfig
} = require('./utils');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse incoming Twilio request
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(session(sessionConfig));

// Custom properties attached on each request & response
app.use((req, res, next) => {
  req.user = req.session.user;
  res.sendMessage = sendMessage(res);
  req.saveUserSession = saveUserSession(req);
  req.broadcastMessage = broadcastMessage(req);
  next();
});

// The main endpoint where messages arrive
app.post('/', async (req, res) => {
  const user = req.session.user || {};

  try {
    if (user.mode === 'single-player') {
      singlePlayerModeHandler(req, res);
    } else if (user.mode === 'multi-player') {
      multiPlayerModeHandler(req, res);
    } else {
      const userSession = {
        phone: req.body.From,
        mode: 'single-player'
      };

      await req.saveUserSession(userSession);
      res.sendMessage(singlePlayerWelcomeMsg);
    }
  } catch (error) {
    res.sendMessage(serverErrorMsg);
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
