var _ = require('underscore')
		appRoot = require('app-root-path'),
		TemplateLoader = require(appRoot + '/lib/TemplateLoader'),
		keystone = require('keystone'),
		User = keystone.list('User'),
		ClientResponseGroup = keystone.list('ClientResponseGroup'),
		ResearcherResponse = keystone.list('ResearcherResponse'),
		Questions = keystone.list('Question'),
		Category = keystone.list('Category');

// Researcher Modal
exports.researchModal = function(req, res) {

	var Templates = new TemplateLoader();

	var data = {};

	console.log(req.body);

	var groupQuery = ClientResponseGroup.model.findOne({ _id: req.body.group })
										.populate('client markers researcherData responses');

	groupQuery.exec(function(err, result) {
		data.group = result;

		Category.model.find({}, function(err, categories) {
			console.log(categories);
			data.markerCategories = _.where(categories, { type: 'Marker Category' });

			Questions.model.find({ client: false }, function(err, questions) {
				data.questions = questions;

				User.model.findOne({ _id: req.body.user }, function(err, user) {
					data.user = user;

					Templates.Load('partials/researcherModal', data, (html) => {

						res.send({ eventData: html, group: result._id });

					});

				});

			});

		});

	});

};

exports.form = function(req, res) {

	var Templates = new TemplateLoader();

	var data = {};

	console.log(req.body, "is the data we sent to the form loader");

	var groupQuery = ResearcherResponse.model.find()
										.populate('question researcher');

	groupQuery.exec(function(err, result) {
		var options = _.where(result, { group: req.body.group });
		// console.log(options);
		options = _.filter(options, function(opt) {
			// console.log(opt);
			console.log(opt.marker, req.body.marker)
			if (opt.marker)
				return opt.marker == req.body.marker;
		});

		Questions.model.find({ client: false }, function(err, questions) {
			data.questions = questions;

			User.model.findOne({ _id: req.body.user }, function(err, user) {
				data.user = user;

				Templates.Load('partials/form', data, (html) => {

					res.send({ formData: html, group: req.body.group, responses: options });

				});
			});

		});
	});

}


exports.markerActions = function(req, res) {

	var Templates = new TemplateLoader();

	var data = {};

	var categoryQuery = Category.model.find({ type: 'Marker Action' }).populate('parent');

	console.log(req.body, "is the data we sent to the form loader");
	categoryQuery.exec(function(err, categories) {

		data.markerActions = _.filter(categories, function(item) {
			return item.parent._id == req.body.category;
		});

		console.log(categories);

		Templates.Load('partials/markerActions', data, (html) => {

			res.send({ eventData: html });

		});
	});


}
