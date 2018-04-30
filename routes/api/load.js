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

		var groupedMarkers = _.groupBy(result.markers, "category");

		Category.model.find({}, function(err, categories) {
			data.markerCategories = _.where(categories, { type: 'Marker Category' });

			data.groupedMarkers = {};
			_.each(groupedMarkers, function(group, key) {
				console.log(group)
				console.log(categories, group.action);
				var newKey = _.findWhere(data.markerCategories, { key: key }).name;
				group = _.map(group, function(marker) {
					var actionName = _.findWhere(categories, { key: marker.action }).name;
					marker.actionName = actionName;
					return marker;
				})
				data.groupedMarkers[newKey] = group;
			});

			console.log(data.groupedMarkers)

			User.model.findOne({ _id: req.body.user }, function(err, user) {
				data.user = user;

				Templates.Load('partials/researcherModal', data, (html) => {

					res.send({ eventData: html, group: result._id });

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

	var questionQuery = Questions.model.find()
												.populate('actions');

	groupQuery.exec(function(err, result) {
		var options = _.where(result, { group: req.body.group });
		// console.log(options);
		options = _.filter(options, function(opt) {
			// console.log(opt);
			console.log(opt.marker, req.body.marker)
			if (opt.marker)
				return opt.marker == req.body.marker;
		});
		console.log(options, "are all the options")


		var grouped = _.groupBy(options, function(opt) {
			return opt.question._id;
		});

console.log(grouped, "are the grouped answers")
		var mostRecent = [];

		_.each(grouped, function(group) {
			group = group.reverse();
			mostRecent.push(group[0]);
			options.splice(options.indexOf(group[0], 1));
		});

		console.log(mostRecent, "are the most recent")

		console.log(options, "are the rest of the options")
		if (options.length > 1) {
			var logs = options.reverse();
		}

		if (mostRecent.length > 0) {
			var currentLog = mostRecent;
		}

		questionQuery.exec(function(err, questions) {
			var filtered = [];
			_.map(questions, function(q) {
				_.each(q.actions, function(action) {
					// console.log(action.key == req.body.action)
					if (action.key == req.body.action)
						filtered.push(q);
				});
			});

			// console.log(filtered, "are the filtered Qs");

			data.questions = filtered;

			// console.log(data.questions, "are the questions");

			User.model.findOne({ _id: req.body.user }, function(err, user) {
				data.user = user;
				data.type = "research";

				Templates.Load('partials/form', data, (formsHtml) => {

					Templates.Load('partials/logs', { researchLogs: logs }, (logsHtml) => {

						Templates.Load('partials/current-log', { log: currentLog }, (currentLog) => {

							res.send({
								formData: formsHtml,
								logsData: logsHtml,
								currentLog: currentLog,
								group: req.body.group,
								responses: options,
								mostRecent: mostRecent
							});

						});

					});

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

		console.log(categories, data.markerActions);

		Templates.Load('partials/markerActions', data, (html) => {
			console.log(html);
			res.send({ eventData: html });

		});
	});


}
