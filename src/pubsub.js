/**
 * PubSub.js
 * Javascript implementation of the Publish/Subscribe pattern.
 *
 * @version 3.4.0
 * @author George Raptis <georapbox@gmail.com> (georapbox.github.io)
 * @homepage https://github.com/georapbox/PubSub#readme
 * @repository https://github.com/georapbox/PubSub.git
 * @license MIT
 */
(function (name, context, definition) {
  'use strict';
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define(definition);
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = definition();
  } else {
    context[name] = definition(name, context);
  }
}('PubSub', this, function (name, context) {
  'use strict';

  var VERSION = '3.4.0';
  var OLD_PUBLIC_API = (context || {})[name];

  function forOwn(obj, callback, thisArg) {
    var key;

    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (callback && callback.call(thisArg, obj[key], key, obj) === false) {
          return;
        }
      }
    }

    return obj;
  }

  function alias(fn) {
    return function closure() {
      return this[fn].apply(this, arguments);
    };
  }

  function deliverTopic(instance, topic, data) {
    var topics = instance._pubsub_topics;
    var subscribers = topics[topic] ? topics[topic].slice(0) : [];
    var i = 0;
    var len = subscribers.length;
    var currentSubscriber, token;

    for (; i < len; i += 1) {
      token = subscribers[i].token;
      currentSubscriber = subscribers[i];

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

  function publishData(args) {
    var dataArgs = Array.prototype.slice.call(args, 1);
    return dataArgs.length <= 1 ? dataArgs[0] : dataArgs;
  }

  function publish(instance, topic, data, sync) {
    var topics = instance._pubsub_topics;

    if (!topics[topic]) {
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
    if (!(this instanceof PubSub)) {
      return new PubSub();
    }

    this._pubsub_topics = {}; // Storage for topics that can be broadcast or listened to.
    this._pubsub_uid = -1; // A topic identifier.
    return this;
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
    var topics = this._pubsub_topics;
    var token = this._pubsub_uid += 1;
    var obj = {};

    if (typeof callback !== 'function') {
      throw new TypeError('When subscribing for an event, a callback function must be defined.');
    }

    if (!topics[topic]) {
      topics[topic] = [];
    }

    obj.token = token;
    obj.callback = callback;
    obj.once = !!once;

    topics[topic].push(obj);

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
   * Publishes a topic asynchronously, passing the data to its subscribers.
   * Asynchronous publication helps in that the originator of the topics will
   * not be blocked while consumers process them.
   * For synchronous topic publication check `publishSync`.
   *
   * @memberof PubSub
   * @this {PubSub}
   * @param {string} topic The topic's name
   * @param {...*} [data] The data to be passed to its subscribers
   * @return {boolean} Returns `true` if topic exists and event is published; otheriwse `false`
   * @example
   *
   * pubsub.publish('user_add', {
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   email: 'johndoe@gmail.com'
   * });
   */
  PubSub.prototype.publish = function (topic /* , data */) {
    return publish(this, topic, publishData(arguments), false);
  };

  /**
   * Publishes a topic synchronously, passing the data to its subscribers.
   *
   * @memberof PubSub
   * @this {PubSub}
   * @param {string} topic The topic's name
   * @param {...*} [data] The data to be passed to its subscribers
   * @return {boolean} Returns `true` if topic exists and event is published; otheriwse `false`
   * @example
   *
   * pubsub.publishSync('user_add', {
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   email: 'johndoe@gmail.com'
   * });
   */
  PubSub.prototype.publishSync = function (topic /* , data */) {
    return publish(this, topic, publishData(arguments), true);
  };

  /**
   * Unsubscribes from a specific topic, based on the topic name,
   * or based on a tokenized reference to the subscription.
   *
   * @memberof PubSub
   * @this {PubSub}
   * @param {string|number} topic Topic's name or subscription reference
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
    var topics = this._pubsub_topics;
    var tf = false;
    var prop, len;

    for (prop in topics) {
      if (Object.prototype.hasOwnProperty.call(topics, prop)) {
        if (topics[prop]) {
          len = topics[prop].length;

          while (len) {
            len -= 1;

            // `topic` is a tokenized reference to the subscription.
            if (topics[prop][len].token === topic) {
              topics[prop].splice(len, 1);
              if (topics[prop].length === 0) {
                delete topics[prop];
              }
              return topic;
            }

            // `topic` is the event name.
            if (prop === topic) {
              topics[prop].splice(len, 1);
              if (topics[prop].length === 0) {
                delete topics[prop];
              }
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
   * Clears all subscriptions whatsoever.
   *
   * @memberof PubSub
   * @this {PubSub}
   * @return {PubSub} The PubSub instance.
   * @example
   *
   * var pubsub = new PubSub();
   * pubsub.subscribe('message1', function () {});
   * pubsub.subscribe('message2', function () {});
   * pubsub.subscribe('message3', function () {});
   * pubsub.unsubscribeAll();
   * pubsub.hasSubscribers(); // -> false
   */
  PubSub.prototype.unsubscribeAll = function () {
    this._pubsub_topics = {};
    return this;
  };

  /**
   * Checks if there are subscribers for a specific topic.
   * If `topic` is not provided, checks if there is at least one subscriber.
   *
   * @memberof PubSub
   * @this {PubSub}
   * @param {string} [topic] The topic's name to check
   * @return {boolean} Returns `true` there are subscribers; otherwise `false`
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
    var topics = this._pubsub_topics;
    var hasSubscribers = false;

    // If no arguments passed
    if (topic == null) {
      forOwn(topics, function (value, key) {
        if (key) {
          hasSubscribers = true;
          return false;
        }
      });

      return hasSubscribers;
    }

    // If a topic's name is passed as argument
    return Object.prototype.hasOwnProperty.call(topics, topic);
  };

  /**
   * Gets all the subscribers as a set of key value pairs that
   * represent the topic's name and the event listener(s) bound.
   *
   * @NOTE Mutating the result of this method does not affect the real subscribers. This is for reference only.
   *
   * @memberof PubSub
   * @this {PubSub}
   * @return {object} A readonly object with all subscribers.
   * @example
   *
   * var pubsub = new PubSub();
   *
   * pubsub.subscribe('message', listener);
   * pubsub.subscribe('message', listener);
   * pubsub.subscribe('another_message', listener);
   *
   * pubsub.subscribers();
   * // -> Object { message: Array[2], another_message: Array[1] }
   */
  PubSub.prototype.subscribers = function () {
    var res = {};
    forOwn(this._pubsub_topics, function (topicValue, topicKey) {
      res[topicKey] = topicValue.slice(0);
    });
    return res;
  };

  /**
   * Gets subscribers for a specific topic.
   *
   * @NOTE Mutating the result of this method does not affect the real subscribers. This is for reference only.
   *
   * @memberof PubSub
   * @this {PubSub}
   * @param {string} topic The topic's name to check for subscribers
   * @return {array} A copy array of all subscribers for a topic if exist; otherwise an empty array
   * @example
   *
   * var pubsub = new PubSub();
   *
   * pubsub.subscribe('message', listener1);
   * pubsub.subscribeOnce('message', listener2);
   * pubsub.subscribe('another_message', listener1);
   *
   * pubsub.subscribersByTopic('message');
   * // -> Array [{token: 0, once: false, callback: listener1()}, {token: 1, once: true, callback: listener2()}]
   *
   * pubsub.subscribersByTopic('another_message');
   * // -> Array [{token: 2, once: false, callback: listener1()}]
   *
   * pubsub.subscribersByTopic('some_message_not_existing');
   * // -> Array []
   */
  PubSub.prototype.subscribersByTopic = function (topic) {
    return this._pubsub_topics[topic] ? this._pubsub_topics[topic].slice(0) : [];
  };

  /**
   * Creates aliases for public methods.
   *
   * @memberof PubSub
   * @this {PubSub}
   * @param {object} aliasMap A plain object that maps the public methods to their aliases.
   * @return {PubSub} The PubSub instance.
   * @example
   *
   * var pubsub = new PubSub().alias({
   *   subscribe: 'on',
   *   subscribeOnce: 'once',
   *   publish: 'trigger',
   *   publishSync: 'triggerSync',
   *   unsubscribe: 'off',
   *   hasSubscribers: 'has'
   * });
   */
  PubSub.prototype.alias = function (aliasMap) {
    forOwn(aliasMap, function (value, key) {
      if (PubSub.prototype[key]) {
        PubSub.prototype[aliasMap[key]] = alias(key);
      }
    });

    return this;
  };

  /**
   * Rolls back the global `PubSub` identifier and returns the current constructor function.
   * This can be used to keep the global namespace clean, or it can be used to have multiple simultaneous libraries
   * (including separate versions/copies of `PubSub`) in the same project without conflicts over the `PubSub` global identifier.
   *
   * @NOTE The `PubSub.noConflict()` static method only makes sense when used in a normal browser global namespace environment.
   * It should not be used with CommonJS or AMD style modules.
   *
   * @memberof PubSub
   * @return {PubSub} The PubSub constructor.
   * @example
   *
   * var EventEmitter = PubSub.noConflict();
   * var emitter = new EventEmitter();
   */
  PubSub.noConflict = function noConflict() {
    if (context) {
      context[name] = OLD_PUBLIC_API;
    }
    return PubSub;
  };

  /**
   * PubSub version
   * @type {String}
   */
  PubSub.version = VERSION;

  return PubSub;
}));
