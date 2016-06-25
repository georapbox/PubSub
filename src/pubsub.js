/**
 * PubSub.js
 * Javascript implementation of the Publish/Subscribe pattern.
 *
 * @version 2.0.0
 * @author George Raptis (https://github.com/georapbox)
 * @homepage https://github.com/georapbox/PubSub
 * @repository git@github.com:georapbox/PubSub.git
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 George Raptis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
;(function (name, context, definition) {
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

    var PubSub = function () {
            this.topics = {};    // Storage for topics that can be broadcast or listened to.
            this.subUid = -1;    // A topic identifier.
        },
        proto = PubSub.prototype;

    /**
     * Alias a method while keeping the context correct,
     * to allow for overwriting of target method.
     *
     * @private
     * @this {PubSub}
     * @param {String} fn The name of the target method.
     * @return {Function} The aliased method.
     */
    function alias(fn) {
        return function closure () {
            return this[fn].apply(this, arguments);
        };
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
    proto.subscribe = function (topic, callback, once) {
        var token = this.subUid += 1,
            obj = {};

        if (typeof callback !== 'function') {
            throw new TypeError(
                'When subscribing for an event, a callback function must be defined.'
            );
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
    proto.subscribeOnce = function (topic, callback) {
        return this.subscribe(topic, callback, true);
    };

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
    proto.publish = function (topic, data) {
        var that = this,
            subscribers, currentSubscriber, len, token;

        if (!this.topics[topic]) {
            return false;
        }

        setTimeout(function () {
            subscribers = that.topics[topic];
            len = subscribers ? subscribers.length : 0;

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
                    that.unsubscribe(token);
                }
            }
        }, 0);

        return true;
    };

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
    proto.unsubscribe = function (topic) {
        var tf = false,
            prop, len;

        for (prop in this.topics) {
            if (this.topics.hasOwnProperty(prop)) {
                if (this.topics[prop]) {
                    len = this.topics[prop].length;

                    while (len) {
                        len -= 1;

                        // If t is a tokenized reference to the subscription.
                        // Removes one subscription from the array.
                        if (this.topics[prop][len].token === topic) {
                            this.topics[prop].splice(len, 1);
                            return topic;
                        }

                        // If t is the event type.
                        // Removes all the subscriptions that match the event type.
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
     * Alias for public methods.
     * subscribe     -> on
     * subscribeOnce -> once
     * publish       -> trigger
     * unsubscribe   -> off
     */
    proto.on = alias('subscribe');
    proto.once = alias('subscribeOnce');
    proto.trigger = alias('publish');
    proto.off = alias('unsubscribe');

    return PubSub;
}));
