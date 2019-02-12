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
const keystone = require('keystone')
const ResearcherQuestions = keystone.list('ResearchQuestions')
const Responses = keystone.list('ClientResponseGroup')
const Researcher = keystone.list('User')
const Filter = keystone.list('Filter')
const _ = require('underscore')

exports = module.exports = function (req, res) {
  const view = new keystone.View(req, res)
  const locals = res.locals

  // Init locals
  locals.section = 'researcher'

  view.on('init', function (next) {
    const queryResearcherQ = ResearcherQuestions.model.findOne({}, {}, {
      sort: {
        'createdAt': -1
      }
    }).populate('questions')

    const queryUploads = Responses.model.find({}, {}, {
      sort: {
        'createdAt': -1
      }
    }).populate('questions markers client researcherData')

    queryResearcherQ.exec()
      .then(result => {
        locals.questionaire = result
        return queryUploads.exec()
      })
      .then(uploads => {
        uploads = _.filter(uploads, function (u) {
          return u.responses.length > 0
        })
        locals.uploads = uploads
        return Filter.model.find({})
      })
      .then(filters => {
        locals.filters = filters
        return Researcher.model.findOne({ _id: req.params.id })
      }).then(user => {
        locals.user = user
        next()
      })
      .catch(console.error)
  })

  // Render the view
  view.render('researcher')
}
