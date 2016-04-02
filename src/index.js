const slack_client = require('slack-client');
const pivotaltracker = require('pivotaltracker');
const express = require('express');
const body_parser = require('body-parser');

var slackApiToken = process.env.SLACK_API_TOKEN || '';

// See https://www.pivotaltracker.com/profile
var trackerApiToken = process.env.TRACKER_API_TOKEN || '';

var channels = {};

var bot = new slack_client.RtmClient(slackApiToken, {logLevel: 'info'});
bot.on(slack_client.CLIENT_EVENTS.RTM.AUTHENTICATED, function (start) {
  start.channels.forEach(function (channel) {
    channels[channel.name] = channel.id;
  });

  // Private channels are internally called "groups"
  start.groups.forEach(function (group) {
    channels[group.name] = group.id;
  });
});
bot.start();

var trackerClient = new pivotaltracker.Client(trackerApiToken);

var app = express();
app.use(body_parser.json());
app.post('/webhooks/pivotal', function (req, res) {
  console.log(req.body);

  var project = trackerClient.project(req.body.project.id);
  var resources = req.body.primary_resources;

  console.log(req.body.message);

  if (resources.length === 1 && resources[0].kind === 'story') {
    console.log(resources[0].url);

    project.story(resources[0].id).get(function (err, story) {
      story.labels.forEach(function (label, index) {
        console.log(channels);
        var channelId = channels[label.name];
        if (channelId) {
          bot.sendMessage(req.body.message + '\n' + resources[0].url,
                          channelId);
        }
      });
    });
  }

  res.send('pong');
});
app.listen(3000);
