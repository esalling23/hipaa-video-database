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
	isAdmin: { type: Boolean, label: 'Is an admin', index: true },
	isResearcher: { type: Boolean, label: 'Is a researcher', index: true }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


User.schema.pre('save', function(next) {

	console.log(this);
	var that = this;

		if (!this.clientId && !this.isResearcher) {
			console.log("setting")

			User.model.find().exec(function(err, result) {
				var id = result.length;

				console.log(id);



				that.clientId = 'client_' + id;

				console.log(that.clientId);
				console.log(that);

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
