'use strict';

// Research Loader class

const keystone = require('keystone');
const Category = keystone.list('Category');
const ResearcherResponse = keystone.list('ResearcherResponse');
const Questions = keystone.list('Question');

class ResearchLoader {

  constructor() {

  }

  Questions(action) {

    return new Promise((resolve, reject) => {

    	var questionQuery = Questions.model.find()
    												.populate('actions');

      questionQuery.exec(function(err, questions) {
        if (err || questions.length <= 0) reject("Error");
        var filtered = _.filter(questions, function(q) {
          return _.findWhere(q.actions, { key: action }) != undefined;
        });
        resolve(filtered);
      });
    });

  }

  MarkerActions(category) {

    return new Promise((resolve, reject) => {

      var categoryQuery = Category.model.find({ type: 'Marker Action' }).populate('parent');

    	categoryQuery.exec(function(err, categories) {
        // console.log(err, categories);

        if (category) {

      		resolve(_.filter(categories, function(item) {
      			return item.parent._id == category;
      		}));

        } else {
          resolve(categories);
        }

      });

    });

  }

  MarkerCategories() {

    return new Promise ((resolve, reject) => {

      Category.model.find({}, function(err, categories) {
        // console.log(err, categories);
        if (err) reject(err);

        resolve(_.where(categories, { type: 'Marker Category' }));
      });

    });

  }

  PlacedMarkers(group, categories, actions) {

    return new Promise((resolve, reject) => {
      if (!group) reject("Error: No Group");
      if (!categories || categories.length <= 0) reject("Error: No Categories");

      var results = {};
      var groupedMarkers = _.groupBy(group.markers, "category");

      _.each(groupedMarkers, function(g, key) {
        var newKey = _.findWhere(categories, { key: key }).name;
        g = _.map(g, function(marker) {
          var actionName = _.findWhere(actions, { key: marker.action }).name;
          marker.actionName = actionName;
          return marker;
        });

        results[newKey] = g;

      });

      resolve(results);
    });

  }

  SaveResearch(params) {
    var group = params[0];
    var response = params[1];
    var researcher = params[2];
    var marker = params[3];

    console.log(params, " saving research params");

    return new Promise((resolve, reject) => {

      // console.log(group, response);
      // group.researchData = _.filter(group.researchData, function(i) {
      //   return i != undefined && i != null;
      // });
      // var repeat = _.filter(group.researcherData, function(item) {
      //  return item.answer == response.value && item.question == response.key;
      // });
      //
      // if (!repeat || repeat.length <= 0) {

        var obj = {
          question: response.value,
          answer: response.key,
          researcher: researcher,
          group: group._id,
          marker: marker
        };

        console.log('object\nobject\n', obj);

        var newResponseGroup = new ResearcherResponse.model(obj);

        newResponseGroup.save(function(err, post) {
          // console.log(post, " is the new response group we saved");
          if (!err && post) {

            group.researcherData.push(post);

            group.save(function(err, updatedGroup) {
              resolve(post);
              console.log(updatedGroup, "is the updated group with the saved researcher response")
            });

          } else
            reject(err);
        });
      // }

    });
  }

  GetPrevious(group, marker) {
    console.log(group, marker);
    return new Promise((resolve, reject) => {

      var previous = _.filter(group.researcherData, function(opt) {
         // console.log(opt);
         console.log(opt.marker, marker)
         if (opt.marker)
           return opt.marker == marker;
      }).reverse();

      previous = _.pluck(previous, "_id");

      console.log(previous, " are the previous posts");

      var dataQuery = ResearcherResponse.model.find({ "_id": { "$in": previous } })
      .populate("question researcher");

      dataQuery.exec(function(err, logs) {
        // console.log(group, logs)
        resolve(logs);
      });
    });

  }

  GetLogs(group, marker) {

    console.log(group, marker);
    return new Promise((resolve, reject) => {

    	var groupQuery = ResearcherResponse.model.find()
    												.populate('question researcher');

      groupQuery.exec(function(err, result) {

        var options = _.where(result, { group: group });
        console.log(options, " number of options");
        // console.log(options);
        options = _.filter(options, function(opt) {
          console.log(opt, marker);
          return opt.marker == marker;
        });

        console.log(options.length, " number of options for this marker");

        var groupedOpt = _.groupBy(options, function(opt) {
          return opt.question._id;
        });

        console.log(groupedOpt, " the grouped options");

        var mostRecent = [];

        _.each(groupedOpt, function(group) {
          group = group.reverse();
          mostRecent.push(group[0]);
          options.splice(options.indexOf(group[0], 1));
        });

        if (options.length > 1) {
          var logs = options.reverse();
        }

        if (logs)
          console.log(logs.length, " number of logs");

        if (mostRecent)

        resolve({
          logs: logs,
          currentLog: mostRecent
        });

      });

    });
  }

}

module.exports = ResearchLoader;
