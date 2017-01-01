/*!
 * PubSub - Javascript implementation of the Publish/Subscribe pattern.
 * 
 * @version v2.1.0
 * @author George Raptis <georapbox@gmail.com> (georapbox.github.io)
 * @homepage https://github.com/georapbox/PubSub#readme
 * @repository git+https://github.com:georapbox/PubSub.git
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("PubSub", [], factory);
	else if(typeof exports === 'object')
		exports["PubSub"] = factory();
	else
		root["PubSub"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _alias = __webpack_require__(1);
	
	var _alias2 = _interopRequireDefault(_alias);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var PubSub = function () {
	  function PubSub() {
	    _classCallCheck(this, PubSub);
	
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
	
	
	  _createClass(PubSub, [{
	    key: 'subscribe',
	    value: function subscribe(topic, callback, once) {
	      var token = this.subUid += 1;
	      var obj = {};
	
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
	
	  }, {
	    key: 'subscribeOnce',
	    value: function subscribeOnce(topic, callback) {
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
	
	  }, {
	    key: 'publish',
	    value: function publish(topic, data) {
	      var that = this;
	
	      if (!this.topics[topic]) {
	        return false;
	      }
	
	      setTimeout(function () {
	        var subscribers = that.topics[topic];
	        var len = subscribers ? subscribers.length : 0;
	
	        while (len) {
	          len -= 1;
	
	          var token = subscribers[len].token;
	          var currentSubscriber = subscribers[len];
	
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
	
	  }, {
	    key: 'unsubscribe',
	    value: function unsubscribe(topic) {
	      var tf = false;
	
	      for (var prop in this.topics) {
	        if (Object.hasOwnProperty.call(this.topics, prop)) {
	          if (this.topics[prop]) {
	            var len = this.topics[prop].length;
	
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
	  }]);
	
	  return PubSub;
	}();
	
	// Alias for public methods.
	
	
	PubSub.prototype.on = (0, _alias2.default)('subscribe');
	PubSub.prototype.once = (0, _alias2.default)('subscribeOnce');
	PubSub.prototype.trigger = (0, _alias2.default)('publish');
	PubSub.prototype.off = (0, _alias2.default)('unsubscribe');
	
	exports.default = PubSub;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
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
	  return function closure() {
	    return this[fn].apply(this, arguments);
	  };
	}
	
	exports.default = alias;
	module.exports = exports["default"];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=pubsub.js.map