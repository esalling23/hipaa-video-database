/**
 * (Site name here)
 * Developed by Engagement Lab, 2016
 * ==============
 * Index page view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class Index
 * @author
 *
 * ==========
 */
var keystone = require('keystone'),
    ClientQuestions = keystone.list('ClientQuestions'),
    _ = require('underscore');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = 'client';

    view.on('init', function(next) {

        var queryClientQuestions = ClientQuestions.model.findOne({}, {}, {
            sort: {
                'createdAt': -1
            }
        }).populate('questions');

        queryClientQuestions.exec(function(err, result) {
            if (err) throw err;

            locals.questionaire = result;

            next();

        });

    });

    // Render the view
    view.render('client');

};
