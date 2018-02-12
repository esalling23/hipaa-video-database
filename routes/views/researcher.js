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
    ResearcherQuestions = keystone.list('ResearchQuestions'),
    Responses = keystone.list('ClientResponseGroup'),
    _ = require('underscore');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = 'researcher';

    view.on('init', function(next) {

        var queryResearcherQ = ResearcherQuestions.model.findOne({}, {}, {
            sort: {
                'createdAt': -1
            }
        }).populate('questions');

        var queryUploads = Responses.model.find({}).populate('questions timestamps client researcherData');

        queryResearcherQ.exec(function(err, result) {
            if (err) throw err;

            locals.questionaire = result;

            queryUploads.exec(function(err, uploads) {
              locals.uploads = uploads;
              next();

            });

        });

    });

    // Render the view
    view.render('researcher');

};
