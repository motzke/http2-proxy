var spdy = require('spdy');
var http = require('http');
var fs = require('fs');
var url = require('url');
var htmlparser = require("htmlparser2");
var handler = require("./nodeHandler");
var Parser = new htmlparser.Parser(handler.handler);
var options = {
  key: fs.readFileSync('./hackedkey.key'),
  cert: fs.readFileSync('./certificate.crt'),

  // **optional** SPDY-specific options
  windowSize: 1024 * 1024, // Server's window size

  // **optional** if true - server will send 3.1 frames on 3.0 *plain* spdy
  autoSpdy31: true
};

Parser.on("onend", function(){
  console.log("parsing ended.")
});

spdy.createServer(options, function(request, response) {
  var queryObject = url.parse(request.url,true).query;
  if(!queryObject.url){
    response.writeHead(404, "not found");
    response.end();
  }
  else{
     var proxyUrl = url.parse(queryObject.url)
      proxyUrl.method = request.method;
      proxyUrl.headers = request.headers;

    var proxy_request = http.request(proxyUrl, function(proxy_response){
      proxy_response.on('data', function(chunk) {
        response.write(chunk, 'binary');
        Parser.write(chunk);
      });
      proxy_response.on('end', function() {
        response.write("pups");
        response.end();
        Parser.end()
      });
      response.writeHead(proxy_response.statusCode, proxy_response.headers);
    });

    
    console.log(proxyUrl);

    request.on('data', function(chunk) {
      proxy_request.write(chunk, 'binary');
    });
    request.on('end', function() {
      proxy_request.end();
    });
  }
}).listen(8080);

