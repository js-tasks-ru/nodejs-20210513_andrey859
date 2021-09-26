const url = require('url');
const http = require('http');
const path = require('path');
const {createReadStream} = require('fs');
const fs = require('fs');
// import { access, constants } from 'fs';
const {access, constants} = require('fs')

const server = new http.Server();

server.on('request', (req, res) => {

    // (async function() {
    //   const body = [];
    //   for await (const chunk of req) {
    //     body.push(chunk)
    //   }
    //   console.log(JSON.parse(Buffer.concat(body).toString()));
    // })();

    console.log(req.url)
    // console.log(req.headers.host)
    const url = new URL(req.url, `http://${req.headers.host}`)
    // console.log(url)
    let pathname = url.pathname.slice(1)
    // console.log(pathname)

    // console.log(req.method)
    // console.log(req.options)

    try {
        pathname = decodeURIComponent(pathname);
    } catch (e) {
        res.statusCode = 400;
        res.end("Bad request..");
        return;
    }
    if (pathname.indexOf('/') != -1) {
        res.statusCode = 400;
        res.end("Attached files are not allowed");
        // console.log("Attached files are not allowed")
        return;
    }
    const filepath = path.join(__dirname, 'files', pathname);
    console.log(filepath)

    // access(filepath, constants.F_OK, (err) => {
    //     console.log(`${filepath} ${err ? 'does not exist' : 'exists'}`);
    //     if (err) {
    //
    //     } else {
    //         res.statusCode = 409;
    //         res.end("File always exist..");
    //     }
    // });

    switch (req.method) {
        case 'GET':
            const readStream = createReadStream(filepath);
            readStream.on('error', err => {
                if (err.code == 'ENOENT') {
                    res.statusCode = 404;
                    res.end('File doesn\'t exist, you must search better..')
                    console.log('File doesn\'t exist, you must search better..');
                } else {
                    console.error(err)
                }
            })

            // readStream.on('aborted', () => {
            //   res.end();
            // })
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            // console.log('Response headers: ', JSON.stringify(res.getHeaders(), null, 2));
            // console.log(`Response headers sent: `, res.headersSent);
            // res.writeHead(200, 'OK');
            readStream.pipe(res);
            // readStream.pipe(process.stdout);
            readStream.on('end', () => {
                res.end();
                console.log(res)
            })

            break;

        default:
            res.statusCode = 501;
            res.end('Not implemented');
    }
});

module.exports = server;
