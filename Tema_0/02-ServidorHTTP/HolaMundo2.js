
var http = require('http');

var body = '<html><head><title>CORE Hola Mundo</title></head>'+
           '<body>Hola Mundo</body></html>';

http.createServer(function(request, response) {
    
    console.log('Nueva peticion.');
    
    response.writeHead(200, {
	'Content-Type': 'text/html'
    });    
    
    response.end(body);
    
}).listen(3000);