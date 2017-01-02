# CHANGELOG

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
