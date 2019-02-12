/**
 * (Site name here)
 *
 * ClientResponses page Model
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
const ClientResponse = new keystone.List('ClientResponse', {
  label: 'Client Responses',
  singular: 'Client Response',
  nodelete: false,
  track: true
})

/**
 * Model Fields
 * @main ClientResponses
 */
ClientResponse.add({
  name: {
    type: String,
    default: 'Response',
    required: true,
    initial: true
  },
  question: {
    label: 'Question',
    type: Types.Relationship,
    ref: 'Question',
    many: false
  },
  answer: {
    type: String,
    label: 'Response'
  }
})

/**
 * Model Registration
 */
ClientResponse.defaultSort = '-createdAt'
ClientResponse.defaultColumns = 'name, updatedAt'
ClientResponse.register()
