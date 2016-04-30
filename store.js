var fs = require('fs'),
	path = require('path'),
	mime = require('mime-types'),
	config = require('./config.js'),
	zip = require('./zip-stream.js'),
	streamWrapper = require('./stream-wrapper.js'),
	childProcess = require('child_process');

var readFile = function(options){
	var stream = fs.createReadStream(options.path);
	return streamWrapper.wrap(stream);
};

var readFolder = function (options, callback) {
	fs.readdir(options.path, function(err, items){
		if(err){
			return callback(err);
		}
		var colection = [];
		items.forEach(function(name){
			if(config.ingnoreFiles.indexOf(name) == -  1){
				var status = fs.statSync(path.join(options.path, name));
				var isDir = status.isDirectory();
				colection.push({
					name: name,
					folder: isDir,
					size: isDir ? '--' : status.size,
					dateModified: status.mtime,
					type : isDir ? 'Folder' : mime.lookup(name) 
				});	
			}
		});
		callback(null, colection);
	});
};

var addFile	= function (options, callback) {
	fs.open(options.path, 'a' , callback);	
};

var addFolder = function (options, callback) {
	fs.mkdir(options.path, callback);	
};

var deleteFile = function(options, callback){
	fs.unlink(options.path, callback);	
};

var deleteFolder = function (options, callback) {
	var exec = childProcess.exec;
	exec('rm -r ' + options.path, function(error, stdout, stderr){
		callback(error, true);
	});
};

var rename = function (options, callback) {
	fs.rename(options.oldPath, options.newPath, callback);
};

var download = function (options) {
 	var zipStream = zip.archive(options);
 	return streamWrapper.wrap(zipStream);
};

var writeFile = function (options){
	return fs.createWriteStream(options.path);;
};

module.exports = {
	 add: {
     	file: addFile,
     	folder: addFolder
     },
     read: {
     	file: readFile,
     	folder: readFolder
     },
     delete: {
     	file: deleteFile,
     	folder: deleteFolder
     },
     rename: {
     	file: rename,
     	folder: rename
     },
     download: {
     	files: download
     },
     upload: {
     	file: writeFile
     }
};
//copy and move
//findInFolder







