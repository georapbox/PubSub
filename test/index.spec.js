import PubSub from '../src/index';

const noop = () => {};

describe('PubSub', () => {
  it('Creates a new instance of PubSub.', () => {
    const pubsub = new PubSub();

    expect(pubsub).not.toBeUndefined();

    expect(pubsub instanceof PubSub).toBe(true);
  });

  it('Should return a new instance of PubSub if new keyword is omitted', () => {
    const pubsub = new PubSub();

    expect(pubsub).not.toBeNull();

    expect(pubsub instanceof PubSub).toBe(true);
  });

  it('Subscribes to an event called: "example-event".', () => {
    const pubsub = new PubSub();

    expect(pubsub.subscribe('example-event', noop)).toBe(0);
  });

  it('Should subscribes to an event only once', () => {
    const pubsub = new PubSub();

    pubsub.subscribeOnce('one-time-event', noop);

    pubsub.publishSync('one-time-event'); // Publish once

    expect(pubsub.hasSubscribers('one-time-event')).toBe(false);
  });

  it('Should throw exception if a callback is not provided', () => {
    const pubsub = new PubSub();

    expect(() => {
      return pubsub.subscribe('example-event');
    }).toThrow(new TypeError('When subscribing for an event, a callback function must be defined.'));
  });

  it('Should publish "example-event" passing data: "{ dummyKey : \'dummyValue\' }"', () => {
    const pubsub = new PubSub();
    const spy = jest.spyOn(pubsub, 'publish');

    pubsub.subscribe('example-event', noop);

    pubsub.publish('example-event', {
      dummyKey: 'dummyValue'
    });

    expect(spy).toHaveBeenCalledWith('example-event', { dummyKey: 'dummyValue' });

    spy.mockRestore();
  });

  it('Should not publish an event that was not subscribed', () => {
    const pubsub = new PubSub();

    pubsub.subscribe('example-event', noop);

    expect(pubsub.publish('unsubscribed-event')).toBe(false);
  });

  it('Should publish asynchronously', done => {
    const pubsub = new PubSub();
    let counter = 0;
    const handler = () => {
      counter += 1;
      expect(counter).toBe(1);
      done();
    };

    pubsub.subscribe('async-event', handler);

    pubsub.publish('async-event');

    expect(counter).toBe(0);
  });

  it('Should publish synchronously', () => {
    const pubsub = new PubSub();
    let counter = 0;
    const handler = () => {
      counter += 1;
    };

    pubsub.subscribe('async-event', handler);

    pubsub.publishSync('async-event');

    expect(counter).toBe(1);
  });

  it('Should allow to pass multiple data arguments to publish and publishSync methods', () => {
    const pubsub = new PubSub();

    pubsub.subscribe('eventA', data => {
      expect(data).toEqual(['John', 'Doe']);
    });

    pubsub.subscribe('eventB', data => {
      expect(data).toEqual([{ fname: 'John' }, { lname: 'Doe' }]);
    });

    pubsub.subscribe('eventC', data => {
      expect(data).toBe('John Doe');
    });

    pubsub.subscribe('eventD', data => {
      expect(data).toEqual([null, null]);
    });

    pubsub.subscribe('eventE', data => {
      expect(data).toEqual([[1, 2, 3], ['a', 'b', 'c']]);
    });

    pubsub.subscribe('eventF', data => {
      expect(data).toEqual({ fname: 'John', lname: 'Doe' });
    });

    pubsub.publish('eventA', 'John', 'Doe');
    pubsub.publishSync('eventB', { fname: 'John' }, { lname: 'Doe' });
    pubsub.publishSync('eventC', 'John Doe');
    pubsub.publishSync('eventD', null, null);
    pubsub.publishSync('eventE', [1, 2, 3], ['a', 'b', 'c']);
    pubsub.publishSync('eventF', { fname: 'John', lname: 'Doe' });
  });

  it('Should unsubscribe from event using the event name ("example-event")', () => {
    const pubsub = new PubSub();

    pubsub.subscribe('example-event', noop);

    const unsub = pubsub.unsubscribe('example-event');

    expect(unsub).toBe('example-event');
    expect(pubsub.hasSubscribers('example-event')).toBe(false);
  });

  it('Should unsubscribe from event using tokenized reference to the subscription', () => {
    const pubsub = new PubSub();
    const sub = pubsub.subscribe('example-event', noop);

    pubsub.subscribe('example-event', noop);
    pubsub.subscribe('example-event', noop);

    expect(pubsub.unsubscribe(sub)).toBe(0);
    expect(pubsub.subscribers()['example-event'].length).toBe(2);
  });

  it('Should unsubscribe from an event that was not subscribed before', () => {
    const pubsub = new PubSub();
    const unsub = pubsub.unsubscribe('fake-event');

    expect(unsub).toBe(false);
  });

  it('Should return true when checking if there are subscribers for "message" event.', () => {
    const pubsub = new PubSub();
    pubsub.subscribe('message', noop);

    expect(pubsub.hasSubscribers('message')).toBe(true);
  });

  it('Should return false when checking if there are subscribers for "message" event after unsubscribing', () => {
    const pubsub = new PubSub();

    pubsub.subscribe('message', noop);
    pubsub.unsubscribe('message');

    expect(pubsub.hasSubscribers('message')).toBe(false);
  });

  it('Should return false when checking if there are subscribers for "message" without subscribing before', () => {
    const pubsub = new PubSub();

    expect(pubsub.hasSubscribers('message')).toBe(false);
  });

  it('Should return true when checking if there are any subscribers', () => {
    const pubsub = new PubSub();

    pubsub.subscribe('message', noop);

    expect(pubsub.hasSubscribers()).toBe(true);
  });

  it('Should return false when checking if there are any subscribers after unsubscribing all subscribers', () => {
    const pubsub = new PubSub();

    pubsub.subscribe('message', noop);
    pubsub.subscribe('message2', noop);

    pubsub.unsubscribeAll();

    expect(pubsub.hasSubscribers()).toBe(false);
  });

  it('Should unsubscribe from all subscriptions', () => {
    const pubsub = new PubSub();

    pubsub.subscribe('eventA', noop);
    pubsub.subscribe('eventB', noop);
    pubsub.subscribe('eventC', noop);
    pubsub.subscribeOnce('eventA', noop);
    pubsub.subscribeOnce('eventB', noop);
    pubsub.subscribeOnce('eventC', noop);

    pubsub.unsubscribeAll();

    expect(pubsub.hasSubscribers('eventA')).toBe(false);
    expect(pubsub.hasSubscribers('eventB')).toBe(false);
    expect(pubsub.hasSubscribers('eventC')).toBe(false);
  });

  it('Should return an array of 2 subscribers for topic named "eventA"', () => {
    const pubsub = new PubSub();

    pubsub.subscribe('eventA', noop);
    pubsub.subscribe('eventA', noop);

    expect(pubsub.subscribersByTopic('eventA')).toHaveLength(2);
  });

  it('Should return an empty array if we ask for subscribers for a not existing topic', () => {
    const pubsub = new PubSub();

    expect(pubsub.subscribersByTopic('eventA')).toHaveLength(0);
  });

  it('Should create aliases "on" and "off" for "subscribe" and "unsubscribe" methods respectively', () => {
    const pubsub = new PubSub();

    pubsub.alias({
      subscribe: 'on',
      unsubscribe: 'off'
    });

    const t = pubsub.on('event-name', noop);

    expect(PubSub.prototype.on).not.toBeUndefined();

    expect(PubSub.prototype.off).not.toBeUndefined();

    expect(pubsub.off(t)).toBe(0);
  });

  it('Should invoke every listener in the order that was added', () => {
    const pubsub = new PubSub();
    const arr = [];

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

    expect(arr).toEqual(['A', 'B', 'C']);
  });

  it('Should throw exceptions inside subscribers immediately', () => {
    const pubsub = new PubSub({
      immediateExceptions: true
    });

    pubsub.subscribe('topic', () => {
      throw new Error('Ooops!');
    });

    expect(() => {
      return pubsub.publishSync('topic');
    }).toThrow(new Error('Ooops!'));
  });

  it('Should not throw exceptions inside subscribers immediately', () => {
    const pubsub = new PubSub();

    pubsub.subscribe('topic', () => {
      throw new Error('Ooops!');
    });

    expect(() => {
      return pubsub.publishSync('topic');
    }).not.toThrow(new Error('Ooops!'));
  });
});
