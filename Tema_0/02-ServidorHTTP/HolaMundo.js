
var http = require('http');

var body = '<html><head><title>CORE Hola Mundo</title></head>'+
           '<body>Hola Mundo</body></html>';

var server = http.createServer(function(request, response) {
    
    console.log('Nueva peticion.');
    
    response.writeHead(200, {
	'Content-Type': 'text/html',
	'Content-Length': body.length
    });    
    
    response.end(body);
    
});

server.listen(3000);