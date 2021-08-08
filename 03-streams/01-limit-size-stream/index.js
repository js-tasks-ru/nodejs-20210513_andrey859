const LimitSizeStream = require('./LimitSizeStream');
const fs = require('fs');
const {createReadStream} = require('fs');
const path = require('path');

const FILE_NAME = path.resolve(process.cwd(), './from.txt');

const limitedStream = new LimitSizeStream({limit: 59, encoding: 'utf-8'}); // 8 байт
const outStream = fs.createWriteStream('out.txt');
const readSt = createReadStream(FILE_NAME, {highWaterMark : 2});

readSt
    .pipe(limitedStream)
    .pipe(outStream);

// limitedStream.pipe(outStream);
//
// limitedStream.write('hello'); // 'hello' - это 5 байт, поэтому эта строчка целиком записана в файл
//
// setTimeout(() => {
//   limitedStream.write('world'); // ошибка LimitExceeded! в файле осталось только hello
// }, 10);
