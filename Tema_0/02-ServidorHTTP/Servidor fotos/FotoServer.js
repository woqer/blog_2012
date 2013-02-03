
var http = require('http');
var fs = require('fs');
var url = require('url');

http.createServer(function(request, response) {

    if (request.method != 'GET') {
	 	response.writeHead(405, {'Allow': 'GET'});    
		response.end();
		return;
    }

    var filepath = url.parse(request.url).pathname;

    if (filepath == '/') filepath = '/index.html';

    var rs = fs.createReadStream('public'+filepath);

    rs.pipe(response);
	    
    rs.on('error',function(error) {
		response.end('Error leyendo '+request.url);
    });
  
}).listen(3000);