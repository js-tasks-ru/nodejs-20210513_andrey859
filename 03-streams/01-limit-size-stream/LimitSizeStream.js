const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  #limit = 1056;
  #encoding = 'utf8';
  constructor(options) {
    super(options);
    this.#limit = options.limit;
    this.#encoding = options.encoding;
  }

  _transform(chunk, encoding, callback) {
    let error;
    try {
      if (chunk.length <= this.#limit) {
        this.#limit = this.#limit - chunk.length;
        this.push(chunk)
          console.log(chunk)
      } else {
        throw new LimitExceededError();
      }
    } catch (e) {
      error = e;
    } finally {
      callback(error);
    }
  }
}

module.exports = LimitSizeStream;
