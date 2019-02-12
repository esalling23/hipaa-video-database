/**
 * (Site name here)
 *
 * Filter page Model
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
const Filter = new keystone.List('Filter', {
  label: 'Filters',
  singular: 'Filter',
  autokey: {
    from: 'name',
    path: 'key',
    unique: true
  }
})

/**
 * Model Fields
 * @main Filter
 */
Filter.add({
  name: {
    type: String,
    default: 'Filter',
    hidden: true,
    required: true,
    initial: true
  },
  type: {
    type: Types.Select,
    label: 'Type',
    options: 'Filter, Sort',
    required: true,
    initial: true
  }
})

/**
 * Model Registration
 */
Filter.defaultSort = '-createdAt'
Filter.defaultColumns = 'name, updatedAt'
Filter.register()
