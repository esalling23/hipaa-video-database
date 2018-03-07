var keystone = require('keystone'),
	User = keystone.list('User'),
	appRoot = require('app-root-path'),
    TemplateLoader = require(appRoot + '/lib/TemplateLoader'),
    _ = require('underscore');

// Signup
exports.create = function(req, res) {

	// console.log(req.body);

	User.model.find().exec(function(err, result) {
		var id = result.length;

		var newUser = new User.model({
			name: req.body.username,
			email: req.body.email,
			password: req.body.password
		});

		if (req.body.isResearcher)
			newUser.isResearcher = true;
		else
			newUser.clientId = 'client_' + id;

		newUser.save(function(err, result) {
			console.log(result);
			var data = {
				user: result,
				url: '/client/' + result.id
			}
			res.send(data)
		});
	})



}

// Login
exports.get = function(req, res) {

	// console.log(req.body);
	var body = req.body.data ? JSON.parse(req.body.data) : req.body;

	var query = User.model.find();

	// console.log(body.email);

	query.exec((err, list) => {


		var user = _.findWhere(list, { email: body.email });

		// console.log(user.password);

	    if (err || !user) return res.json({ error_code: "no_profile", msg: "No profile for that email" });
			// var password = body.password.toString();

			// console.log(typeof body.password, typeof user.password); // returns 'string', 'string'
			// console.log(body.password == user.password); // returns true

	    user._.password.compare(body.password, (err, result) => {
				// console.log(err, result);
			if (result) {

					var data = {
						user: user
					}

					if (user.isAdmin)
						data.url = '/researcher/' + user.id;
					else
						data.url = '/client/' + user.id;

					if (!user.clientId && !user.isAdmin && !user.isResearcher)
						user.clientId = 'client_' + list.length;

					user.save(function(err, result) {
						res.send(data);
					});

			} else {

			  	console.log("wrong password");

			  	res.send({
			        error_code: "wrong_password",
			        msg: 'Sorry, wrong password'
			    });

			    return;

			}

	    });

	});
};
