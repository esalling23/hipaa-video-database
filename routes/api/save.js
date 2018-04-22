var cloudinary = require('cloudinary');
var _ = require("underscore");
var keystone = require('keystone');
var Questions = keystone.list('Question');
var Response = keystone.list('ClientResponse');
var Group = keystone.list('ClientResponseGroup');
var Marker = keystone.list('VideoMarker');
var TemplateLoader = require('../../lib/TemplateLoader');
var Templates = new TemplateLoader();

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

        console.log(newUpload, 'is the new upload')

        newUpload.save(function(err, post) {
            // post has been saved
            console.log("Uploaded video!", post);
            res.send( post );
        });

  });
}

exports.marker = function(req, res) {

  var data = {};

  var questionQuery = Questions.model.find()
												.populate('actions');

  Group.model.findOne({ _id: req.body.id }, function(err, group) {
     console.log(group, "is the group we found")

     var thisTimestamp = new Marker.model({
       time: req.body.time,
       researcher: req.body.researcher,
       notes: req.body.note,
       category: req.body.category,
       action: req.body.action
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

            questionQuery.exec(function(err, questions) {
        			var filtered = [];
        			_.map(questions, function(q) {
        				_.each(q.actions, function(action) {
        					console.log(action.key == req.body.action)
        					if (action.key == req.body.action)
        						filtered.push(q);
        				});
        			});

        			console.log(filtered, "are the filtered Qs");

        			data.questions = filtered;

        			User.model.findOne({ _id: req.body.researcher }, function(err, user) {
        				data.user = user;

                Templates.Load('partials/researcherModal', data, (html) => {

                  Templates.Load('partials/form', data, (form) => {

                    res.send({
                      formData: form,
                      modalData: html,
                      group: req.body.id
                    });

                  });

          			});
              });
            });

          });

        });

     });

  });
}

exports.research = function(req, res) {

    var query = Group.model.findOne({ _id: req.body.group }).populate('researcherData');
    query.exec(function(err, group) {

       console.log(group, "is the group we found")

       console.log(req.body);
       var count = 0;
       var newResponses = [];

       _.each(req.body.responses, function(value, key) {
         var repeat = _.filter(group.researcherData, function(item){
          return item.answer === value && item.question === key;
         });
         if (repeat.length > 0) {
           newResponseGroup = new ResearcherResponse.model({
             question: key,
             answer: value,
             researcher: req.body.researcher,
             group: req.body.group,
             marker: req.body.marker
           });

           console.log(newResponseGroup, " we just made this");

           newResponseGroup.save(function(err, post) {
             // console.log(post, " is the new response group we saved");
             newResponses.push(post);
             group.researcherData.push(post);

             group.save(function(err, updatedGroup) {
               // console.log(updatedGroup, "is the updated group with the saved researcher response")
               count++;
             });
           });
         } else
           count++;

         console.log(count, Object.keys(req.body.responses).length);
         if (count == Object.keys(req.body.responses).length) {
           query.exec(function(err, group) {
             var previous = _.filter(group.researcherData, function(opt) {
           			// console.log(opt);
           			// console.log(opt.marker, req.body.marker)
           			if (opt.marker)
           				return opt.marker == req.body.marker;
           	 }).reverse();

             previous = _.pluck(previous, "_id");

             console.log(previous);

             var dataQuery = ResearcherResponse.model.find({ "_id": { "$in": previous } }).populate("question researcher");

             dataQuery.exec(function(err, logs) {
               // console.log(group, logs)

               Templates.Load('partials/logs', { researchLogs: logs }, (html) => {
                 res.send({ html: html, responses: newResponses });
               });
             });
           });
         }

      });

    });
}
