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
const ClientQuestions = keystone.list('ClientQuestions')
const Client = keystone.list('User')

exports = module.exports = function (req, res) {
  const view = new keystone.View(req, res)
  const locals = res.locals
  console.log(req.params)
  // Init locals
  locals.section = 'client'

  view.on('init', function (next) {
    const queryClientQuestions = ClientQuestions.model.findOne({}, {}, {
      sort: {
        'createdAt': -1
      }
    }).populate('questions')

    queryClientQuestions.exec(function (err, result) {
      if (err) throw err

      locals.questionaire = result

      Client.model.findOne({
        _id: req.params.id
      }).exec(function (err, user) {
        console.log(err, user)

        locals.user = user
        next()
      })
    })
  })
  // Render the view
  view.render('client')
}
