const url = require('url');
const http = require('http');
const path = require('path');
const {access, constants, createWriteStream, unlink} = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', async (req, res) => {
    // console.log(req.url)
    console.log(req.form)
    const url = new URL(req.url, `http://${req.headers.host}`)
    const pathname = url.pathname.slice(1)
    const filepath = path.join(__dirname, 'files', pathname);

    if (pathname.indexOf('/') != -1 || pathname.includes('..')) {
        res.statusCode = 400;
        res.end("Attached files are not allowed");
        // console.log("Attached files are not allowed")
        return;
    }
    // console.log(req)
    // console.log(req.headers)
    // console.log(req.headers['content-type'])

    if (req.headers['content-length'] > 1e6) {
        res.statusCode = 413;
        res.end('File is too big!');
        return;
    }

    const writeStream = createWriteStream(filepath, {flags: 'wx'});

    writeStream.on('error', (error) => {
        if (error.code === 'EEXIST') {
            res.statusCode = 409;
            res.end('File exists');
        } else {
            res.statusCode = 500;
            res.end('Internal server error');
            fs.unlink(filepath, (error) => {});
        }
    });

    req.on('aborted', () => {
        unlink(filepath, (err) => {
            if (err) return console.log(err);
            console.log('writeStream has been aborted. file deleted');
        });
        res.end();
    })

    // try {
    //   pathname = decodeURIComponent(pathname);
    // } catch (e) {
    //   res.statusCode = 400;
    //   res.end("Bad request..");
    //   return;
    // }

    // req.on('error', err => {
    //    res.statusCode = 500;
    //    res.end('Occurred an error...')
    //     console.log(err)
    // });

    writeStream.on('finish', () => {
        res.statusCode = 201;
        res.end("All OK");
        console.log('writestream event \'finish\' has been done');
    });


    switch (req.method) {
        case 'POST':

            const limitedStream = new LimitSizeStream({limit: 1e6 /*,1048576 encoding: 'utf-8'*/});

            limitedStream.on('error', (error) => {
                // console.log(error.code)
                if (error.code === 'LIMIT_EXCEEDED') {
                    res.statusCode = 413;
                    res.end('Limit exceeded, file too big');

                } else {
                    res.statusCode = 500;
                    res.end('Internal server error');
                }
                unlink(filepath, (err) => {
                    if (err) return console.log(err);
                    console.log('file too big');
                })
            });

            req
                .pipe(limitedStream)
                .pipe(writeStream)

            break;

        default:
            res.statusCode = 501;
            res.end('Not implemented');
    }

    // access(filepath, constants.F_OK, (err) => {
    //     if (!err) {
    //         res.statusCode = 409;
    //         res.end("File always exist..");
    //         console.log("File always exist..");
    //         return;
    //     } else {
    //
    //     }
    // })
})

module.exports = server;
