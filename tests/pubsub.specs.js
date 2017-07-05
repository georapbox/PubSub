/* eslint-disable strict, no-unused-vars, no-use-before-define, new-cap */

describe('Should return a new PubSub instance', function () {
  it('Creates a new instance of PubSub.', function () {
    var pubsub = new PubSub();
    expect(pubsub).not.toBeNull();
    expect(pubsub instanceof PubSub);
  });

  it('Should return a new instance of PubSub if new keyword is omitted', function () {
    var pubsub = PubSub();
    expect(pubsub).not.toBeNull();
    expect(pubsub instanceof PubSub);
  });
});

// Subscribe scenarios.
describe('Subscribe/Register to an event', function () {
  it('Subscribes to an event called: "example-event".', function () {
    var ps = new PubSub();

    function listener() {}

    expect(ps.subscribe('example-event', listener)).toBe(0);
  });

  it('Should subscribes to an event only once', function () {
    var ps = new PubSub();

    function listener() {}

    ps.subscribeOnce('one-time-event', listener);

    ps.publishSync('one-time-event'); // Publish once

    expect(ps.hasSubscribers('one-time-event')).toBe(false);
  });

  it('Should throw exception if a callback is not provided', function () {
    var ps = new PubSub();

    expect(function () {
      return ps.subscribe('example-event');
    }).toThrow();
  });
});

// Publish scenarios.
describe('Publish/Emmit an event', function () {
  var ps = new PubSub();
  function listener() {}
  ps.subscribe('example-event', listener);

  it('Should publish "example-event" passing data: "{ dummyKey : \'dummyValue\' }"', function () {
    spyOn(ps, 'publish');

    ps.publish('example-event', {
      dummyKey: 'dummyValue'
    });

    expect(ps.publish).toHaveBeenCalledWith('example-event', {dummyKey: 'dummyValue'});
  });

  it('Should publish "example-event"', function () {
    ps.publish('example-event', {
      dummyKey: 'dummyValue'
    });

    expect(ps.publish('example-event')).toBe(true);
  });

  it('Should not publish an event that was not subscribed', function () {
    expect(ps.publish('unsubscribed-event')).toBe(false);
  });

  it('Should publish asynchronously', function () {
    var pubsub = new PubSub();
    var counter = 0;
    var handler = function () {
      counter += 1;
    };

    jasmine.clock().install();

    ps.subscribe('async-event', handler);

    ps.publish('async-event');

    expect(counter).toBe(0);

    jasmine.clock().tick(1);

    expect(counter).toBe(1);

    jasmine.clock().uninstall();
  });

  it('Should publish synchronously', function () {
    var pubsub = new PubSub();
    var counter = 0;
    var handler = function () {
      counter += 1;
    };

    ps.subscribe('async-event', handler);

    ps.publishSync('async-event');

    expect(counter).toBe(1);
  });
});

// Unsubscribe scenarios.
describe('Unsubscribe from event', function () {
  it('Should unsubscribe from event using the event name ("example-event")', function () {
    var ps = new PubSub();
    var unsub;

    function listener() {}

    ps.subscribe('example-event', listener);
    unsub = ps.unsubscribe('example-event');

    expect(unsub).toBe('example-event');
    expect(ps.hasSubscribers('example-event')).toBe(false);
  });

  it('Should unsubscribe from event using tokenized reference to the subscription', function () {
    var ps = new PubSub(),
      sub = ps.subscribe('example-event', listener),
      sub2 = ps.subscribe('example-event', listener),
      sub3 = ps.subscribe('example-event', listener);

    function listener() {}

    expect(ps.unsubscribe(sub)).toBe(0);
    expect(ps.subscribers()['example-event'].length).toBe(2);
  });

  it('Should unsubscribe from an event that was not subscribed before', function () {
    var ps = new PubSub(),
      unsub = ps.unsubscribe('fake-event');

    expect(unsub).toBe(false);
  });
});

// Check if there are subscribers for a specific topic.
describe('Check if there are subscribers for a specific topic', function () {
  it('Should return true when checking if there are subscribers for "message" event.', function () {
    var ps = new PubSub();
    var onMessage = ps.subscribe('message', function () {});

    expect(ps.hasSubscribers('message')).toBe(true);
  });

  it('Should return false when checking if there are subscribers for "message" event after unsubscribing', function () {
    var ps = new PubSub();
    var onMessage = ps.subscribe('message', function () {});

    ps.unsubscribe('message');

    expect(ps.hasSubscribers('message')).toBe(false);
  });

  it('Should return false when checking if there are subscribers for "message" without subscribing before', function () {
    var ps = new PubSub();

    expect(ps.hasSubscribers('message')).toBe(false);
  });
});

// Check if there are any subscribers
describe('Check if there are any subscribers at all', function () {
  it('Should return true when checking if there are any subscribers', function () {
    var ps = new PubSub();
    var onMessage = ps.subscribe('message', function () {});

    expect(ps.hasSubscribers()).toBe(true);
  });

  it('Should return false when checking if there are any subscribers after unsubscribing all subscribers', function () {
    var ps = new PubSub();
    var onMessage = ps.subscribe('message', function () {});
    var onMessage2 = ps.subscribe('message2', function () {});

    ps.unsubscribeAll();

    expect(ps.hasSubscribers()).toBe(false);
  });
});

// Clear all subscriptions at once.
describe('Clears all subscriptions at once', function () {
  it('Should unsubscribe from all subscriptions', function () {
    var ps = new PubSub();
    var listener = function listener() {};

    // Subscribe to some events
    ps.subscribe('eventA', listener);
    ps.subscribe('eventB', listener);
    ps.subscribe('eventC', listener);
    ps.subscribeOnce('eventA', listener);
    ps.subscribeOnce('eventB', listener);
    ps.subscribeOnce('eventC', listener);

    // Unsubscribe from all
    ps.unsubscribeAll();

    expect(ps.hasSubscribers('eventA')).toBe(false);
    expect(ps.hasSubscribers('eventB')).toBe(false);
    expect(ps.hasSubscribers('eventC')).toBe(false);
  });
});

// Get subscribers by topic
describe('Get subscribers by topic', function () {
  it('Should return an array of 2 subscribers for topic named "eventA"', function () {
    var ps = new PubSub();
    var listener = function listener() {};

    ps.subscribe('eventA', listener);
    ps.subscribe('eventA', listener);

    expect(ps.subscribersByTopic('eventA').length).toEqual(2);
  });

  it('Should return an empty array if we ask for subscribers for a not existing topic', function () {
    var ps = new PubSub();

    expect(ps.subscribersByTopic('eventA').length).toEqual(0);
  });
});

// Alias methods
describe('Public methods alias', function () {
  it('Should create aliases "on" and "off" for "subscribe" and "unsubscribe" methods respectively', function () {
    var ps = new PubSub().alias({
      subscribe: 'on',
      unsubscribe: 'off'
    });

    var t = ps.on('event-name', function () {});

    expect(PubSub.prototype.on).not.toBeUndefined();

    expect(PubSub.prototype.off).not.toBeUndefined();

    expect(ps.off(t)).toBe(0);
  });
});
