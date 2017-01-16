# PubSub

Javascript implementation of the [Publish–Subscribe pattern](http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern).

[![Build Status](https://travis-ci.org/georapbox/PubSub.svg?branch=master)](https://travis-ci.org/georapbox/PubSub)
[![Code Climate](https://codeclimate.com/github/georapbox/PubSub/badges/gpa.svg)](https://codeclimate.com/github/georapbox/PubSub)
[![npm version](https://badge.fury.io/js/PubSub.svg)](http://badge.fury.io/js/PubSub)
[![Dependencies](https://david-dm.org/georapbox/PubSub.svg?theme=shields.io)](https://david-dm.org/georapbox/PubSub)
[![devDependency Status](https://david-dm.org/georapbox/PubSub/dev-status.svg)](https://david-dm.org/georapbox/PubSub#info=devDependencies)

## Install

### Git
```sh
$ git clone https://github.com/georapbox/PubSub.git
```

### npm
```sh
$ npm install PubSub
```

### Bower
```sh
$ bower install georapbox.pubsub.js
```

## API

* [PubSub](#PubSub)
    * [new PubSub()](#new_PubSub_new)
    * [.subscribe(topic, callback, [once])](#PubSub+subscribe) ⇒ <code>number</code>
    * [.subscribeOnce(topic, callback)](#PubSub+subscribeOnce) ⇒ <code>number</code>
    * [.publish(topic, [data])](#PubSub+publish) ⇒ <code>boolean</code>
    * [.publishSync(topic, [data])](#PubSub+publishSync) ⇒ <code>boolean</code>
    * [.unsubscribe(topic)](#PubSub+unsubscribe) ⇒ <code>boolean</code> &#124; <code>string</code>
    * [.hasSubscribers(topic)](#PubSub+hasSubscribers) ⇒ <code>Boolean</code>

<a name="new_PubSub_new"></a>

### new PubSub()
Creates a PubSub instance.

<a name="PubSub+subscribe"></a>

### pubSub.subscribe(topic, callback, [once]) ⇒ <code>number</code>
Subscribe to events of interest with a specific topic name and a
callback function, to be executed when the topic/event is observed.

**Kind**: instance method of <code>[PubSub](#PubSub)</code>  
**Returns**: <code>number</code> - The topic's token  
**this**: <code>{PubSub}</code>  

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

### pubSub.subscribeOnce(topic, callback) ⇒ <code>number</code>
Subscribe to events of interest setting a flag
indicating the event will be published only one time.

**Kind**: instance method of <code>[PubSub](#PubSub)</code>  
**Returns**: <code>number</code> - The topic's token  
**this**: <code>{PubSub}</code>  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic's name |
| callback | <code>function</code> | Callback function to execute on event, taking two arguments:        - {*} data The data passed when publishing an event        - {object} The topic's info (name & token) |

**Example**  
```js
var onUserAdd = pubsub.subscribeOnce('user_add', function (data, topic) {
  console.log('User added');
  console.log('user data:', data);
});
```
<a name="PubSub+publish"></a>

### pubSub.publish(topic, [data]) ⇒ <code>boolean</code>
Publishes a topic, passing the data to its subscribers.

**Kind**: instance method of <code>[PubSub](#PubSub)</code>  
**Returns**: <code>boolean</code> - Returns `true` if topic exists and event is published; otheriwse `false`  
**this**: <code>{PubSub}</code>  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic's name |
| [data] | <code>\*</code> | The data to be passed to its subscribers |

**Example**  
```js
pubsub.publish('user_add', {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com'
});
```
<a name="PubSub+publishSync"></a>

### pubSub.publishSync(topic, [data]) ⇒ <code>boolean</code>
Publishes a topic synchronously, passing the data to its subscribers.

**Kind**: instance method of <code>[PubSub](#PubSub)</code>  
**Returns**: <code>boolean</code> - Returns `true` if topic exists and event is published; otheriwse `false`  
**this**: <code>{PubSub}</code>  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> | The topic's name |
| [data] | <code>\*</code> | The data to be passed to its subscribers |

**Example**  
```js
pubsub.publishSync('user_add', {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com'
});
```
<a name="PubSub+unsubscribe"></a>

### pubSub.unsubscribe(topic) ⇒ <code>boolean</code> &#124; <code>string</code>
Unsubscribes from a specific topic, based on the topic name,
or based on a tokenized reference to the subscription.

**Kind**: instance method of <code>[PubSub](#PubSub)</code>  
**Returns**: <code>boolean</code> &#124; <code>string</code> - Returns `false` if `topic` does not match a subscribed event; otherwise the topic's name  
**this**: <code>{PubSub}</code>  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>string</code> &#124; <code>object</code> | Topic's name or subscription referenece |

**Example**  
```js
// Unsubscribe using the topic's name.
pubsub.unsubscribe('user_add');

// Unsubscribe using a tokenized reference to the subscription.
pubsub.unsubscribe(onUserAdd);
```
<a name="PubSub+hasSubscribers"></a>

### pubSub.hasSubscribers(topic) ⇒ <code>Boolean</code>
Checks if there are subscribers for a specific topic.

**Kind**: instance method of <code>[PubSub](#PubSub)</code>  
**Returns**: <code>Boolean</code> - Returns `true` if topic has subscribers; otherwise `false`  
**this**: <code>{PubSub}</code>  

| Param | Type | Description |
| --- | --- | --- |
| topic | <code>String</code> | The topic's name to check |

**Example**  
```js
var pubsub = new PubSub();
pubsub.on('message', function (data) {
  console.log(data);
});

pubsub.hasSubscribers('message');
// -> true
```


### Methods aliases
- `on` - `subscribe`
- `once` - `subscribeOnce`
- `trigger` - `publish`
- `triggerSync` - `publishSync`
- `off` - `unsubscribe`
- `has` - `hasSubscribers`

## Minify

```sh
$ npm run build
```

This will run the remove logging and uglify the code into `dist/pubsub.min.js`.

## Test

To run the tests:
```sh
$ npm test
```
