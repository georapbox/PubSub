# PubSub

Javascript implementation of the [Publish–Subscribe pattern](http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern).

[![Build Status](https://travis-ci.org/georapbox/PubSub.svg?branch=master)](https://travis-ci.org/georapbox/PubSub)
[![Code Climate](https://codeclimate.com/github/georapbox/PubSub/badges/gpa.svg)](https://codeclimate.com/github/georapbox/PubSub)
[![npm version](https://badge.fury.io/js/PubSub.svg)](http://badge.fury.io/js/PubSub)
[![Dependencies](https://david-dm.org/georapbox/PubSub.svg?theme=shields.io)](https://david-dm.org/georapbox/PubSub)
[![devDependency Status](https://david-dm.org/georapbox/PubSub/dev-status.svg)](https://david-dm.org/georapbox/PubSub#info=devDependencies)

## Installation

### Git installation
```sh
$ git clone https://github.com/georapbox/PubSub.git
```

### npm installation
```sh
$ npm install PubSub
```

### Bower installation
```sh
$ bower install georapbox.pubsub.js
```

## Using PubSub

```js
// Initialize PubSub
var ps = new PubSub();
```

### Subscribing events
The "listener" is the function to be executed when an event is emitted.
```js
function listener(data, topic) {
  console.log('An event is published.');
  console.log(topic);
  console.log(data);
}

// Subscribe to event
var sub = ps.subscribe('event-name', listener);

// Subscribe to event and execute only one time
var subOnce = ps.subscribeOnce('event-name', listener)
```

### Publishing events
The `publish` method takes two arguments:

- The first one is the name of the event.
- The second one (optional) is the data we may want to pass along as. We can pass data along using an array or an object as shown below.
```js
ps.publish('event-name', {
  prop1: value1,
  prop2: value2
});
```

### Unsubscribing events
There are two ways to unsubscribe an event:

- Unsubscribe from a specific topic based on a tokenized reference to the subscription.
```js
ps.unsubscribe(sub);
```
- Unsubscribe from a specific topic based on topic name. This way we can unsubscribe all events with the same name.
```js
ps.unsubscribe('event-name');
```

## Methods aliases
- `on` - `subscribe`
- `once` - `subscribeOnce`
- `trigger` - `publish`
- `off` - `unsubscribe`

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
