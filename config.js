var path = require('path');
var config = {
	port: process.env.PORT || 9000,
	store: {
		path: path.join(__dirname, 'Store'),
	},
	ingnoreFiles: ['.DS_Store']  // TODO: finish exclude list [".DS_Store", "destop.ini"]
	
};

module.exports = config;