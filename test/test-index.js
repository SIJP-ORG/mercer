var assert = require('assert');
var sinon = require('sinon');
var events = require('events');

var Index = require('../src/index');

describe('Index', function () {
  it('processes webhooks', function () {
    var rtmClient = new events.EventEmitter();
    rtmClient.sendMessage = sinon.spy();

    var trackerClient = {
      project: sinon.stub().returns({
      })
    };
    var index = new Index(rtmClient, trackerClient);
    index.processWebhook({
      project: { id: 1234 },
      primary_resources: []
    });

    assert.ok(! rtmClient.sendMessage.called);
  });
});
