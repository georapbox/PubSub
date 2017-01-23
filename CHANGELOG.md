# CHANGELOG

## v3.1.0
- `hasSubscribers` checks if there is at least one subscriber, no matter its name, if no argument is passed.
- Add public method `subscribers()` to get a readonly object of the current subscribers.

## v3.0.0

### Breaking changes

The default API method aliases are deprecated and removed from v3.0.0 onwards. However there is a new method `alias` introduced, that allows to create your own aliases. Therefore, if you already use those aliases in a project you can use the `alias` method to provide your own.

Below is a map of the default aliases that existed prior to version 3.0.0:

| Original method  | Alias method  |
| ---------------  | ------------- |
| `subscribe`      | `on`          |
| `subscribeOnce`  | `once`        |
| `publishSync`    | `triggerSync` |
| `unsubscribe`    | `off`         |
| `hasSubscribers` | `has`         |

To create your own aliases:

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

### Other updates

- Add public method `unsubscribeAll` to clear all subscriptions whatsoever.
- Add public method `alias` to create your own method aliases. (See above)
- Provide source-map for the minified library.

## v2.1.0
- Add support for publishing events synchronously using `publishSync` method.
- Add public method `hasSubscribers` to check if there are subscribers for a specific topic.

## v2.0.3
- Add support for Travis CI.
- Lint source code using ESLint.

## v2.0.2
- Keep devDependencies up to date.

## v2.0.0

### Breaking changes

- Reverse the arguments the `callback` function accepts, in order to allow the usage of `data` argument without the need to also specify the `topic` if not needed.
- Throw exception if `callback` is not a `function` or is not provided at all.

### Other updates
- Return token on `subscribeOnce` method.
- Correct annotations and provide examples.
- Update dev dependancies.
- Provide `npm` scripts to run the tasks. No more need for global dependancies installed (Grunt).
