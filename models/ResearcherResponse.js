/**
 * (Site name here)
 *
 * ResearcherResponses page Model
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
var ResearcherResponse = new keystone.List('ResearcherResponse',
	{
		label: 'Researcher Responses',
		singular: 'Researcher Response',
		nodelete: false,
		track: true
	});

/**
 * Model Fields
 * @main ResearcherResponses
 */
ResearcherResponse.add({

	name: { type: String, default: 'Response', required: true, initial: true},
	question: {
		label: 'Question',
		type: Types.Relationship,
		ref: 'Question',
		many: false
	},
	answer: { type: String, label: 'Response' }

});

/**
 * Model Registration
 */
ResearcherResponse.defaultSort = '-createdAt';
ResearcherResponse.defaultColumns = 'name, updatedAt';
ResearcherResponse.register();
