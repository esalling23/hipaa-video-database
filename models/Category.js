/**
 * (Site name here)
 *
 * Category page Model
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
var Category = new keystone.List('Category',
	{
		label: 'Categorys',
		singular: 'Category',
		autokey: { from: 'name', path: 'key', unique: true }
	});

/**
 * Model Fields
 * @main Category
 */
Category.add({
	name: { type: String, default: "Category", required: true, initial: true },
	type: { type: Types.Select, label: "Type", default: 'Marker Category', options: 'Marker Category, Marker Action', required: true, initial: true },
	parent: {
		type: Types.Relationship,
		lable: 'Parent',
		dependsOn: { type: 'Marker Action' },
		ref: 'Category',
		filters: { type: 'Marker Category' }
	}
});

/**
 * Model Registration
 */
Category.defaultSort = '-createdAt';
Category.defaultColumns = 'name, updatedAt';
Category.register();
