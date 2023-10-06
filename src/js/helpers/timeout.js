/**
 * export helper function for doing a timeout, returns a promise that times
 * out after however many seconds, good for promise racing or setting wait timers
 * @param {number} number of miliseconds (that get multiplied to seconds) for our timer
 * @returns {json data} promise, that will automatically reject after the timer runs out
 * @author ShAnder
 */
export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
