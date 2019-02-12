const cloudinary = require('cloudinary')
const _ = require('underscore')
const keystone = require('keystone')
const User = keystone.list('User')
const Questions = keystone.list('Question')
const Response = keystone.list('ClientResponse')
const Group = keystone.list('ClientResponseGroup')
const Marker = keystone.list('VideoMarker')
const TemplateLoader = require('../../lib/TemplateLoader')
const Templates = new TemplateLoader()
const ResearchLoader = require('../../lib/ResearchLoader')

exports.responses = function (req, res) {
  const currentGroup = req.body.group
  // Saves client responses to this group
  Group.model.findOne({ _id: currentGroup })
    .then(group => {
      group.responses = []
      let count = 0
      _.each(req.body.responses, function (value, key) {
        count++
        const newResponseGroup = new Response.model({
          question: key,
          answer: value
        })

        newResponseGroup.save(function (err, post) {
          if (err) res.error(err)
          group.responses.push(post)
          if (group.responses.length === count) {
            group.save(function (err, updatedGroup) {
              if (err) res.error(err)
              res.send(updatedGroup)
            })
          }
        })
      })
    })
    .catch(console.error)
}

// Stores uploaded client videos
exports.upload = function (req, res) {
  cloudinary.config({
    cloud_name: 'esalling',
    api_key: '723551514692962',
    api_secret: 'syiIllz2Vf6VglCJWRDZFsNafD8'
  })

  console.log(process.env.cloud_name)

  // Grab the data url and upload it to cloudinary
  const dataUrl = req.body.data.url
  cloudinary.v2.uploader.unsigned_upload(dataUrl, 'video-database', {
    resource_type: 'video'
  },
  function (error, result) {
    if (error) res.error(error)
    const newUpload = new Group.model({
      url: result.url,
      client: req.body.data.user
    })

    newUpload.save(function (err, post) {
      if (err) console.log(err)
      // post has been saved
      res.send(post)
    })
  })
}

exports.marker = function (req, res) {
  const data = {}
  // const questionQuery = Questions.model.find().populate('actions')
  const timestampQuery = Marker.model.findOne({
    time: req.body.time,
    category: req.body.category,
    action: req.body.action,
    group: req.body.id
  })

  timestampQuery.exec()
    .then(marker => {
      if (marker) {
        res.send({
          err: 'Markers must be unique. This particular marker already exists.'
        })
      }

      return Group.model.findOne({
        _id: req.body.id
      })
    })
    .then(group => {
      const thisTimestamp = new Marker.model({
        time: req.body.time,
        researcher: req.body.researcher,
        notes: req.body.note,
        category: req.body.category,
        action: req.body.action,
        group: group._id
      })

      thisTimestamp.save(function (err, timestamp) {
        if (err) res.throw(err)
        group.markers.push(timestamp._id)
        return group.save()
      })
    })
    .then(updatedGroup => {
      return Group.model.findOne({
        _id: updatedGroup._id
      })
        .populate('client markers researcherData responses')
    })
    .then(result => {
      data.group = result
      return new ResearchLoader().MarkerCategories()
    })
    .then(categories => {
      data.markerCategories = categories
      return new ResearchLoader().MarkerActions()
    }).then(actions => {
      return new ResearchLoader().PlacedMarkers(data.group, data.markerCategories, actions)
    }).then(groups => {
      data.groupedMarkers = groups
      return new ResearchLoader().Questions()
    }).then(questions => {
      data.questions = questions

      return User.model.findOne({
        _id: req.body.researcher
      })
    })
    .then(user => {
      data.user = user

      Templates.Load('partials/researcherModal', data, (html) => {
        data.type = 'research'
        Templates.Load('partials/form', data, (form) => {
          res.send({
            formData: form,
            modalData: html,
            group: req.body.id
          })
        })
      })
    })
    .catch(err => console.log(err))
}

// Save research response
exports.research = function (req, res) {
  const query = Group.model.findOne({
    _id: req.body.group
  }).populate('researcherData')
  query.exec(function (err, group) {
    if (err) res.error(err)
    // let newResponses
    const promisedResponses = []

    _.map(req.body.responses, function (key, value) {
      // console.log(key, value)
      promisedResponses.push([group, {
        key: key,
        value: value
      }, req.body.researcher, req.body.marker])
    })

    // Save all questions
    const promises = promisedResponses.map(new ResearchLoader().SaveResearch)

    Promise.all(promises).then(res => {
      // newResponses = res
      return query.exec()
    }).then(group => {
      return new ResearchLoader().GetLogs(req.body.group, req.body.marker)
    }).then(data => {
      Templates.Load('partials/logs', {
        researchLogs: data.logs
      }, (logsHtml) => {
        Templates.Load('partials/current-log', {
          logs: data.currentLog
        }, (currentHtml) => {
          res.send({
            logs: logsHtml,
            currentLog: currentHtml,
            success: true
          })
        })
      })
    }).catch(err => console.log(err))
  })
}
