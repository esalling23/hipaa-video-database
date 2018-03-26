var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User', {
	track: true
});

User.add({
	name: { type: String, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	clientId: { type: String }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Is an admin', index: true, note: 'This gives acces to Keystone CMS' },
	isResearcher: { type: Boolean, label: 'Is a researcher', index: true },
	accessLvl: { type: Types.Select, options: 'Assistant, Analyzer, Admin' }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


User.schema.pre('save', function(next) {

	console.log(this);
	var that = this;

	if (that.isResearcher && that.accessLvl == 'Admin')
		that.isAdmin = true;

	if (!this.clientId && !this.isResearcher) {

		User.model.find().exec(function(err, result) {
			var id = result.length;
			that.clientId = 'client_' + id;

			next();

		});

	} else
    next();

});


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();
