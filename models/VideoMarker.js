/**
 * (Site name here)
 *
 * Video Marker page Model
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
var VideoMarker = new keystone.List('VideoMarker',
	{
		label: 'Video Markers',
		singular: 'Video Marker',
		nodelete: false,
		track: true
	});

/**
 * Model Fields
 * @main Video Marker
 */
VideoMarker.add({

	name: { type: String, default: 'Response', required: true, initial: true },
	time: { type: String, label: 'Time' },
	notes: { type: String, label: 'Notes' },
	researcher: {
		type: Types.Relationship,
		ref: 'User',
		many:false
	}

});

/**
 * Model Registration
 */
VideoMarker.defaultSort = '-createdAt';
VideoMarker.defaultColumns = 'name, updatedAt';
VideoMarker.register();
