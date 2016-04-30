var archiver = require('archiver');
   
var makeArchive = function (options) {
     var archive = archiver('zip');

     archive.bulk([{ 
          src: options.src || [ '**/*' ], // else whole directory
          cwd: options.path, 
          expand: true 
     }]);

     archive.finalize();
     return archive;  
};

module.exports = {
     archive: makeArchive
};