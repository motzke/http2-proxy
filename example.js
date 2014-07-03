var fs = require('fs');

var spdy = require('spdy'),
    fs = require('fs');

var options = {
  key: fs.readFileSync('./privateKey.key'),
  cert: fs.readFileSync('./certificate.crt'),

  // **optional** SPDY-specific options
  windowSize: 1024 * 1024, // Server's window size

  // **optional** if true - server will send 3.1 frames on 3.0 *plain* spdy
  autoSpdy31: true
};

var server = spdy.createServer(options, function(req, res) {
  res.writeHead(200);
  res.end('hello world!');
});

server.listen(8080);