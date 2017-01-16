/**
 * PubSub.js
 * Javascript implementation of the Publish/Subscribe pattern.
 *
 * @version 2.1.0
 * @author George Raptis <georapbox@gmail.com> (georapbox.github.io)
 * @homepage https://github.com/georapbox/PubSub#readme
 * @repository git+https://github.com/georapbox/PubSub.git
 * @license MIT
 */
(function (name, context, definition) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(definition);
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = definition();
  } else {
    context[name] = definition();
  }
}('PubSub', this, function () {
  'use strict';

  function alias(fn) {
    return function closure() {
      return this[fn].apply(this, arguments);
    };
  }

  function deliverTopic(instance, topic, data) {
    var subscribers = instance.topics[topic],
      len = subscribers ? subscribers.length : 0,
      currentSubscriber, token;

    while (len) {
      len -= 1;
      token = subscribers[len].token;
      currentSubscriber = subscribers[len];

      currentSubscriber.callback(data, {
        name: topic,
        token: token
      });

      // Unsubscribe from event based on tokenized reference,
      // if subscriber's property once is set to true.
      if (currentSubscriber.once === true) {
        instance.unsubscribe(token);
      }
    }
  }

  function publish(instance, topic, data, sync) {
    if (!instance.topics[topic]) {
      return false;
    }

    sync ? deliverTopic(instance, topic, data) : setTimeout(function () {
      deliverTopic(instance, topic, data);
    }, 0);

    return true;
  }

  /**
   * Creates a PubSub instance.
   * @constructor PubSub
   */
  function PubSub() {
    this.topics = {}; // Storage for topics that can be broadcast or listened to.
    this.subUid = -1; // A topic identifier.
  }

  /**
   * Subscribe to events of interest with a specific topic name and a
   * callback function, to be executed when the topic/event is observed.
   *
   * @memberof PubSub
   * @this {PubSub}
   * @param {string} topic The topic's name
   * @param {function} callback Callback function to execute on event, taking two arguments:
   *        - {*} data The data passed when publishing an event
   *        - {object} The topic's info (name & token)
   * @param {boolean} [once=false] Checks if event will be triggered only one time
   * @return {number} The topic's token
   * @example
   *
   * var pubsub = new PubSub();
   *
   * var onUserAdd = pubsub.subscribe('user_add', function (data, topic) {
   *   console.log('User added');
   *   console.log('user data:', data);
   * });
   */
  PubSub.prototype.subscribe = function (topic, callback, once) {
    var token = this.subUid += 1,
      obj = {};

    if (typeof callback !== 'function') {
      throw new TypeError('When subscribing for an event, a callback function must be defined.');
    }

    if (!this.topics[topic]) {
      this.topics[topic] = [];
    }

    obj.token = token;
    obj.callback = callback;
    obj.once = !!once;

    this.topics[topic].push(obj);

    return token;
  };

  /**
   * Subscribe to events of interest setting a flag
   * indicating the event will be published only one time.
   *
   * @memberof PubSub
   * @this {PubSub}
   * @param {string} topic The topic's name
   * @param {function} callback Callback function to execute on event, taking two arguments:
   *        - {*} data The data passed when publishing an event
   *        - {object} The topic's info (name & token)
   * @return {number} The topic's token
   * @example
   *
   * var onUserAdd = pubsub.subscribeOnce('user_add', function (data, topic) {
   *   console.log('User added');
   *   console.log('user data:', data);
   * });
   */
  PubSub.prototype.subscribeOnce = function (topic, callback) {
    return this.subscribe(topic, callback, true);
  };

  /**
   * Publishes a topic, passing the data to its subscribers.
   *
   * @memberof PubSub
   * @this {PubSub}
   * @param {string} topic The topic's name
   * @param {*} [data] The data to be passed to its subscribers
   * @return {boolean} Returns `true` if topic exists and event is published; otheriwse `false`
   * @example
   *
   * pubsub.publish('user_add', {
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   email: 'johndoe@gmail.com'
   * });
   */
  PubSub.prototype.publish = function (topic, data) {
    return publish(this, topic, data, false);
  };

  /**
   * Publishes a topic synchronously, passing the data to its subscribers.
   *
   * @memberof PubSub
   * @this {PubSub}
   * @param {string} topic The topic's name
   * @param {*} [data] The data to be passed to its subscribers
   * @return {boolean} Returns `true` if topic exists and event is published; otheriwse `false`
   * @example
   *
   * pubsub.publishSync('user_add', {
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   email: 'johndoe@gmail.com'
   * });
   */
  PubSub.prototype.publishSync = function (topic, data) {
    return publish(this, topic, data, true);
  };

  /**
   * Unsubscribes from a specific topic, based on the topic name,
   * or based on a tokenized reference to the subscription.
   *
   * @memberof PubSub
   * @this {PubSub}
   * @param {string|object} topic Topic's name or subscription referenece
   * @return {boolean|string} Returns `false` if `topic` does not match a subscribed event; otherwise the topic's name
   * @example
   *
   * // Unsubscribe using the topic's name.
   * pubsub.unsubscribe('user_add');
   *
   * // Unsubscribe using a tokenized reference to the subscription.
   * pubsub.unsubscribe(onUserAdd);
   */
  PubSub.prototype.unsubscribe = function (topic) {
    var tf = false,
      prop, len;

    for (prop in this.topics) {
      if (Object.hasOwnProperty.call(this.topics, prop)) {
        if (this.topics[prop]) {
          len = this.topics[prop].length;

          while (len) {
            len -= 1;

            // `topic` is a tokenized reference to the subscription.
            if (this.topics[prop][len].token === topic) {
              this.topics[prop].splice(len, 1);
              return topic;
            }

            // `topic` is the event name.
            if (prop === topic) {
              this.topics[prop].splice(len, 1);
              tf = true;
            }
          }

          if (tf === true) {
            return topic;
          }
        }
      }
    }

    return false;
  };

  /**
   * Checks if there are subscribers for a specific topic.
   *
   * @memberof PubSub
   * @this {PubSub}
   * @param {String} topic The topic's name to check
   * @return {Boolean} Returns `true` if topic has subscribers; otherwise `false`
   * @example
   *
   * var pubsub = new PubSub();
   * pubsub.on('message', function (data) {
   *   console.log(data);
   * });
   *
   * pubsub.hasSubscribers('message');
   * // -> true
   */
  PubSub.prototype.hasSubscribers = function (topic) {
    var topics = this.topics;

    if (Object.hasOwnProperty.call(topics, topic) && topics[topic].length > 0) {
      return true;
    }

    return false;
  };

  // Alias for public methods.
  PubSub.prototype.on = alias('subscribe');
  PubSub.prototype.once = alias('subscribeOnce');
  PubSub.prototype.trigger = alias('publish');
  PubSub.prototype.triggerSync = alias('publishSync');
  PubSub.prototype.off = alias('unsubscribe');
  PubSub.prototype.has = alias('hasSubscribers');

  return PubSub;
}));
