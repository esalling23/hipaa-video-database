/**
 * (Site name here)
 *
 * ClientQ page Model
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
var ClientQuestions = new keystone.List('ClientQuestions',
	{
		label: 'Client Questions',
		singular: 'Client Questions',
		nodelete: false
	});

/**
 * Model Fields
 * @main ClientQ
 */
ClientQuestions.add({

	name: { type: String, default: 'Questionaire', required: true, initial: true},
	questions: {
		type: Types.Relationship,
		label: "Client Questions",
		ref: 'Question',
		many: true,
		filters: { client: true }
	}

});

/**
 * Model Registration
 */
ClientQuestions.defaultSort = '-createdAt';
ClientQuestions.defaultColumns = 'name, updatedAt';
ClientQuestions.register();
