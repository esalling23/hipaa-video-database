/**
 * (Site name here)
 *
 * Timestamps page Model
 * @module index
 * @class index
 * @author Johnny Richardson
 *
 * For field docs: http://keystonejs.com/docs/database/
 *
 * ==========
 */

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * index model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var Timestamp = new keystone.List('Timestamp',
	{
		label: 'Timestamps',
		singular: 'Timestamp',
		nodelete: false
	});

/**
 * Model Fields
 * @main Timestamps
 */
Timestamp.add({

	name: { type: String, default: 'Response', required: true, initial: true },
	time: { type: String, label: 'Time' },
	notes: { type: String, label: 'Notes' },
	createdBy: {
		type: Types.Relationship,
		ref: 'User',
		many:false
	}

});

/**
 * Model Registration
 */
Timestamp.defaultSort = '-createdAt';
Timestamp.defaultColumns = 'name, updatedAt';
Timestamp.register();
