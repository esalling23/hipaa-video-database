var cloudinary = require('cloudinary');
var _ = require("underscore");
var keystone = require('keystone');
var Questions = keystone.list('Question');
var Response = keystone.list('ClientResponse');
var Group = keystone.list('ClientResponseGroup');
var Marker = keystone.list('VideoMarker');
var TemplateLoader = require('../../lib/TemplateLoader');

exports.responses = function(req, res) {
    var currentGroup = req.body.group;
    // console.log(currentGroup, "is the current Group")

   Group.model.findOne({ _id: currentGroup }, function(err, group) {
     // console.log(group, "is the group we found")

      console.log(req.body.responses);

      _.each(req.body.responses, function(value, key) {

        newResponseGroup = new Response.model({
          question: key,
          answer: value
        });

        newResponseGroup.save(function(err, post) {
          group.responses.push(post);
        });

      });

      group.save(function(err, updatedGroup) {
        console.log("saved!", updatedGroup);
        res.send( updatedGroup );
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

  Group.model.findOne({ _id: req.body.id }, function(err, group) {
     console.log(group, "is the group we found")

     var thisTimestamp = new Marker.model({
       time: req.body.time,
       researcher: req.body.researcher,
       notes: req.body.note
     });

     console.log(thisTimestamp, "is the timestamp we added");

     thisTimestamp.save(function(err, timestamp) {
        if (err) res.throw(err);

        console.log(timestamp._id);

        group.markers.push(timestamp._id);

        console.log(group.markers);

        group.save(function(err, updatedGroup) {
          res.send({ msg: 'success', group: updatedGroup, timestamp: timestamp });
        });

     });

  });
}

exports.research = function(req, res) {

   Group.model.findOne({ _id: req.body.group }, function(err, group) {
       console.log(group, "is the group we found")

       console.log(req.body);

       _.each(req.body.responses, function(value, key) {

         // console.log(value, key);

         newResponseGroup = new ResearcherResponse.model({
           question: key,
           answer: value,
           researcher: req.body.researcher
         });

         console.log(newResponseGroup);

         newResponseGroup.save(function(err, post) {
           console.log(post);
           group.researcherData.push(post);

           group.save(function(err, updatedGroup) {
             res.send( updatedGroup );
           });

         });

     });

  });
}
