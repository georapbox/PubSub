/*jshint ignore: start*/

describe('new PubSub', function () {
	it('Creates a new instance of PubSub.', function () {
		expect(new PubSub()).not.toBeNull();
	});
});


// Subscribe scenarios.
describe('Subscribe to an event.', function () {
	it('Subscribes to an event called: "example-event".', function () {
		function listener() {}
		
		var ps = new PubSub();
		expect(ps.subscribe('example-event', listener)).toBe(0);
	});
});


// Publish scenarios.
describe('Publish/Emmit an event.', function () {
	function listener() {}
	var ps = new PubSub();
	ps.subscribe('example-event', listener);
	
	it('Publishes "example-event" passing data: "{ dummyKey : \'dummyValue\' }".', function () {
		spyOn(ps, 'publish');
		
		ps.publish('example-event', {
			dummyKey: 'dummyValue'
		});
		
		expect(ps.publish).toHaveBeenCalledWith('example-event', { dummyKey: 'dummyValue' });
	});
	
	it('Publishes "example-event".', function () {	
		ps.publish('example-event', {
			dummyKey: 'dummyValue'
		});
		
		expect(ps.publish('example-event')).toBe(true);
	});
	
	it('Publishes an event that was not subscribed.', function () {
		expect(ps.publish('unsubscribed-event')).toBe(false);
	});
});


// Unsubscribe scenarios.
describe('Unsubscribe from event.', function () {
	it('Unsubscribes from event using the event name ("example-event").', function () {
		function listener() {}
		
		var ps = new PubSub();
		ps.subscribe('example-event', listener);
		var unsub = ps.unsubscribe('example-event');
		
		expect(unsub).toBe('example-event');
		expect(ps.topics['example-event'].length).toBe(0);
	});
	
	it('Unsubscribes from event using tokenized reference to the subscription.', function () {
		function listener() {}
		
		var ps = new PubSub(),
			sub = ps.subscribe('example-event', listener),
			sub2 = ps.subscribe('example-event', listener),
			sub3 = ps.subscribe('example-event', listener);
		
		expect(ps.unsubscribe(sub)).toBe(0);
		expect(ps.topics['example-event'].length).toBe(2);
	});
	
	it('Unsubscribes from an event that was not subscribed before.', function () {
		var ps = new PubSub(),
			unsub = ps.unsubscribe('fake-event');
		
		expect(unsub).toBe(false);
	});
});