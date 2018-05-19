require('dotenv').config();

var express = require('express');
var app = express();
var merge = require('merge');

// Require keystone
var debug = require('debug')('keystone');
var keystone = require('keystone');

var hbs = require('express-handlebars');
var config = require('./config.json');

var name = 'KeystoneJS Glitch APP debug:'
debug('booting %s', name)

var coreHelpers = require('./templates/helpers/core.js')();
var moduleHelpers = require('./templates/helpers/index.js')();

var helpers = merge(coreHelpers, moduleHelpers);
var hbsInstance = hbs.create({
											layoutsDir: './templates/layouts',
											partialsDir: './templates/partials',
											defaultLayout: 'base',
											helpers: helpers,
											extname: '.hbs'
									});

keystone.init({
	'name': 'KeystoneJS Glitch App',
	'brand': 'KeystoneJS Glitch App',

  'admin path': 'admin',

	'sass': 'public',
	'static': 'public',
	// 'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'hbs',
	'handlebars': hbsInstance,
	'custom engine': hbsInstance.engine,

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
});

keystone.import('models');

keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

keystone.set('routes', require('./routes'));

keystone.set('nav', config.admin_nav);

keystone.start();

app.use(express.static('public'));
