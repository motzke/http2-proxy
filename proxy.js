var spdy = require('spdy');
var http = require('http');
var https = require('https');
var fs = require('fs');
var url = require('url');

var options = {
  key: fs.readFileSync('./hackedkey.key'),
  cert: fs.readFileSync('./certificate.crt'),

  // **optional** SPDY-specific options
  windowSize: 1024 * 1024, // Server's window size

  // **optional** if true - server will send 3.1 frames on 3.0 *plain* spdy
  autoSpdy31: true
};


process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
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
      proxyUrl.headers["accept-encoding"] = "identity";
      proxyUrl.headers["referer"] = "";
      proxyUrl.headers["host"] = url.hostname;

    var proxy_request;
    if(proxyUrl.protocol == "http:"){
      proxy_request = http.request(proxyUrl);
    }
    else{
      proxy_request = https.request(proxyUrl);
    } 

    proxy_request.on("response", function(proxy_response){

      response.writeHead(200, proxy_response.headers);
  		console.log("content-type " + proxy_response.headers["content-type"]);
    	if(proxy_response.headers && proxy_response.headers["content-type"] && proxy_response.headers["content-type"].indexOf("text") != -1 && proxy_response.headers["content-type"].indexOf("html") != -1){
            console.log("Turning on html parser.");
            var htmlparser = require("htmlparser2");
            var handler = require("./nodeHandler");
            var Parser = new htmlparser.Parser(handler.handler);	
            handler.setContext(proxyUrl);
            proxy_response.on('data', function(chunk) {
              Parser.write(chunk);
            });
            proxy_response.on('end', function() {
              response.write(""+handler.getHTML());
              response.end();
              Parser.end()
              Parser.reset();
            });
    		
    		
    	}
    	else{
            console.log("writing binary data");
            proxy_response.on('data', function(chunk) {
              response.write(chunk, "binary");
            });
            proxy_response.on('end', function() {
              response.end();
            });
  	}
		

      
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

