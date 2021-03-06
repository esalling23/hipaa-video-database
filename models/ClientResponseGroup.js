/**
 * (Site name here)
 *
 * ClientResponseGroup page Model
 * @module index
 * @class index
 * @author Johnny Richardson
 *
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */
const _ = require('underscore')
const keystone = require('keystone')
const Types = keystone.Field.Types

/**
 * index model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
const ClientResponseGroup = new keystone.List('ClientResponseGroup', {
  label: 'Client Data Groups',
  singular: 'Client Data Group',
  nodelete: false,
  track: {
    updatedAt: true,
    createdAt: true
  }
})

/**
 * Model Fields
 * @main ClientResponseGroup
 */
ClientResponseGroup.add({

  name: {
    type: String,
    default: 'Response',
    required: true,
    initial: true
  },
  responses: {
    type: Types.Relationship,
    ref: 'ClientResponse',
    many: true
  },
  url: {
    type: String,
    label: 'User Upload'
  },
  client: {
    type: Types.Relationship,
    ref: 'User',
    many: false,
    label: 'Client Who Uploaded Item'
  },
  researcherData: {
    type: Types.Relationship,
    ref: 'ResearcherResponse',
    many: true,
    label: 'Researcher Responses to Item'
  },
  markers: {
    type: Types.Relationship,
    ref: 'VideoMarker',
    many: true,
    label: 'Researcher Video Markers for Item'
  }
})

ClientResponseGroup.schema.pre('save', function (next) {
  console.log(this)
  const that = this
  const ResearcherResponse = keystone.list('ResearcherResponse')

  if (that.researcherData.length > 0) {
    _.each(that.researcherData, function (response) {
      ResearcherResponse.model.findOne({
        _id: response
      }).exec().then(result => {
        if (!result) next()
        else {
          result.group = that._id
          result.save()

          next()
        }
      })
    })
  } else next()
})

/**
 * Model Registration
 */
ClientResponseGroup.defaultSort = '-createdAt'
ClientResponseGroup.defaultColumns = 'name, updatedAt, createdAt'
ClientResponseGroup.register()
