
var net = require('net');

var body = '<html><head><title>CORE Hola Mundo</title></head>'+
           '<body>Hola Mundo</body></html>';

net.createServer(function(client) {

    // No espero a nada.
    // Cuando un cliente se conecta, contesto y cierro.
    
    client.write('HTTP/1.1 200 OK\n');
    client.write('Content-Length: '+ body.length+'\n');
    client.write('Content-Type: text/html\n');
    client.write('\n');
    client.end(body);
    
}).listen(3000);