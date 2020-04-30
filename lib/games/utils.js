exports.shuffleArray = arr => {
  const shuffledArray = [...arr];

  for (let i = 0; i < shuffledArray.length; i++) {
    const randomNum = Math.floor(Math.random() * shuffledArray.length);
    const item = shuffledArray[i];
    shuffledArray[i] = shuffledArray[randomNum];
    shuffledArray[randomNum] = item;
  }

  return shuffledArray;
};

exports.alphabet = 'abcdefghijklmnopqrstuvwxyz';
