var zip = require('./zip-stream.js');

var wrap = function (stream) {
	return {
		// add stream wrapper abstraction
		pipe : function(socket) {
			stream.on('data', function(data) {
                socket.send(data);
            });
            stream.on('end', function (){
                socket.send('end');
            });
		}
	}; 
};

module.exports = {
     wrap: wrap
};