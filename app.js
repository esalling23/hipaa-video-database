
// Return server object
serverStart = function() {

	  /* Global accessor for underscore  */
	_ = require('underscore');

  /* Global accessor for logger  */
  logger = require('winston');

	var express = require('express');
	var app = express();

	 // support json encoded bodies
	var bodyParser = require('body-parser');
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

	// Enable view template compilation caching
	app.enable('view cache');

	return app;
};

// Any custom app initialization logic should go here
appStart = function(app) {
	var keystone = require('keystone');
};

module.exports = function(frameworkDir, shared) {

	// Add main dependencies and EL web framework dependencies if not mounted with EL framework repo
	if(!shared) {
		require('app-module-path').addPath(__dirname + '/node_modules');
		require('app-module-path').addPath(frameworkDir + '/node_modules');
	}

	// Obtain app root path and set as keystone's module root
	var appRootPath = require('app-root-path').path;
	var keystoneInst = require('keystone');
	keystoneInst.set('module root', appRootPath);
	keystoneInst.set('cookie secret', '(your secret here)');
	keystoneInst.set('wysiwyg additional buttons', 'blockquote');

	return {

		keystone: keystoneInst,
		server: serverStart,
		start: appStart

	}

};
