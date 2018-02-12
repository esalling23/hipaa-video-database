/**
 * (Site name here)
 *
 * Question page Model
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
var Question = new keystone.List('Question',
	{
		label: 'Question',
		singular: 'Questions',
		nodelete: false
	});

/**
 * Model Fields
 * @main Question
 */
Question.add({
	name: { type: String, label: 'Question Name', required: true, initial: true },
	question: { type: String, label: "Question Text" },
	client: { type: Boolean, label: 'Is this a client-facing question?' },
  type: { type: Types.Select, label: "Type of Question", options: 'Dropdown, Text, Bubble Select' },

  options: { type: Types.TextArray, label: 'Options', dependsOn: { type: ['Dropdown', 'Bubble Select']}}

});

/**
 * Model Registration
 */
Question.defaultSort = '-createdAt';
Question.defaultColumns = 'name, updatedAt';
Question.register();
