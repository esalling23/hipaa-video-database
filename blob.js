require('dotenv').config();

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var merge = require('merge');
var morgan = require('morgan');
var compression = require('compression');

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

  'admin path': 'keystone',

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

	'cloudinary prefix': 'keystone',

	// prefix each image public_id with [{prefix}]/{list.path}/{field.path}/
	'cloudinary folders': true,

	'cloudinary secure': true
});

keystone.import('models');

keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

keystone.set('routes', require('./routes'));
app.use(require('./routes'));

app.use(express.static('public'));

app.use(compression());

app.use(bodyParser.urlencoded({
	extended: true,
	limit: "500000000000000000mb",
	parameterLimit: 5000000,
	type:'application/x-www-form-urlencoding'
}));

app.use(bodyParser.json({
	limit: "500000000000000000mb",
	type:'application/json'
}));


keystone.set('nav', {
	'User': 'User'
});

keystone.set('cors allow origin', true);

keystone.start();
