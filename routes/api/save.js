var cloudinary = require('cloudinary');
var _ = require("underscore");
var keystone = require('keystone');
var Questions = keystone.list('Question');
var Response = keystone.list('ClientResponse');
var Group = keystone.list('ClientResponseGroup');
var Timestamp = keystone.list('Timestamp');
var TemplateLoader = require('../../lib/TemplateLoader');

exports.responses = function(req, res) {
    var currentGroup = req.body.group;
    console.log(currentGroup, "is the current Group")

   Group.model.findOne({ _id: currentGroup }, function(err, group) {
     console.log(group, "is the group we found")
      Questions.model.find({ client: true }).exec(function(err, result) {
        questions = result;
        console.log(questions);

        _.each(req.body.responses, function(value, key) {

          var id = key.replace("-", " ");

          var thisQuestion = _.findWhere(questions, { question: id });

          newResponseGroup = new Response.model({
            question: thisQuestion._id,
            answer: value
          });

          newResponseGroup.save(function(err, post) {
            group.responses.push(post);

            group.save(function(err, updatedGroup) {
              res.send('success!');
            });

          });

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
  console.log(req.body.data.user, "is the user that just uploaded that video");
  var user = JSON.parse(req.body.data.user);
  console.log(user);
  console.log(user._id);
  cloudinary.v2.uploader.unsigned_upload(req.body.data.url, "video-database", { resource_type: "video" },
    function(error, result) {
      console.log(error, result);

        var newUpload = new Group.model({
            url: result.url,
            client: user._id
        });

        console.log(newUpload, 'is the new upload')

        newUpload.save(function(err, post) {
            // post has been saved
            console.log("Uploaded video!", post);
            res.send( post );
        });

  });
}

exports.timestamp = function(req, res) {

  Group.model.findOne({ _id: req.body.id }, function(err, group) {
     console.log(group, "is the group we found")

     var thisTimestamp = new Timestamp.model({
       time: req.body.time,
       createdBy: group.client,
       notes: req.body.note
     });

     console.log(thisTimestamp, "is the timestamp we added");

     thisTimestamp.save(function(err, timestamp) {
        if (err) res.throw(err);

        console.log(timestamp._id);

        group.timestamps.push(timestamp._id);

        console.log(group.timestamps);

        group.save(function(err, updatedGroup) {
          res.send({ msg: 'success', group: updatedGroup, timestamp: timestamp });
        });

     });

  });
}

exports.research = function(req, res) {
    var currentGroup = req.body.group;
    console.log(currentGroup, "is the current Group")

   Group.model.findOne({ _id: currentGroup }, function(err, group) {
     console.log(group, "is the group we found")

     Questions.model.find({}).exec(function(err, result) {
       questions = result;
       console.log(questions);

       _.each(req.body.data, function(value, key) {

         var id = key.replace("-", " ");

         var thisQuestion = _.findWhere(questions, { question: id });

         newResponseGroup = new ResearcherResponse.model({
           question: thisQuestion._id,
           answer: value
         });

         newResponseGroup.save(function(err, post) {
           group.researcherData.push(post);

           group.save(function(err, updatedGroup) {
             res.send('success!', updatedGroup);
           });

         });

       });

     });

  });
}
