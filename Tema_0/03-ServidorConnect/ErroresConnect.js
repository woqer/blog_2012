
var connect = require('connect')
  , path = require('path');

connect.createServer(
    connect.logger(),
    function(req, res, next) {
        next(new Error('Error imprevisto'));
    },
    connect.static(path.join(__dirname,'public')),
    connect.errorHandler()
).listen(3000);


