const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options.encoding;
    this.last = '';
  }

  _transform(chunk, encoding, callback) {
    // console.log(chunk.toString())
    let row = chunk.toString().split(os.EOL);
    console.log(row);

    if (this.last !== '') {
      row[0] = this.last + row[0];
      this.last = '';
    }

      if (row[row.length-1] === '') {
        for (let i = 0; i < row.length-1; i++) {
          this.push(row[i])
        }
      } else {
        this.last = row[row.length-1];
        for (let i = 0; i < row.length-1; i++) {
          this.push(row[i])
        }
      }

    callback()
  }

  _flush(callback) {
    if (this.last !== '') {
      this.push(this.last);
      this.last = '';
    }
    callback();
  }
}

module.exports = LineSplitStream;
