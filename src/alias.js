/**
 * Alias a method while keeping the context correct,
 * to allow for overwriting of target method.
 *
 * @private
 * @this {PubSub}
 * @param {String} fn The name of the target method.
 * @return {Function} The aliased method.
 */
function alias(fn) {
  return function closure() {
    return this[fn].apply(this, arguments);
  };
}

export default alias;
