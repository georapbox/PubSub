/**
 * PubSub.js - Javascript implementation of the Publish/Subscribe pattern.
 * @version 1.0.1
 * @homepage https://github.com/georapbox/PubSub
 * @author George Raptis (https://github.com/georapbox)
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

    var PubSub = function () {
            this.topics = {};    // Storage for topics that can be broadcast or listened to.
            this.subUid = -1;    // A topic identifier.
        },
    	proto = PubSub.prototype;

    /**
	 * Alias a method while keeping the context correct,
	 * to allow for overwriting of target method.
	 *
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
     * @param topic {String} The topic name.
     * @param callback {Function} Callback function to execute on event.
	 * @param once {Boolean} Checks if event will be triggered only one time (optional).
     * @return number token
     */
    proto.subscribe = function (topic, callback, once) {
        var token = (this.subUid += 1),
			obj = {};

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
	 * @param topic {String} The topic name.
     * @param callback {Function} Callback function to execute on event.
	 */
	proto.subscribeOnce = function (topic, callback) {
		this.subscribe(topic, callback, true);
	};

    /**
     * Publish or broadcast events of interest with a specific
     * topic name and arguments such as the data to pass along.
     *
     * @param topic {String} The topic name.
     * @param args {Object || Array} The data to be passed.
     * @return bool false if topic does not exist.
     * @return bool true if topic exists and event is published.
     */
    proto.publish = function (topic, args) {
        var that = this,
            subscribers,
            len;

        if (!this.topics[topic]) {
            return false;
        }

        setTimeout(function () {
            subscribers = that.topics[topic];
            len = subscribers ? subscribers.length : 0;

            while (len) {
                len -= 1;
				subscribers[len].callback(topic, args);

				// Unsubscribe from event based on tokenized reference,
				// if subscriber's property once is set to true.
				if (subscribers[len].once === true) {
					that.unsubscribe(subscribers[len].token);
				}
			}
        }, 0);

        return true;
    };

    /**
     * Unsubscribe from a specific topic, based on  the topic name,
     * or based on a tokenized reference to the subscription.
     *
     * @param t {String || Object} Topic name or subscription referenece.
     * @return bool false if argument passed does not match a subscribed event.
     */
    proto.unsubscribe = function (t) {
        var prop,
            len,
            tf = false;

        for (prop in this.topics) {
			if (this.topics.hasOwnProperty(prop)) {
				if (this.topics[prop]) {
					len = this.topics[prop].length;

					while (len) {
						len -= 1;

						// If t is a tokenized reference to the subscription.
						// Removes one subscription from the array.
						if (this.topics[prop][len].token === t) {
							this.topics[prop].splice(len, 1);
							return t;
						}

						// If t is the event type.
						// Removes all the subscriptions that match the event type.
						if (prop === t) {
							this.topics[prop].splice(len, 1);
							tf = true;
						}
					}

					if (tf === true) {
						return t;
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
