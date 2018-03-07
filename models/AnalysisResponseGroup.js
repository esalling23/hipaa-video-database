/**
 * (Site name here)
 *
 * AnalysisResponseGroup page Model
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
var AnalysisResponseGroup = new keystone.List('AnalysisResponseGroup',
	{
		label: 'Analysis Data Groups',
		singular: 'Analysis Data Group',
		nodelete: false,
		track: { updatedAt: true, createdAt: true }
	});

/**
 * Model Fields
 * @main AnalysisResponseGroup
 */
AnalysisResponseGroup.add({

	name: { type: String, default: 'Response', required: true, initial: true},
	responses: {
		type: Types.Relationship,
		ref: 'ClientResponse',
		many: true
	},
	client: {
		type: String,
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


});

/**
 * Model Registration
 */
AnalysisResponseGroup.defaultSort = '-createdAt';
AnalysisResponseGroup.defaultColumns = 'name, updatedAt, createdAt';
AnalysisResponseGroup.register();
