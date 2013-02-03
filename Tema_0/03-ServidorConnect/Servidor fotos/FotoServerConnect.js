
var connect = require('connect')
  , path = require('path');

connect.createServer(
    connect.logger(),
    connect.basicAuth('core', 'core'), 
    function(req, res, next) {
        if (req.method != 'GET') {
            res.writeHead(405, {'Allow': 'GET'});    
            res.end();
            return;
        }
        next();
    }, 
    connect.static(path.join(__dirname,'public'))
).listen(3000);


