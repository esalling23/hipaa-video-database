var cloudinary = require('cloudinary');
var _ = require("underscore");
var keystone = require('keystone');
var User = keystone.list('User');
var Questions = keystone.list('Question');
var Category = keystone.list('Category');
var Response = keystone.list('ClientResponse');
var Group = keystone.list('ClientResponseGroup');
var Marker = keystone.list('VideoMarker');
var ResearcherResponse = keystone.list('ResearcherResponse');
var TemplateLoader = require('../../lib/TemplateLoader');
var Templates = new TemplateLoader();
var ResearchLoader = require('../../lib/ResearchLoader');

exports.responses = function(req, res) {
    var currentGroup = req.body.group;
    // console.log(currentGroup, "is the current Group")

   Group.model.findOne({ _id: currentGroup }, function(err, group) {
     // console.log(group, "is the group we found")
      console.log(req.body.responses, " are the responses we are gonna store");

      group.responses = [];
      var count = 0;
      _.each(req.body.responses, function(value, key) {
        count ++;
        newResponseGroup = new Response.model({
          question: key,
          answer: value
        });

        newResponseGroup.save(function(err, post) {
          console.log(err, post)
          group.responses.push(post);
          console.log(group.responses.length, count)
          if (group.responses.length == count) {
            group.save(function(err, updatedGroup) {
              console.log("saved!", updatedGroup);
              res.send( updatedGroup );
            });
          }

        });

      });

   });



}

exports.upload = function(req, res) {

  cloudinary.config({
    cloud_name: 'esalling',
    api_key: '723551514692962',
    api_secret: 'syiIllz2Vf6VglCJWRDZFsNafD8'
  });
  // console.log(req.body.data.user, "is the user that just uploaded that video");
  // var user = JSON.parse(req.body.data.user);
  // console.log(user);
  // console.log(user._id);
  cloudinary.v2.uploader.unsigned_upload(req.body.data.url, "video-database", { resource_type: "video" },
    function(error, result) {
      console.log(error, result);

        var newUpload = new Group.model({
            url: result.url,
            client: req.body.data.user
        });

        console.log(newUpload, ' is the new upload...')

        newUpload.save(function(err, post) {
          console.log(err, post);
          if (err) console.log(err);
            // post has been saved
            console.log("Uploaded video!!!!   ", post);
            res.send( post );
        });

  });
}

exports.marker = function(req, res) {

  var data = {};

  var questionQuery = Questions.model.find().populate('actions');
  var timestampQuery = Marker.model.findOne({
    time: req.body.time,
    notes: req.body.note,
    category: req.body.category,
    action: req.body.action,
    group: req.body.id
  });

  timestampQuery.exec(function(err, marker) {

    if (marker) res.send({ err: 'Markers must be unique. This particular marker already exists.' });

    Group.model.findOne({ _id: req.body.id }, function(err, group) {
       console.log(group, "is the group we found");

       var thisTimestamp = new Marker.model({
         time: req.body.time,
         researcher: req.body.researcher,
         notes: req.body.note,
         category: req.body.category,
         action: req.body.action,
         group: group._id
       });

       console.log(thisTimestamp, "is the timestamp we added");

       thisTimestamp.save(function(err, timestamp) {
          if (err) res.throw(err);

          group.markers.push(timestamp._id);

          group.save(function(err, updatedGroup) {

            var newQuery = Group.model.findOne({ _id: updatedGroup._id })
              .populate('client markers researcherData responses');

            newQuery.exec(function(err, result) {
              data.group = result;

              return new ResearchLoader().MarkerCategories().then(categories => {
          			data.markerCategories = categories;

          			return new ResearchLoader().MarkerActions();
          		}).then(actions => {
          			return new ResearchLoader().PlacedMarkers(result, data.markerCategories, actions);

          		}).then(groups => {
          			data.groupedMarkers = groups;

                return new ResearchLoader().Questions();

              }).then(questions => {

                data.questions = questions;

                User.model.findOne({ _id: req.body.researcher }, function(err, user) {
                  data.user = user;

                  Templates.Load('partials/researcherModal', data, (html) => {

                    data.type = "research";
                    Templates.Load('partials/form', data, (form) => {

                      res.send({
                        formData: form,
                        modalData: html,
                        group: req.body.id
                      });

                    });

                  });
                });

          		}).catch(err => console.log(err));


            });

          });

       });

     });

  });
}

exports.research = function(req, res) {

  console.log(res.body);

  var query = Group.model.findOne({ _id: req.body.group }).populate('researcherData');
  query.exec(function(err, group) {

     var newResponses = [];
     var promisedResponses = [];

    _.map(req.body.responses, function(key, value) {
      // console.log(key, value);
      promisedResponses.push([group, { key: key, value: value }, req.body.researcher, req.body.marker]);
    });

    var promises = promisedResponses.map(new ResearchLoader().SaveResearch);

    Promise.all(promises).then(res => {
      console.log(res);
      newResponses = res;
      return query.exec();
    }).then(group => {
      return new ResearchLoader().GetLogs(req.body.group, req.body.marker);
    }).then(data => {
      console.log(data);
      Templates.Load('partials/logs', { researchLogs: data.logs }, (logsHtml) => {
        Templates.Load('partials/current-log', { logs: data.currentLog }, (currentHtml) => {
          res.send({
            logs: logsHtml,
            currentLog: currentHtml,
            success: true
          });
        });
      });

    }).catch(err => console.log(err));


  });
}
