'use strict'

// Research Loader class
const _ = require('underscore')
const keystone = require('keystone')
const Category = keystone.list('Category')
const ResearcherResponse = keystone.list('ResearcherResponse')
const Questions = keystone.list('Question')

class ResearchLoader {
  // Returns object of filtered questions
  // based on matching action categories
  Questions (action) {
    return new Promise((resolve, reject) => {
      // get all questions and populate the actions relationship field
      Questions.model.find()
        .populate('actions')
        .exec(function (err, questions) {
          if (err || questions.length <= 0) reject(new Error('Error: No Questions'))
          // ignore questions that don't have the correct action
          const filtered = _.filter(questions, function (q) {
            return _.findWhere(q.actions, {
              key: action
            }) !== undefined
          })
          resolve(filtered)
        })
    })
  }

  // Returns actions based on parent category
  MarkerActions (category) {
    return new Promise((resolve, reject) => {
      Category.model.find({ type: 'Marker Action' })
        .populate('parent')
        .exec()
        .then(categories => {
        // If we are given a parent category
        // Return only the actions with that parent
          if (category) {
            const these = _.filter(categories, function (item) {
              return item.parent
            })
            resolve(_.filter(these, function (item) {
              return item.parent._id === category
            }))
          } else {
            // If there is no parent category just return all marker actions
            resolve(categories)
          }
        })
    })
  }

  // Returns marker categories
  MarkerCategories () {
    return new Promise((resolve, reject) => {
      // Find all categories in Keystone
      Category.model.find({})
        .then(categories => {
          if (categories.length === 0) reject(new Error('Error: No Categories'))

          // Return categories
          resolve(_.where(categories, {
            type: 'Marker Category'
          }))
        })
    })
  }

  // Returns time markers that have been added to a certain response group
  PlacedMarkers (group, categories, actions) {
    return new Promise((resolve, reject) => {
      if (!group) reject(new Error('Error: No Group'))
      if (!categories || categories.length <= 0) reject(new Error('Error: No Categories'))

      const results = {}
      let number = 1

      // Sort and group markers by time in order to number them
      let markersByTime = _.groupBy(_.sortBy(group.markers, 'time'), 'time')
      markersByTime = _.map(markersByTime, function (m) {
        // For each time group, order by which was created first
        // const group = _.sortBy(m, 'createdAt')
        m = _.map(m, function (item) {
          // Give the item a number and increment number up
          item.number = number
          number++
          return item
        })
        return m
      })

      const values = Object.keys(markersByTime).map(function (key) {
        return markersByTime[key]
      })

      // Group markers by category for categorization display
      const groupedMarkers = _.groupBy(_.flatten(values), 'category')

      _.each(groupedMarkers, function (g, key) {
        const newKey = _.findWhere(categories, {
          key: key
        }).name
        g = _.map(g, function (marker) {
          const actionName = _.findWhere(actions, {
            key: marker.action
          }).name
          marker.actionName = actionName

          return marker
        })

        results[newKey] = g
      })

      resolve(results)
    })
  }

  // Saves researcher responses
  // Takes a group, response, researcher, and marker as parameters
  SaveResearch (params) {
    const group = params[0]
    const response = params[1]
    const researcher = params[2]
    const marker = params[3]

    console.log(params, ' saving research params')

    return new Promise((resolve, reject) => {
      // console.log(group, response)
      // group.researchData = _.filter(group.researchData, function(i) {
      //   return i != undefined && i != null
      // })
      // const repeat = _.filter(group.researcherData, function(item) {
      //  return item.answer == response.value && item.question == response.key
      // })
      //
      // if (!repeat || repeat.length <= 0) {

      const obj = {
        question: response.value,
        answer: response.key,
        researcher: researcher,
        group: group._id,
        marker: marker
      }

      const newResponseGroup = new ResearcherResponse.model(obj)

      newResponseGroup.save(function (err, post) {
        // console.log(post, ' is the new response group we saved')
        if (!err && post) {
          group.researcherData.push(post)

          group.save(function (err, updatedGroup) {
            if (err) reject(err)
            resolve(post)
          })
        } else {
          reject(err)
        }
      })
    })
  }

  // Returns previously added researcher responses
  GetLogs (group, marker) {
    return new Promise((resolve, reject) => {
      ResearcherResponse.model.find()
        .populate('question researcher')
        .exec().then(result => {
          let logs
          const mostRecent = []
          let options = _.where(result, {
            group: group
          })

          options = _.filter(options, opt => {
            return opt.marker === marker
          })

          const groupedOpt = _.groupBy(options, opt => {
            return opt.question._id
          })

          _.each(groupedOpt, group => {
            group = group.reverse()
            mostRecent.push(group[0])
            options.splice(options.indexOf(group[0], 1))
          })

          if (options.length > 1) {
            logs = options.reverse()
          }

          // Logs will be undefined if there are None
          // Current log will be one entry for each question
          resolve({
            logs: logs,
            currentLog: mostRecent
          })
        })
    })
  }
}

module.exports = ResearchLoader
