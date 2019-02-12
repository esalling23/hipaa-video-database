/**
 * (Site name here)
 *
 * ResearchQ page Model
 * @module index
 * @class index
 * @author Johnny Richardson
 *
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

const keystone = require('keystone')
const Types = keystone.Field.Types

/**
 * index model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
const ResearchQuestions = new keystone.List('ResearchQuestions', {
  label: 'Research Questions',
  singular: 'Research Questions',
  nodelete: false,
  track: true
})

/**
 * Model Fields
 * @main ResearchQ
 */
ResearchQuestions.add({
  name: {
    type: String,
    default: 'ResearchQ Page',
    hidden: true,
    required: true,
    initial: true
  },
  questions: {
    type: Types.Relationship,
    label: 'Client Questions',
    ref: 'Question',
    many: true,
    filters: {
      client: false
    }
  }
})

ResearchQuestions.schema.statics.removeResourceRef = function (resourceId, callback) {
  ResearchQuestions.model.update({
    $or: [{
      'question': resourceId
    }]
  }, {
    $pull: {
      'question': resourceId
    }
  },
  {
    multi: true
  },
  function (err, result) {
    callback(err, result)

    if (err) console.error(err)
  })
}

/**
       Registration
 */
ResearchQuestions.defaultSort = '-createdAt'
ResearchQuestions.defaultColumns = 'name, updatedAt'
ResearchQuestions.register()
