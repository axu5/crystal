const maxAttempts = 3; // max attempts
const delay = 5; // delay seconds

const attempts = {};
const timers = {};

export const fail = uuid => {
  attempts[uuid] = attempts[uuid] ? attempts[uuid] + 1 : 1;
  if (!timers[uuid]) {
    timers[uuid] = setInterval(() => {
      attempts[uuid] -= 1;
      if (attempts[uuid] <= 0) {
        clearInterval(timers[uuid]);
        delete attempts[uuid];
        delete timers[uuid];
      }
    }, delay * 1000);
  }
};

export const test = uuid => {
  if (attempts[uuid] > maxAttempts)
    throw "you have inputted the wrong password too many times";
};
