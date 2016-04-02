var assert = require('assert');
var sinon = require('sinon');
var events = require('events');

var Index = require('../src/index');

describe('Index', function () {
  it("sends a meesage if there is a channel for the label", function () {
    var rtmClient = new events.EventEmitter();
    rtmClient.sendMessage = sinon.spy();

    var index = new Index(rtmClient, null);
    index.resetChannels([ { name: 'infra', id: 'C0W43QMR0' } ], []);

    index.sendProjectUpdate([ 'infra' ],
                            'A new ticket on the infrastructure team');
    assert.ok(rtmClient.sendMessage.called);
  });

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
