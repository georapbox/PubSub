#PubSub

Javascript implementation of the Publish/Subscribe pattern.

##Using PubSub

<pre>
// Initialize PubSub
var ps = new PubSub();
</pre>

###Subscribing events
The "listener" is the function to be executed when an event is emitted.
<div class="highlight highlight-javascript">
<pre>
function listener(topic, data) {
    console.log(<span class="sl">'An event is published.'</span>);
    console.log(topic);
    console.log(data);
}

// Subscribe event
var sub = ps.subscribe('event-name', listener);
</pre>
</div>

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