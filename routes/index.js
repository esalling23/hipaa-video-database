/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */
var express = require('express');
var router = express.Router();
var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
    api: importRoutes('./api'),
    views: importRoutes('./views')
};

router.use(express.json({limit:'50mb'}));
// Setup Route Bindings

// /keystone redirect
router.all('/admin', function(req, res, next) {
    res.redirect('/keystone');
});

// Views
router.get('/', routes.views.index);

router.get('/researcher/:id', routes.views.researcher);
router.get('/client/:id', routes.views.client);

router.post('/api/load/researchModal', keystone.middleware.api, routes.api.load.researchModal);

router.post('/api/research', keystone.middleware.api, routes.api.save.research);
router.post('/api/saveTimestamp', keystone.middleware.api, routes.api.save.timestamp);

router.post('/api/saveResponses', keystone.middleware.api, routes.api.save.responses);
router.post('/api/upload', keystone.middleware.api, routes.api.save.upload);

router.post('/api/login', keystone.middleware.api, routes.api.login.get);
router.post('/api/signup', keystone.middleware.api, routes.api.login.create);

module.exports = router;
