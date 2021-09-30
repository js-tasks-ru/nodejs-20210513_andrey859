const url = require('url');
const http = require('http');
const path = require('path');
const {access, constants, unlink} = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname.slice(1);

    const filepath = path.join(__dirname, 'files', pathname);

    if (pathname.indexOf('/') != -1) {
        res.statusCode = 400;
        res.end("Attached files are not allowed");
        // console.log("Attached files are not allowed")
        return;
    }

    access(filepath, constants.F_OK, async (err) => {
        if (err) {
            res.statusCode = 404;
            res.end("File is absent");
            console.log("File is absent");
        } else {
            switch (req.method) {
                case 'DELETE':
                    await unlink(filepath, (err) => {
                        if (err) {
                            res.statusCode = 500;
                            res.end();
                            console.log(err);
                            return;
                        }
                    });
                    res.statusCode = 200;
                    res.end();
                    console.log('file deleted successfully');
                    break;

                default:
                    res.statusCode = 501;
                    res.end('Not implemented');
            }
        }
    })
})
module.exports = server;
