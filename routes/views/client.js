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
    Client = keystone.list("User"),
    _ = require('underscore');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;
        console.log(req.params);
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

            Client.model.findOne({ _id: req.params.id }).exec(function(err, user) {

              console.log(err, user);

              locals.user = user;
              next();

            });

        });

    });

    // Render the view
    view.render('client');

};
