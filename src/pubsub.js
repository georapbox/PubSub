/**
 * PubSub.js - Javascript implementation of the Publish/Subscribe pattern.
 * @version 1.0.0
 * @homepage https://github.com/georapbox/PubSub
 * @author George Raptis <https://github.com/georapbox>
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 George Raptis
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

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = definition();
	} else if (typeof define === 'function' && define.amd) {
		define(definition);
	} else {
		context[name] = definition();
	}
}('PubSub', this, function () {
	'use strict';

	var 
        PubSub = function () {
            this.topics = {};    // Storage for topics that can be broadcast or listened to.
            this.subUid = -1;    // A topic identifier.
        },
        proto = PubSub.prototype;
    
    /**
	 * Alias a method while keeping the context correct, to allow for overwriting of target method.
	 *
     * @param {String} fn The name of the target method.
	 * @return {Function} The aliased method.
	 */
    function alias(fn) {
		return function closure() {
            return this[fn].apply(this, arguments);
		};
	}
    
    /**
     * Subscribe to events of interest with a specific topic name and a
     * callback function, to be executed when the topic/event is observed.
     *
     * @param topic {String} The topic name.
     * @param callback {Function} Callback function to execute on event.
     * @return this {Object}
     */
    proto.subscribe = function (topic, callback) {
        var token = (this.subUid += 1);
        
        if (!this.topics[topic]) {
            this.topics[topic] = [];
        }
        
        this.topics[topic].push({
            token: token,
            eventType: topic,
            callback: callback
        });
        
        return this;
    };
    
    /**
     * Publish or broadcast events of interest with a specific
     * topic name and arguments such as the data to pass along.
     *
     * @param topic {String} The topic name.
     * @param args {Object || Array} The data to be passed.
     * @param callback {Function} Callback function to execute after event is published.
     * @return false {Boolean} if topic does not exist.
     * @return true {Boolean} if topic exists and event is published.
     */
    proto.publish = function (topic, args, callback) {
        var that = this,
            subscribers,
            len;
        
        if (!this.topics[topic]) {
            return false;
        }
        
        setTimeout(function () {
            subscribers = that.topics[topic];
            len = subscribers ? subscribers.length : 0;
            
            // Handle possibility that a callback is passed, without any data.
            if (typeof args === 'function') {
                args = {};
            }
            
            while (len) {
                len -= 1;
                subscribers[len].callback(topic, args);
            }
            
            if (typeof callback !== 'undefined' && typeof callback === 'function') {
                callback();
            }
        }, 0);
        
        return true;
    };
    
    /**
     * Unsubscribe from a specific topic, based on  the topic name.
     *
     * @param topic {String} Topic to unsubscribe from.
     * @return topic {String} if argument passed matches a subscribed event.
     * @return false {Boolean} if argument passed does not match a subscribed event.
     */
    proto.unsubscribe = function (topic) {
        var prop, i, len;
            
        for (prop in this.topics) {
            if (this.topics[prop]) {
                for (i = 0, len = this.topics[prop].length; i < len; i += 1) {
                    if (this.topics[prop][i].eventType === topic) {
                        this.topics[prop].splice(i, 1);
                        return topic;
                    }
                }
            }
        }
        
        return false;
    };
    
    /**
     * Alias for public methods.
     * subscribe   -> on
     * publish     -> trigger 
     * unsubscribe -> off
     */
    proto.on = alias('subscribe');
    proto.trigger = alias('publish');
    proto.off = alias('unsubscribe');
    
	return PubSub;
}));