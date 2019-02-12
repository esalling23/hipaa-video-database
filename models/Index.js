/**
 * (Site name here)
 *
 * Index page Model
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
const Index = new keystone.List('Index', {
  label: 'Index Page',
  singular: 'Index Page',
  nodelete: true
})

/**
 * Model Fields
 * @main Index
 */
Index.add({
  name: {
    type: String,
    default: 'Index Page',
    hidden: true,
    required: true,
    initial: true
  },
  intro: {
    type: Types.Markdown,
    label: 'Intro Text',
    initial: true,
    required: true
  }
})

/**
 * Model Registration
 */
Index.defaultSort = '-createdAt'
Index.defaultColumns = 'name, updatedAt'
Index.register()
