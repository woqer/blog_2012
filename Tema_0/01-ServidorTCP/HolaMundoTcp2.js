
var net = require('net');

var body = '<html><head><title>CORE Hola Mundo</title></head>'+
    '<body>Hola Mundo</body></html>';

net.createServer(function(client) {
    
    // No miro nada.
    // Al recibir cualquier cosa: log, contesto y cierro.

    client.on('data',function(data) {
	
        console.log(data.toString());
	
	client.write('HTTP/1.1 200 OK\n');
	client.write('Content-Length: '+ body.length+'\n');
	client.write('Content-Type: text/html\n');
	client.write('\n');
	client.end(body);
    });

}).listen(3000);