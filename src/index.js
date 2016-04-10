const slack_client = require('slack-client');
const pivotaltracker = require('pivotaltracker');
const express = require('express');
const body_parser = require('body-parser');

var slackApiToken = process.env.SLACK_API_TOKEN || '';

// See https://www.pivotaltracker.com/profile
var trackerApiToken = process.env.TRACKER_API_TOKEN || '';

function Index(rtmClient, trackerClient) {
  this._rtmClient = rtmClient;
  this._trackerClient = trackerClient;

  this._channels = {};

  var that = this;
  rtmClient.on(slack_client.CLIENT_EVENTS.RTM.AUTHENTICATED, function (start) {
    that.resetChannels(start.channels, start.groups);
  });
}

Index.prototype = {
  resetChannels: function (channels, groups) {
    var that = this;

    // Channels just have public channels
    channels.forEach(function (channel) {
      that._channels[channel.name] = channel.id;
    });

    // Private channels are internally called "groups"
    groups.forEach(function (group) {
      that._channels[group.name] = group.id;
    });
  },

  sendProjectUpdate: function (labels, message) {
    var that = this;

    labels.forEach(function (label, index) {
      var channelId = that._channels[label];
      if (channelId) {
        that._rtmClient.sendMessage(message, channelId);
      }
    });
  },

  processWebhook: function (body) {
    var that = this;

    var project = that._trackerClient.project(body.project.id);
    var resources = body.primary_resources;

    if (resources.length === 1 && resources[0].kind === 'story') {
      project.story(resources[0].id).get(function (err, story) {
        var labels = story.labels.map(function (label) {
          return label.name;
        });
        var message =
          body.message + '\n' + resources[0].name + '\n' + resources[0].url;
        that.sendProjectUpdate(labels, message);
      });
    }
  }
}

function main() {
  var trackerClient = new pivotaltracker.Client(trackerApiToken);

  var rtmClient = new slack_client.RtmClient(slackApiToken, {logLevel: 'info'});
  var index = new Index(rtmClient, trackerClient);

  var webServer = express();
  webServer.use(body_parser.json());
  webServer.post('/webhooks/pivotal', function (req, res) {
    index.processWebhook(req.body);
    res.send('pong');
  });

  rtmClient.start();

  webServer.listen(process.env.PORT || 8080);
}

module.exports = Index;

if (! module.parent) {
  main();
}
