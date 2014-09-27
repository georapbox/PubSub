#PubSub

Javascript implementation of the Publish/Subscribe pattern.

##Using PubSub

<pre>
// Initialize PubSub
var ps = new PubSub();
</pre>

###Subscribing events
The "listener" is the function to be executed when an event is emitted.
<pre>
function listener(topic, data) {
    console.log('An event is published.');
    console.log(topic);
    console.log(data);
}

// Subscribe event
var sub = ps.subscribe('event-name', listener);
</pre>

###Publishing events
The <code>publish</code> method takes three arguments:

- The first one is the name of the event.
- The second one (optional) is the data we may want to pass along as. We can pass data along using an array or an object as shown below.
- The third argument (optional) is a callback function to be executed after an event is published.
<pre>
ps.publish('event-name', {
    prop1: value1,
    prop2: value2
}, function () {
    callbackFunction();
});
</pre>

###Unsubscribing events
There are two ways to unsubscribe an event:

- Unsubscribe from a specific topic based on a tokenized reference to the subscription.
<pre>ps.unsubscribe(sub);</pre>
- Unsubscribe from a specific topic based on topic name. This way we can unsubscribe all events with the same name.
<pre>ps.unsubscribe('event-name);</pre>

##Methods aliases
- <code>on</code> - <code>subscribe</code>
- <code>trigger</code> - <code>publish</code>
- <code>off</code> - <code>unsubscribe</code>

##Minify
To minify the project, run <code>grunt build</code> command. This will run the removelogging and uglify the code into <code>dist/pubsub.min.js</code>.

##License
This code is [MIT](http://opensource.org/licenses/mit-license.php) licenced:

Copyright (c) 2014 George Raptis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.