import PubSub from '../src/index';

const noop = () => {};

describe('PubSub', () => {
  it('Should create a new instance of PubSub.', () => {
    const pubsub = new PubSub();

    expect(pubsub).not.toBeUndefined();

    expect(pubsub instanceof PubSub).toBe(true);
  });

  it('Should create a new instance of PubSub using the "createInstance()" static method.', () => {
    const pubsub = PubSub.createInstance({
      immediateExceptions: true
    });

    expect(pubsub).not.toBeNull();

    expect(pubsub._options.immediateExceptions).toBe(true);

    expect(pubsub instanceof PubSub).toBe(true);
  });

  it('Should subscribe to an event.', () => {
    const pubsub = new PubSub();

    expect(pubsub.subscribe('topic', noop)).toBe(0);
  });

  it('Should subscribe to an event only once', () => {
    const pubsub = new PubSub();

    pubsub.subscribeOnce('one-time-event', noop);

    pubsub.publishSync('one-time-event'); // Publish once

    expect(pubsub.hasSubscribers('one-time-event')).toBe(false);
  });

  it('Should throw exception if a callback is not provided to the subscriber.', () => {
    const pubsub = new PubSub();

    expect(() => {
      return pubsub.subscribe('topic');
    }).toThrow(new TypeError('When subscribing for an event, a callback function must be defined.'));
  });

  it('Should publish an event with name "topic" passing data: "{ dummyKey : \'dummyValue\' }"', () => {
    const pubsub = new PubSub();
    const spy = jest.spyOn(pubsub, 'publish');

    pubsub.subscribe('topic', noop);

    pubsub.publish('topic', {
      dummyKey: 'dummyValue'
    });

    expect(spy).toHaveBeenCalledWith('topic', { dummyKey: 'dummyValue' });

    spy.mockRestore();
  });

  it('Should not publish an event that was not subscribed.', () => {
    const pubsub = new PubSub();

    pubsub.subscribe('topic', noop);

    expect(pubsub.publish('unknown-topic')).toBe(false);
  });

  it('Should publish an event asynchronously.', done => {
    const pubsub = new PubSub();
    let counter = 0;

    pubsub.subscribe('topic', () => {
      counter += 1;
      expect(counter).toBe(1);
      done();
    });

    pubsub.publish('topic');

    expect(counter).toBe(0);
  });

  it('Should publish an event synchronously.', () => {
    const pubsub = new PubSub();
    let counter = 0;

    pubsub.subscribe('topic', () => {
      counter += 1;
    });

    pubsub.publishSync('topic');

    expect(counter).toBe(1);
  });

  it('Should allow to pass multiple data arguments to "publish" methods.', done => {
    const pubsub = new PubSub();

    pubsub.subscribe('topic', data => {
      expect(data).toEqual(['foo', 'bar']);
      done();
    });

    pubsub.publish('topic', 'foo', 'bar');
  });

  it('Should allow to pass multiple data arguments to "publishSync" methods.', done => {
    const pubsub = new PubSub();

    pubsub.subscribe('topic', data => {
      expect(data).toEqual(['foo', 'bar']);
      done();
    });

    pubsub.publishSync('topic', 'foo', 'bar');
  });

  it('Should unsubscribe from event using the event name "topic".', () => {
    const pubsub = new PubSub();

    pubsub.subscribe('topic', noop);

    const unsub = pubsub.unsubscribe('topic');

    expect(unsub).toBe('topic');
    expect(pubsub.hasSubscribers('topic')).toBe(false);
  });

  it('Should unsubscribe from event using tokenized reference to the subscription.', () => {
    const pubsub = new PubSub();
    const sub = pubsub.subscribe('topic', noop);

    pubsub.subscribe('topic', noop);
    pubsub.subscribe('topic', noop);

    expect(pubsub.unsubscribe(sub)).toBe(0);
    expect(pubsub.subscribers()['topic']).toHaveLength(2);
  });

  it('Should unsubscribe from an event that was not subscribed before.', () => {
    const pubsub = new PubSub();
    const unsub = pubsub.unsubscribe('topic');

    expect(unsub).toBe(false);
  });

  it('Should return true when checking if there are subscribers for an event that has been a subscription for.', () => {
    const pubsub = new PubSub();

    pubsub.subscribe('topic', noop);

    expect(pubsub.hasSubscribers('topic')).toBe(true);
  });

  it('Should return false when checking if there are subscribers for an event that we unsubscribed from.', () => {
    const pubsub = new PubSub();

    pubsub.subscribe('topic', noop);
    pubsub.unsubscribe('topic');

    expect(pubsub.hasSubscribers('topic')).toBe(false);
  });

  it('Should return false when checking if there are subscribers for an event that has NOT been a subscription for.', () => {
    const pubsub = new PubSub();

    expect(pubsub.hasSubscribers('topic')).toBe(false);
  });

  it('Should return false when checking if there are any subscribers after unsubscribing ALL subscribers.', () => {
    const pubsub = new PubSub();

    pubsub.subscribe('topic-A', noop);
    pubsub.subscribe('topic-B', noop);
    pubsub.subscribe('topic-C', noop);

    pubsub.unsubscribeAll();

    expect(pubsub.hasSubscribers()).toBe(false);
  });

  it('Should return true when checking if there any subscribers when we have subscribed at least for one event.', () => {
    const pubsub = new PubSub();

    pubsub.subscribe('topic', noop);

    expect(pubsub.hasSubscribers()).toBe(true);
  });

  it('Should return an array of 2 subscribers for topic named "topic".', () => {
    const pubsub = new PubSub();

    pubsub.subscribe('topic', noop);
    pubsub.subscribe('topic', noop);

    expect(pubsub.subscribersByTopic('topic')).toHaveLength(2);
  });

  it('Should return an empty array if we ask for subscribers for a not existing topic.', () => {
    const pubsub = new PubSub();

    expect(pubsub.subscribersByTopic('topic')).toHaveLength(0);
  });

  it('Should create aliases "on" and "off" for "subscribe" and "unsubscribe" methods respectively.', () => {
    const pubsub = new PubSub();

    pubsub.alias({
      subscribe: 'on',
      unsubscribe: 'off'
    });

    const t = pubsub.on('topic', noop);

    expect(PubSub.prototype.on).not.toBeUndefined();
    expect(typeof PubSub.prototype.on).toBe('function');

    expect(PubSub.prototype.off).not.toBeUndefined();
    expect(typeof PubSub.prototype.off).toBe('function');

    expect(pubsub.off(t)).toBe(0);
  });

  it('Should invoke every listener in the order that was subscribed.', () => {
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

    pubsub.subscribe('topic', listener1);
    pubsub.subscribe('topic', listener2);
    pubsub.subscribe('topic', listener3);

    pubsub.publishSync('topic');

    expect(arr).toEqual(['A', 'B', 'C']);
  });

  it('Should throw exceptions inside subscribers immediately when "immediateExceptions" option is a truthy value.', () => {
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

  it('Should not throw exceptions inside subscribers immediately when "immediateExceptions" option is a falsy value.', () => {
    const pubsub = new PubSub({
      immediateExceptions: false
    });

    pubsub.subscribe('topic', () => {
      throw new Error('Ooops!');
    });

    expect(() => {
      return pubsub.publishSync('topic');
    }).not.toThrow(new Error('Ooops!'));
  });
});
