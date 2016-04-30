var http = require('http'),
    express = require('express'),
    app = express();
    socketStream = require('./socket-stream.js'),
    store = require('./store.js'),
    config = require('./config.js'),
    port = config.port;

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);

socketStream.open(server, function(error, socket){

    socket.on('read.file', function(options){
        var readStream = store.read.file(options);
        readStream.pipe(socket);    
    });

    socket.on('upload.file', function(options){
        var rs = socket.createReadStream(),
            ws = store.upload.file(options);
        rs.pipe(ws);
    }); 

    socket.on('download.files', function(options){
        var readStream = store.download.files(options);
        readStream.pipe(socket);       
    });

    Object.keys(store).forEach(function(method){ 
      Object.keys(store[method]).forEach(function (innerMethod){          
           var action = method + '.' + innerMethod; 
           if(!socket.has(action)){
                socket.on(action, function(options){
                    store[method][innerMethod](options, function(error, result){
                        socket.send({ method: action, error: error, result: result });
                    });
                });
           }
      });
    });

});

server.listen(port);
console.log('Server running on port ' + port);








