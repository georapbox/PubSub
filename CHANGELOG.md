# v2.0.0

- **[Breaking Change]** Reverse the arguments the `callback` function accepts, in order to allow the usage of `data` argument without the need to also specify the `topic` if not needed.
- Throw exception if `callback` is not a `function` or is not provided at all.
- Correct annotations and provide examples.
- Update dev dependancies.
- Provide `npm` scripts to run the tasks. No more need for global dependancies installed (Grunt).
