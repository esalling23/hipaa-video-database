const _ = require('underscore')
const appRoot = require('app-root-path')
const TemplateLoader = require(appRoot + '/lib/TemplateLoader')
const ResearchLoader = require(appRoot + '/lib/ResearchLoader')
const keystone = require('keystone')
const User = keystone.list('User')
const ClientResponseGroup = keystone.list('ClientResponseGroup')
// const ResearcherResponse = keystone.list('ResearcherResponse')
// const Questions = keystone.list('Question')
// const Category = keystone.list('Category')

// Loads Researcher Modal
exports.researchModal = function (req, res) {
  const Templates = new TemplateLoader()
  const data = {}

  // Set up the query for the ClientResponseGroup
  // based on the _id field
  ClientResponseGroup.model.find()
    .populate('client markers researcherData responses')
    .exec(function (err, list) {
      // Catch errors or non-existent result
      if (err) res.error(err)
      if (!list) res.error('No Groups')
      // Determine group
      _.each(list, function (item, i) {
        if (item._id === req.body.group) {
          console.log(item._id, req.body.next)
          // If we are going to the next group
          // find the current one and find the next one in line
          if (req.body.next) {
            let num = i + 1
            if (num >= list.length) num = 0
            data.group = list[num]
            console.log(num, list.length)
          } else data.group = item
        }
      })
      // Return the time-marker categories
      return new ResearchLoader().MarkerCategories()
    })
    .then(res => {
      data.markerCategories = res
      // Return the time-marker actions
      return new ResearchLoader().MarkerActions()
    })
    .then(actions => {
      // Return the already-placed time-markers based on returned actions
      return new ResearchLoader().PlacedMarkers(data.group, data.markerCategories, actions)
    })
    .then(groups => {
      // set the groupedMarkers field on the data object to be the grouped
      // and already-placed markers
      data.groupedMarkers = groups
      // Locate the researcher user based on the user parameter in the body
      return User.model.findOne({
        _id: req.body.user
      })
    })
    .then(user => {
      data.user = user
      // Load the researcherModal partial with the data object
      Templates.Load('partials/researcherModal', data, (html) => {
        // Send the html and the group ID for use on front-end
        res.send({
          eventData: html,
          group: data.group._id
        })
      })
    })
    .catch(err => console.log(err))
}

// Loads forms
exports.form = function (req, res) {
  const Templates = new TemplateLoader()
  const data = {}
  // First get all logs
  new ResearchLoader()
    .GetLogs(req.body.group, req.body.marker)
    .then(res => {
      data.mostRecent = res.mostRecent
      data.logs = res.logs
      data.currentLog = res.currentLog
      // Get questions that apply to this particular action
      return new ResearchLoader().Questions(req.body.action)
    }).then(questions => {
      data.questions = questions
      // Return the user model
      return User.model.findOne({
        _id: req.body.user
      })
    }).then(user => {
      data.user = user
      data.type = 'research'

      Templates.Load('partials/form', data, (formsHtml) => {
        Templates.Load('partials/logs', {
          researchLogs: data.logs
        }, (logsHtml) => {
          Templates.Load('partials/current-log', {
            logs: data.currentLog
          }, (currentLog) => {
            res.send({
              formData: formsHtml,
              logsData: logsHtml,
              currentLog: currentLog,
              group: req.body.group,
              responses: data.logs
            })
          })
        })
      })
    }).catch(err => console.log(err))
}

// Load the actions associated with this marker category
exports.markerActions = function (req, res) {
  const Templates = new TemplateLoader()
  const data = {}

  new ResearchLoader()
    .MarkerActions(req.body.category)
    .then(actions => {
      data.markerActions = actions

      Templates.Load('partials/markerActions', data, (html) => {
        res.send({
          eventData: html
        })
      })
    }).catch(err => console.log(err))
}
