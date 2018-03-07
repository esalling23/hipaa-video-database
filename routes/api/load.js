var _ = require('underscore')
		appRoot = require('app-root-path'),
		TemplateLoader = require(appRoot + '/lib/TemplateLoader'),
		keystone = require('keystone'),
		User = keystone.list('User'),
		ClientResponseGroup = keystone.list('ClientResponseGroup'),
		ResearcherResponse = keystone.list('ResearcherResponse'),
		Questions = keystone.list('Question');

// Login
exports.researchModal = function(req, res) {

	var Templates = new TemplateLoader();

	var data = {};

	console.log(req.body);

	var groupQuery = ClientResponseGroup.model.findOne({ _id: req.body.group })
										.populate('client markers researcherData responses');

	groupQuery.exec(function(err, result) {
		data.group = result;

		Questions.model.find({ client: false }, function(err, questions) {
			data.questions = questions;

			Templates.Load('partials/researcherModal', data, (html) => {

				res.send({ eventData: html, group: result._id });

			});

		});
	});



};
