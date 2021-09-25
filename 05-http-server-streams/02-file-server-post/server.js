const url = require('url');
const http = require('http');
const path = require('path');
const {open, access, constants, appendFile, write, createWriteStream, unlink} = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', async (req, res) => {
    // console.log(req.url)
    console.log(req.form)
    const url = new URL(req.url, `http://${req.headers.host}`)
    const pathname = url.pathname.slice(1)

    // try {
    //   pathname = decodeURIComponent(pathname);
    // } catch (e) {
    //   res.statusCode = 400;
    //   res.end("Bad request..");
    //   return;
    // }

    server.on('error', err => {
       res.statusCode = 500;
       res.end('Occurred a server error...')
        console.log(err)
    });

    if (pathname.indexOf('/') != -1) {
        res.statusCode = 400;
        res.end("Attached files are not allowed");
        // console.log("Attached files are not allowed")
        return;
    }

    const filepath = path.join(__dirname, 'files', pathname);

    access(filepath, constants.F_OK, (err) => {
        if (!err) {
            res.statusCode = 409;
            res.end("File always exist..");
            console.log("File always exist..");
            return;
        } else {
            switch (req.method) {
                case 'POST':
                    const limitedStream = new LimitSizeStream({limit: 1048576 /*,1048576 encoding: 'utf-8'*/});
                    limitedStream.on('error', (error) => {
                        // console.log(error.code)
                        if (error.code === 'LIMIT_EXCEEDED') {
                            res.statusCode = 413;
                            res.end('Limit exceeded');
                            unlink(filepath, (err) => {
                                if (err) return console.log(err);
                                console.log('file deleted successfully');
                            });
                        }
                    });

                    const writeStream = createWriteStream(filepath);

                    writeStream.on('aborted', () => {
                        unlink(filepath, (err) => {
                            if (err) return console.log(err);
                            console.log('file deleted successfully');
                        });
                        res.end();
                    })

                    req
                        .pipe(limitedStream)
                        .pipe(writeStream)

                    break;

                default:
                    res.statusCode = 501;
                    res.end('Not implemented');
            }
        }
    })
})

module.exports = server;
