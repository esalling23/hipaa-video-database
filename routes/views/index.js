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

exports = module.exports = function (req, res) {
  const view = new keystone.View(req, res)
  const locals = res.locals

  // Init locals
  locals.section = 'index'

  view.on('init', function (next) {
    next()
  })
  // Render the view
  view.render('index')
}
