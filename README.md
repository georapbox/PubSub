# PubSub

Javascript implementation of the [Publish/Subscribe](http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) pattern.

[![Build Status](https://travis-ci.com/georapbox/PubSub.svg?branch=master)](https://travis-ci.com/georapbox/PubSub)
[![npm version](https://badge.fury.io/js/PubSub.svg)](http://badge.fury.io/js/PubSub)
[![npm downloads](https://img.shields.io/npm/dt/PubSub.svg)](http://badge.fury.io/js/PubSub)
[![npm license](https://img.shields.io/npm/l/PubSub.svg)](http://badge.fury.io/js/PubSub)
[![Code Climate](https://codeclimate.com/github/georapbox/PubSub/badges/gpa.svg)](https://codeclimate.com/github/georapbox/PubSub)
[![Issue Count](https://codeclimate.com/github/georapbox/PubSub/badges/issue_count.svg)](https://codeclimate.com/github/georapbox/PubSub)
[![Codecov](https://img.shields.io/codecov/c/github/georapbox/PubSub/master.svg)](https://codecov.io/gh/georapbox/PubSub)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Dependencies](https://david-dm.org/georapbox/PubSub.svg?theme=shields.io)](https://david-dm.org/georapbox/PubSub)
[![devDependency Status](https://david-dm.org/georapbox/PubSub/dev-status.svg)](https://david-dm.org/georapbox/PubSub#info=devDependencies)

## Install

### npm
```sh
$ npm install PubSub
```

### Old school browser global
```html
<script src="https://unpkg.com/PubSub@<YOUR_PREFERRED_VERSION>/dist/pubsub.min.js"></script>
```

## API

* [PubSub](#PubSub)
    * [new PubSub([options])](#new_PubSub_new)
    * _instance_
        * [.subscribe(topic, callback, [once])](#PubSub+subscribe) ⇒ <code>number</code>
        * [.subscribeOnce(topic, callback)](#PubSub+subscribeOnce) ⇒ <code>number</code>
        * [.publish(topic, [...data])](#PubSub+publish) ⇒ <code>boolean</code>
        * [.publishSync(topic, [...data])](#PubSub+publishSync) ⇒ <code>boolean</code>
        * [.unsubscribe(topic)](#PubSub+unsubscribe) ⇒ <code>boolean</code> \| <code>string</code>
        * [.unsubscribeAll()](#PubSub+unsubscribeAll) ⇒ <code>[PubSub](#PubSub)</code>
        * [.hasSubscribers([topic])](#PubSub+hasSubscribers) ⇒ <code>boolean</code>
        * [.subscribers()](#PubSub+subscribers) ⇒ <code>object</code>
        * [.subscribersByTopic(topic)](#PubSub+subscribersByTopic) ⇒ <code>array</code>
        * [.alias(aliasMap)](#PubSub+alias) ⇒ <code>[PubSub](#PubSub)</code>
    * _static_
        * [.noConflict()](#PubSub.noConflict) ⇒ <code>[PubSub](#PubSub)</code>

<a name="new_PubSub_new"></a>

### new PubSub([options])
Creates a PubSub instance.

#### Available options

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| immediateExceptions<sup>1</sup> | <code>boolean</code> | <code>false</code> | Force immediate exceptions (instead of delayed exceptions). |

<sup>1</sup> *Before version 3.6.0 PubSub would fail to deliver your topics to all subscribers if one or more failed (see issue [#4](https://github.com/georapbox/PubSub/issues/4)). As of version 3.6.0 PubSub handles this by delaying thrown exceptions by default. You can set `immediateExceptions` to `true` in order to maintain the stack trace for development reasons but this is not recommended for production.*

## Public Methods

<a name="PubSub+subscribe"></a>

### subscribe(topic, callback, [once]) ⇒ <code>number</code>
Subscribe to events of interest with a specific topic name and a
callback function, to be executed when the topic/event is observed.

**Kind**: instance method of <code>[PubSub](#PubSub)</code>  
**Returns**: <code>number</code> - The topic's token  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| topic | <code>string</code> |  | The topic's name |
| callback | <code>function</code> |  | Callback function to execute on event, taking two arguments:        - {*} data The data passed when publishing an event        - {object} The topic's info (name & token) |
| [once] | <code>boolean</code> | <code>false</code> | Checks if event will be triggered only one time |

**Example**  
```js
var pubsub = new PubSub();

var onUserAdd = pubsub.subscribe('user_add', function (data, topic) {
  console.log('User added');
  console.log('user data:', data);
});
```
<a name="PubSub+subscribeOnce"></a>

### subscribeOnce(topic, callback) ⇒ <code>number</code>
Subscribe to events of interest setting a flag
indicating the event will be published only one time.

**Kind**: instance method of <code>[PubSub](#PubSub)</code>  
**Returns**: <code>number</code> - The topic's token  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic's name |
| callback | <code>function</code> | Callback function to execute on event, taking two arguments:        - {*} data The data passed when publishing an event        - {object} The topic's info (name & token) |

**Example**  
```js
var pubsub = new PubSub();

var onUserAdd = pubsub.subscribeOnce('user_add', function (data, topic) {
  console.log('User added');
  console.log('user data:', data);
});
```
<a name="PubSub+publish"></a>

### publish(topic, [data]) ⇒ <code>boolean</code>
Publishes a topic **asynchronously**, passing the data to its subscribers.  
Asynchronous publication helps in that the originator of the topics will not be blocked while consumers process them.  
For synchronous topic publication check `publishSync`.

**Kind**: instance method of <code>[PubSub](#PubSub)</code>  
**Returns**: <code>boolean</code> - Returns `true` if topic exists and event is published; otheriwse `false`  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic's name |
| [data] | <code>...\*</code> | The data to be passed to its subscribers |

**Example**  
```js
var pubsub = new PubSub();

pubsub.publish('user_add', {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com'
});
```
<a name="PubSub+publishSync"></a>

### publishSync(topic, [data]) ⇒ <code>boolean</code>
Publishes a topic **synchronously**, passing the data to its subscribers.

**Kind**: instance method of <code>[PubSub](#PubSub)</code>  
**Returns**: <code>boolean</code> - Returns `true` if topic exists and event is published; otheriwse `false`  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic's name |
| [data] | <code>...\*</code> | The data to be passed to its subscribers |

**Example**  
```js
var pubsub = new PubSub();

pubsub.publishSync('user_add', {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com'
});
```
<a name="PubSub+unsubscribe"></a>

### unsubscribe(topic) ⇒ <code>boolean</code> \| <code>string</code>
Unsubscribes from a specific topic, based on the topic name,
or based on a tokenized reference to the subscription.

**Kind**: instance method of <code>[PubSub](#PubSub)</code>  
**Returns**: <code>boolean</code> \| <code>string</code> - Returns `false` if `topic` does not match a subscribed event; otherwise the topic's name  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> \| <code>number</code> | Topic's name or subscription reference |

**Example**  
```js
var pubsub = new PubSub();

// Unsubscribe using the topic's name.
pubsub.unsubscribe('user_add');

// Unsubscribe using a tokenized reference to the subscription.
pubsub.unsubscribe(onUserAdd);
```
<a name="PubSub+unsubscribeAll"></a>

### unsubscribeAll() ⇒ <code>[PubSub](#PubSub)</code>
Clears all subscriptions whatsoever.

**Kind**: instance method of <code>[PubSub](#PubSub)</code>  
**Returns**: <code>[PubSub](#PubSub)</code> - The PubSub instance.  
**Example**  
```js
var pubsub = new PubSub();

pubsub.subscribe('message1', function () {});
pubsub.subscribe('message2', function () {});
pubsub.subscribe('message3', function () {});
pubsub.unsubscribeAll();
pubsub.hasSubscribers(); // -> false
```
<a name="PubSub+hasSubscribers"></a>

### hasSubscribers([topic]) ⇒ <code>boolean</code>
Checks if there are subscribers for a specific topic.
If `topic` is not provided, checks if there is at least one subscriber.

**Kind**: instance method of <code>[PubSub](#PubSub)</code>  
**Returns**: <code>boolean</code> - Returns `true` there are subscribers; otherwise `false`  

| Param | Type | Description |
| --- | --- | --- |
| [topic] | <code>string</code> | The topic's name to check |

**Example**  
```js
var pubsub = new PubSub();

pubsub.on('message', function (data) {
  console.log(data);
});

pubsub.hasSubscribers('message');
// -> true
```
<a name="PubSub+subscribers"></a>

### subscribers() ⇒ <code>object</code>
Gets all the subscribers as a set of key value pairs that
represent the topic's name and the event listener(s) bound.

**Kind**: instance method of <code>[PubSub](#PubSub)</code>  
**Returns**: <code>object</code> - A readonly object with all subscribers.  
**Note**: Mutating the result of this method does not affect the real subscribers. This is for reference only.  
**Example**  
```js
var pubsub = new PubSub();

pubsub.subscribe('message', listener);
pubsub.subscribe('message', listener);
pubsub.subscribe('another_message', listener);

pubsub.subscribers();
// -> Object { message: Array[2], another_message: Array[1] }
```
<a name="PubSub+subscribersByTopic"></a>

### subscribersByTopic(topic) ⇒ <code>array</code>
Gets subscribers for a specific topic.

**Kind**: instance method of <code>[PubSub](#PubSub)</code>  
**Returns**: <code>array</code> - A copy array of all subscribers for a topic if exist; otherwise an empty array  
**Note**: Mutating the result of this method does not affect the real subscribers. This is for reference only.

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>String</code> | The topic's name to check for subscribers |

**Example**  
```js
var pubsub = new PubSub();

pubsub.subscribe('message', listener1);
pubsub.subscribeOnce('message', listener2);
pubsub.subscribe('another_message', listener1);

pubsub.subscribersByTopic('message');
// -> Array [{token: 0, once: false, callback: listener1()}, {token: 1, once: true, callback: listener2()}]

pubsub.subscribersByTopic('another_message');
// -> Array [{token: 2, once: false, callback: listener1()}]

pubsub.subscribersByTopic('some_message_not_existing');
// -> Array []
```
<a name="PubSub+alias"></a>

### alias(aliasMap) ⇒ <code>[PubSub](#PubSub)</code>
Creates aliases for public methods.

**Kind**: instance method of <code>[PubSub](#PubSub)</code>  
**Returns**: <code>[PubSub](#PubSub)</code> - The PubSub instance.  

| Param | Type | Description |
| --- | --- | --- |
| aliasMap | <code>Object</code> | A plain object that maps the public methods to their aliases. |

**Example**  
```js
var pubsub = new PubSub().alias({
  subscribe: 'on',
  subscribeOnce: 'once',
  publish: 'trigger',
  publishSync: 'triggerSync',
  unsubscribe: 'off',
  hasSubscribers: 'has'
});
```

## Static methods

<a name="PubSub.noConflict"></a>

### PubSub.noConflict() ⇒ <code>[PubSub](#PubSub)</code>
Rolls back the global `PubSub` identifier and returns the current constructor function.
This can be used to keep the global namespace clean, or it can be used to have multiple simultaneous libraries
(including separate versions/copies of `PubSub`) in the same project without conflicts over the `PubSub` global identifier.

**Kind**: static method of <code>[PubSub](#PubSub)</code>  
**Returns**: <code>[PubSub](#PubSub)</code> - The PubSub constructor.  
**Note**: The `PubSub.noConflict()` static method only makes sense when used in a normal browser global namespace environment. It should not be used with CommonJS or AMD style modules.  
**Example**  
```js
var EventEmitter = PubSub.noConflict();
var emitter = new EventEmitter();
```

## Minify source code

```sh
$ npm run build
```

This will run the remove logging and uglify the code into `dist/pubsub.min.js`.

## Test

To run the tests:
```sh
$ npm test
```

## Changelog

For API updates and breaking changes, check the [CHANGELOG](https://github.com/georapbox/PubSub/blob/master/CHANGELOG.md).

## More about Publish/Subscribe pattern

- [The Observer Pattern - Addy Osmani](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#observerpatternjavascript)
- [Publish–Subscribe pattern - Wikipedia](http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)

## License

[The MIT License (MIT)](https://georapbox.mit-license.org/@2014)
