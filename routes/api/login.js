var keystone = require('keystone'),
	User = keystone.list('User'),
	appRoot = require('app-root-path'),
    TemplateLoader = require(appRoot + '/lib/TemplateLoader'),
    _ = require('underscore');

// Signup
exports.create = function(req, res) {

	console.log(req.body);

	var newUser = new User.model({
		name: req.body.username,
		email: req.body.email,
		password: req.body.password
	});

	newUser.save(function(err, result) {
		console.log(result);
		var data = {
			user: result,
			url: '/client/' + result.id
		}
		res.send(data)
	});

}

// Login
exports.get = function(req, res) {

	console.log(req.body);

	var query = User.model.findOne({ email: req.body.email });

	query.exec((err, user) => {

	    if (err || !user) return res.json({ error_code: "no_profile", msg: "No profile for that email" });

	    user._.password.compare(req.body.password, (err, result) => {

			if (result) {

					var data = {
						user: user
					}

					if (user.isAdmin)
						data.url = '/researcher/' + user.id;
					else
						data.url = '/client/' + user.id;

					res.send(data);

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
