var ws = require('ws');

var createWebSocket = function(webServer, callback){

  var socketServer = new ws.Server({server: webServer});

	socketServer.on('connection', function(socket) {

    var flag = null;
    var stream = {};  
    var methods = {};
    var wrapper = {
      on: function(name, callback){
        methods[name] = callback; 
      },
      has: function(method){
        return !!methods[method];
      },
      createReadStream: function(){
         stream = {};
         return {
            on: function(name, callback){
              stream['on' + name] = callback;
            },
            pipe: function(target){
              stream.ondata = function(data) {
                  target.write(data);
              };
              stream.onend = function (){
                  target.end();
              };
            }
         };
      },
      send: function(data){
         var res = null;
         if(!(data instanceof Buffer)) {
            res = JSON.stringify({ method: data.method, error: data.error, result: data.result });
         }
         socket.send(res || data);
      }
    };

		socket.on('message', function(data) {
			 if (typeof data === 'string'){
            if(flag !== false) {
               var request = JSON.parse(data);
               if(methods[request.method]){
                  methods[request.method](request.options);
               } 
             } else { 
               stream.onend && stream.onend();
             }  
             flag = true;
        }    
        else {
          stream.ondata && stream.ondata(data);
          flag = false;
       }     
		});

    return callback( null, wrapper);

		socket.on('close', function() {
      if(wrapper.onclose){
        wrapper.onclose();
      }
		});

	});

};


module.exports = { 
	open: createWebSocket
}
