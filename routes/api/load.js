var _ = require('underscore'),
		appRoot = require('app-root-path'),
		TemplateLoader = require(appRoot + '/lib/TemplateLoader'),
		ResearchLoader = require(appRoot + '/lib/ResearchLoader'),
		keystone = require('keystone'),
		User = keystone.list('User'),
		ClientResponseGroup = keystone.list('ClientResponseGroup'),
		ResearcherResponse = keystone.list('ResearcherResponse'),
		Questions = keystone.list('Question'),
		Category = keystone.list('Category');


// Researcher Modal
exports.researchModal = function(req, res) {

	var Templates = new TemplateLoader();
	// var ResearchLoader = new ResearchLoader();

	var data = {};

	console.log(req.body);

	var groupQuery = ClientResponseGroup.model.findOne({ _id: req.body.group })
										.populate('client markers researcherData responses');

	groupQuery.exec(function(err, result) {
		data.group = result;

		return new ResearchLoader().MarkerCategories().then(res => {
			data.markerCategories = res;

			return new ResearchLoader().MarkerActions();
		}).then(actions => {
			return new ResearchLoader().PlacedMarkers(result, data.markerCategories, actions);

		}).then(groups => {
			data.groupedMarkers = groups;

			User.model.findOne({ _id: req.body.user }, function(err, user) {
				data.user = user;

				Templates.Load('partials/researcherModal', data, (html) => {

					res.send({ eventData: html, group: result._id });

				});

			});
		}).catch(err => console.log(err));

	});

};

exports.form = function(req, res) {

	var Templates = new TemplateLoader();

	var data = {};

	console.log(req.body, "is the data we sent to the form loader");

	new ResearchLoader().GetLogs(req.body.group, req.body.marker).then(res => {
		data.mostRecent = res.mostRecent;
		data.logs = res.logs;
		data.currentLog = res.currentLog;
		return;
	}).then(() => {
		return new ResearchLoader().Questions(req.body.action);
	}).then(questions => {
		console.log(questions.length, " are the number of questions");
		data.questions = questions;
		return User.model.findOne({ _id: req.body.user });
	}).then(user => {
		data.user = user;
		data.type = "research";

		console.log(data);
		Templates.Load('partials/form', data, (formsHtml) => {

			Templates.Load('partials/logs', { researchLogs: data.logs }, (logsHtml) => {

				Templates.Load('partials/current-log', { logs: data.currentLog }, (currentLog) => {

					res.send({
						formData: formsHtml,
						logsData: logsHtml,
						currentLog: currentLog,
						group: req.body.group,
						responses: data.logs
					});

				});

			});

		});

	}).catch(err => console.log(err));

}


exports.markerActions = function(req, res) {

	var Templates = new TemplateLoader();

	var data = {};

	new ResearchLoader().MarkerActions(req.body.category).then(actions => {
		data.markerActions = actions;

		Templates.Load('partials/markerActions', data, (html) => {
			console.log(html);
			res.send({ eventData: html });
		});
	}).catch(err => console.log(err));

}
