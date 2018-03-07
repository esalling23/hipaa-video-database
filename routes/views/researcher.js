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
    Filter = keystone.list("Filter"),
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

        var queryUploads = Responses.model.find({}, {}, {
            sort: {
                'createdAt': -1
            }
        }).populate('questions markers client researcherData');

        queryResearcherQ.exec(function(err, result) {
            if (err) throw err;

            locals.questionaire = result;

            queryUploads.exec(function(err, uploads) {
              locals.uploads = uploads;

              Filter.model.find({}).exec(function(err, filters){
                locals.filters = filters;
                next();

              });

            });

        });

    });

    // Render the view
    view.render('researcher');

};
