import alias from './alias';

class PubSub {
  constructor() {
    this.topics = {}; // Storage for topics that can be broadcast or listened to.
    this.subUid = -1; // A topic identifier.
  }

  /**
   * Subscribe to events of interest with a specific topic name and a
   * callback function, to be executed when the topic/event is observed.
   *
   * @this {PubSub}
   * @param {String} topic The topic name.
   * @param {Function} callback Callback function to execute on event, taking two arguments:
   *        - {*} data The data passed when publishing an event
   *        - {Object} The topic's info (name & token)
   * @param {Boolean} [once=false] Checks if event will be triggered only one time.
   * @return {Number} The topic's token.
   * @example
   *
   * var pubsub = new PubSub();
   *
   * var onUserAdd = pubsub.subscribe('user_add', function (data, topic) {
   *   console.log('User added');
   *   console.log('user data:', data);
   * });
   */
  subscribe(topic, callback, once) {
    const token = this.subUid += 1;
    const obj = {};

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
  }

  /**
   * Subscribe to events of interest setting a flag
   * indicating the event will be published only one time.
   *
   * @this {PubSub}
   * @param {String} topic The topic's name.
   * @param {Function} callback Callback function to execute on event, taking two arguments:
   *        - {*} data The data passed when publishing an event
   *        - {Object} The topic's info (name & token)
   * @return {Number} The topic's token.
   * @example
   *
   * var onUserAdd = pubsub.subscribeOnce('user_add', function (data, topic) {
   *   console.log('User added');
   *   console.log('user data:', data);
   * });
   */
  subscribeOnce(topic, callback) {
    return this.subscribe(topic, callback, true);
  }

  /**
   * Publish or broadcast events of interest with a specific
   * topic name and arguments such as the data to pass along.
   *
   * @this {PubSub}
   * @param {String} topic The topic's name.
   * @param {*} [data] The data to be passed.
   * @return {Boolean} `true` if topic exists and event is published, else `false`.
   * @example
   *
   * pubsub.publish('user_add', {
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   email: 'johndoe@gmail.com'
   * });
   */
  publish(topic, data) {
    const that = this;

    if (!this.topics[topic]) {
      return false;
    }

    setTimeout(function () {
      const subscribers = that.topics[topic];
      let len = subscribers ? subscribers.length : 0;

      while (len) {
        len -= 1;

        const token = subscribers[len].token;
        const currentSubscriber = subscribers[len];

        currentSubscriber.callback(data, {
          name: topic,
          token: token
        });

        // Unsubscribe from event based on tokenized reference,
        // if subscriber's property once is set to true.
        if (currentSubscriber.once === true) {
          that.unsubscribe(token);
        }
      }
    }, 0);

    return true;
  }

  /**
   * Unsubscribe from a specific topic, based on the topic name,
   * or based on a tokenized reference to the subscription.
   *
   * @this {PubSub}
   * @param {String|Object} topic Topic's name or subscription referenece.
   * @return {Boolean|String} `false` if `topic` does not match a subscribed event, else the topic's name.
   *
   * PubSub.unsubscribe('user_add');
   * or
   * pubsub.unsubscribe(onUserAdd);
   */
  unsubscribe(topic) {
    let tf = false;

    for (let prop in this.topics) {
      if (Object.hasOwnProperty.call(this.topics, prop)) {
        if (this.topics[prop]) {
          let len = this.topics[prop].length;

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
  }
}

// Alias for public methods.
PubSub.prototype.on = alias('subscribe');
PubSub.prototype.once = alias('subscribeOnce');
PubSub.prototype.trigger = alias('publish');
PubSub.prototype.off = alias('unsubscribe');

export default PubSub;
