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

var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * index model
 * @constructor
 * See: http://keystonejs.com/docs/database/#lists-options
 */
var ClientResponseGroup = new keystone.List('ClientResponseGroup',
	{
		label: 'Client Data Groups',
		singular: 'Client Data Group',
		nodelete: false,
		track: true
	});

/**
 * Model Fields
 * @main ClientResponseGroup
 */
ClientResponseGroup.add({

	name: { type: String, default: 'Response', required: true, initial: true},
	responses: {
		type: Types.Relationship,
		ref: 'ClientResponse',
		many: true
	},
	url: { type: String, label: 'User Upload' },
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
	timestamps: {
		type: Types.Relationship,
		ref: 'Timestamp',
		many: true,
		label: 'Researcher Timestamps for Item'
	}


});

/**
 * Model Registration
 */
ClientResponseGroup.defaultSort = '-createdAt';
ClientResponseGroup.defaultColumns = 'name, updatedAt';
ClientResponseGroup.register();
