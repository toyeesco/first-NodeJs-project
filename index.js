const logEvents = require('./logEvents');

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {};

//initialize object
const MyEmitter = new MyEmitter();

//add listener for the log event
MyEmitter.on('log', (msg) => logEvents(msg));

setTimeout(() => {
    //Emmit evnet
    MyEmitter.emit('log', 'log event emitted')
})




//server.js HOw to build with ordinary node

const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;



const logEvents = require('./logEvents');
const EventEmitter = require('events');
const { da } = require('date-fns/locale');
class Emitter extends EventEmitter { };

//initialize object
const MyEmitter = new Emitter();
MyEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));
const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf' : '' 
        );
        const data = contentType ==='application/json'
            ? JSON.parse(rawData): rawData;
        response.writeHead(filePath.includes('404.html') ? 404 : 200, { 'content-Type': contentType});
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    } catch (err) {
        console.log(err);
        MyEmitter.emit('log', '${err.name}\t${err.message}', 'errLog.txt');
        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    MyEmitter.emit('log', '${req.ul}\t${req.method}', 'reqLog.txt');

    const extention = path.extname(req.url);

    let contentType;

    switch (extention) {
        case '.css':
            contentType = 'text/css';
            break;
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.jpg': 
                contentType = 'image/jpeg';
                break;
            case '.png' :
                contentType = 'image.png';
                break;
            case '.txt':
                contentType = 'text/plain';
                break;
            default:
                contentType = 'text/html';

    }

    let filePath = 
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, requrl)

    //makes .html extension not required in the browser
    if (!extention && req.url.slice(-1) !== '/') filePath += '.html';

    const fileExistts = fs.existsSync(filePath);

    if (fileExistts) {
        // serve the file
        serveFile(filePath, contentType, res);

    } else {
        //404
        // 301 redirect
        switch(path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, {'Location': '/new-page.html'});
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, {'Location': '/'});
                res.end();
                break;
            default:
                //server a 404 response
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
                
        };
    }
    

});

server.listen(PORT, () => console.log("Server running on port ${PORT}"));


