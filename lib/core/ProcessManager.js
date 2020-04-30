const { nanoid } = require('nanoid');
const JoinGame = require('../processes/JoinGame');
const GameCreation = require('../processes/GameCreation');
const UsernameCreation = require('../processes/UsernameCreation');

class ProcessManager {
  static #processes = [];

  static async createProcess(processType, req) {
    let process = null;
    const processId = nanoid();

    if (processType === 'game-creation') {
      process = new GameCreation(processId);
    } else if (processType === 'username-creation') {
      process = new UsernameCreation(processId);
    } else if (processType === 'game-join') {
      process = new JoinGame(processId);
    }

    req.user.processId = process.pid;
    await req.saveUserSession(req.user);

    ProcessManager.#processes.push(process);
    return process;
  }

  static findProcess(pid) {
    return ProcessManager.#processes.find(p => p.pid === pid) || {};
  }

  static async destroyProcess(pid, req) {
    const pIndex = ProcessManager.#processes.findIndex(p => p.pid === pid);
    const removedProcess = ProcessManager.#processes.splice(pIndex, 1);

    if (req.user.processId === pid) {
      req.user.processId = null;
      await req.saveUserSession(req.user);
    }

    return removedProcess;
  }
}

module.exports = ProcessManager;
