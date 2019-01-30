/* eslint-disable strict, no-unused-vars, no-use-before-define, new-cap */

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var PubSub = require('../src/pubsub');
var expect = chai.expect;
var pubsub;

function noopListener() {}

chai.use(sinonChai);

describe('PubSub', function () {
  beforeEach(function () {
    pubsub = new PubSub();
  });

  it('Creates a new instance of PubSub.', function () {
    expect(pubsub).to.not.be.null;

    expect(pubsub instanceof PubSub).to.be.true;
  });

  it('Should return a new instance of PubSub if new keyword is omitted', function () {
    expect(pubsub).to.not.be.null;
    expect(pubsub instanceof PubSub).to.be.true;
  });

  it('Subscribes to an event called: "example-event".', function () {
    expect(pubsub.subscribe('example-event', noopListener)).to.equal(0);
  });

  it('Should subscribes to an event only once', function () {
    pubsub.subscribeOnce('one-time-event', noopListener);
    pubsub.publishSync('one-time-event'); // Publish once

    expect(pubsub.hasSubscribers('one-time-event')).to.be.false;
  });

  it('Should throw exception if a callback is not provided', function () {
    expect(function () {
      return pubsub.subscribe('example-event');
    }).to.throw();
  });

  it('Should publish "example-event" passing data: "{ dummyKey : \'dummyValue\' }"', function () {
    var spy = sinon.spy(pubsub, 'publish');

    pubsub.subscribe('example-event', noopListener);

    pubsub.publish('example-event', {
      dummyKey: 'dummyValue'
    });

    spy.restore();

    expect(spy).to.have.been.calledWith('example-event', {dummyKey: 'dummyValue'});
  });

  it('Should not publish an event that was not subscribed', function () {
    pubsub.subscribe('example-event', noopListener);

    expect(pubsub.publish('unsubscribed-event')).to.be.false;
  });

  it('Should publish asynchronously', function (done) {
    var counter = 0;
    var handler = function () {
      counter += 1;
      expect(counter).to.equal(1);
      done();
    };

    pubsub.subscribe('async-event', handler);

    pubsub.publish('async-event');

    expect(counter).to.equal(0);
  });

  it('Should publish synchronously', function () {
    var counter = 0;
    var handler = function () {
      counter += 1;
    };

    pubsub.subscribe('async-event', handler);

    pubsub.publishSync('async-event');

    expect(counter).to.equal(1);
  });

  it('Should allow to pass multiple data arguments to publish and publishSync methods', function () {
    pubsub.subscribe('eventA', function (data) {
      expect(data).to.eql(['John', 'Doe']);
    });

    pubsub.subscribe('eventB', function (data) {
      expect(data).to.eql([{fname: 'John'}, {lname: 'Doe'}]);
    });

    pubsub.subscribe('eventC', function (data) {
      expect(data).to.eql('John Doe');
    });

    pubsub.subscribe('eventD', function (data) {
      expect(data).to.eql([null, null]);
    });

    pubsub.subscribe('eventE', function (data) {
      expect(data).to.eql([[1, 2, 3], ['a', 'b', 'c']]);
    });

    pubsub.subscribe('eventF', function (data) {
      expect(data).to.eql({fname: 'John', lname: 'Doe'});
    });

    pubsub.publish('eventA', 'John', 'Doe');
    pubsub.publishSync('eventB', {fname: 'John'}, {lname: 'Doe'});
    pubsub.publishSync('eventC', 'John Doe');
    pubsub.publishSync('eventD', null, null);
    pubsub.publishSync('eventE', [1, 2, 3], ['a', 'b', 'c']);
    pubsub.publishSync('eventF', {fname: 'John', lname: 'Doe'});
  });

  it('Should unsubscribe from event using the event name ("example-event")', function () {
    var unsub;

    pubsub.subscribe('example-event', noopListener);

    unsub = pubsub.unsubscribe('example-event');

    expect(unsub).to.equal('example-event');
    expect(pubsub.hasSubscribers('example-event')).to.be.false;
  });

  it('Should unsubscribe from event using tokenized reference to the subscription', function () {
    var sub = pubsub.subscribe('example-event', noopListener);
    var sub2 = pubsub.subscribe('example-event', noopListener);
    var sub3 = pubsub.subscribe('example-event', noopListener);

    expect(pubsub.unsubscribe(sub)).to.equal(0);
    expect(pubsub.subscribers()['example-event'].length).to.equal(2);
  });

  it('Should unsubscribe from an event that was not subscribed before', function () {
    var unsub = pubsub.unsubscribe('fake-event');

    expect(unsub).to.be.false;
  });

  it('Should return true when checking if there are subscribers for "message" event.', function () {
    var onMessage = pubsub.subscribe('message', function () {});

    expect(pubsub.hasSubscribers('message')).to.be.true;
  });

  it('Should return false when checking if there are subscribers for "message" event after unsubscribing', function () {
    var onMessage = pubsub.subscribe('message', function () {});

    pubsub.unsubscribe('message');

    expect(pubsub.hasSubscribers('message')).to.be.false;
  });

  it('Should return false when checking if there are subscribers for "message" without subscribing before', function () {
    expect(pubsub.hasSubscribers('message')).to.be.false;
  });

  it('Should return true when checking if there are any subscribers', function () {
    var onMessage = pubsub.subscribe('message', function () {});

    expect(pubsub.hasSubscribers()).to.be.true;
  });

  it('Should return false when checking if there are any subscribers after unsubscribing all subscribers', function () {
    var onMessage = pubsub.subscribe('message', function () {});
    var onMessage2 = pubsub.subscribe('message2', function () {});

    pubsub.unsubscribeAll();

    expect(pubsub.hasSubscribers()).to.be.false;
  });

  it('Should unsubscribe from all subscriptions', function () {
    pubsub.subscribe('eventA', noopListener);
    pubsub.subscribe('eventB', noopListener);
    pubsub.subscribe('eventC', noopListener);
    pubsub.subscribeOnce('eventA', noopListener);
    pubsub.subscribeOnce('eventB', noopListener);
    pubsub.subscribeOnce('eventC', noopListener);

    pubsub.unsubscribeAll();

    expect(pubsub.hasSubscribers('eventA')).to.be.false;
    expect(pubsub.hasSubscribers('eventB')).to.be.false;
    expect(pubsub.hasSubscribers('eventC')).to.be.false;
  });

  it('Should return an array of 2 subscribers for topic named "eventA"', function () {
    pubsub.subscribe('eventA', noopListener);
    pubsub.subscribe('eventA', noopListener);

    expect(pubsub.subscribersByTopic('eventA')).to.have.lengthOf(2);
  });

  it('Should return an empty array if we ask for subscribers for a not existing topic', function () {
    expect(pubsub.subscribersByTopic('eventA')).to.have.lengthOf(0);
  });

  it('Should create aliases "on" and "off" for "subscribe" and "unsubscribe" methods respectively', function () {
    var t;

    pubsub.alias({
      subscribe: 'on',
      unsubscribe: 'off'
    });

    t = pubsub.on('event-name', function () {});

    expect(PubSub.prototype.on).not.to.be.undefined;

    expect(PubSub.prototype.off).not.to.be.undefined;

    expect(pubsub.off(t)).to.equal(0);
  });

  it('Should invoke every listener in the order that was added', function () {
    var arr = [];

    function listener1() {
      arr.push('A');
    }

    function listener2() {
      arr.push('B');
    }

    function listener3() {
      arr.push('C');
    }

    pubsub.subscribe('my_topic', listener1);
    pubsub.subscribe('my_topic', listener2);
    pubsub.subscribe('my_topic', listener3);

    pubsub.publishSync('my_topic');

    expect(arr).to.eql(['A', 'B', 'C']);
  });
});
