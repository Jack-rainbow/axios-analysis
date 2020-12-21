'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    //重写bind方法，把argument对象放在数组args里边
    return fn.apply(thisArg, args);
  };
};
