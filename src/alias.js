/**
 * Alias a method while keeping the context correct,
 * to allow for overwriting of target method.
 *
 * @private
 * @this {PubSub}
 * @param {String} fn The name of the target method.
 * @return {function} The aliased method.
 */
function alias(fn) {
  return function closure(...args) {
    return this[fn].apply(this, args);
  };
}

export default alias;
