
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-domify/index.js", function(exports, require, module){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Wrap map from jquery.
 */

var map = {
  option: [1, '<select multiple="multiple">', '</select>'],
  optgroup: [1, '<select multiple="multiple">', '</select>'],
  legend: [1, '<fieldset>', '</fieldset>'],
  thead: [1, '<table>', '</table>'],
  tbody: [1, '<table>', '</table>'],
  tfoot: [1, '<table>', '</table>'],
  colgroup: [1, '<table>', '</table>'],
  caption: [1, '<table>', '</table>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  _default: [0, '', '']
};

/**
 * Parse `html` and return the children.
 *
 * @param {String} html
 * @return {Array}
 * @api private
 */

function parse(html) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) throw new Error('No elements were generated.');
  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = document.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = document.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  var els = el.children;
  if (1 == els.length) {
    return el.removeChild(els[0]);
  }

  var fragment = document.createDocumentFragment();
  while (els.length) {
    fragment.appendChild(el.removeChild(els[0]));
  }

  return fragment;
}

});
require.register("component-indexof/index.js", function(exports, require, module){
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
});
require.register("component-emitter/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = index(callbacks, fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});
require.register("component-format-parser/index.js", function(exports, require, module){

/**
 * Parse the given format `str`.
 *
 * @param {String} str
 * @return {Array}
 * @api public
 */

module.exports = function(str){
	return str.split(/ *\| */).map(function(call){
		var parts = call.split(':');
		var name = parts.shift();
		var args = parseArgs(parts.join(':'));

		return {
			name: name,
			args: args
		};
	});
};

/**
 * Parse args `str`.
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

function parseArgs(str) {
	var args = [];
	var re = /"([^"]*)"|'([^']*)'|([^ \t,]+)/g;
	var m;
	
	while (m = re.exec(str)) {
		args.push(m[2] || m[1] || m[0]);
	}
	
	return args;
}

});
require.register("component-props/index.js", function(exports, require, module){

/**
 * Return immediate identifiers parsed from `str`.
 *
 * @param {String} str
 * @return {Array}
 * @api public
 */

module.exports = function(str, prefix){
  var p = unique(props(str));
  if (prefix) return prefixed(str, p, prefix);
  return p;
};

/**
 * Return immediate identifiers in `str`.
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

function props(str) {
  return str
    .replace(/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\//g, '')
    .match(/[a-zA-Z_]\w*/g)
    || [];
}

/**
 * Return `str` with `props` prefixed with `prefix`.
 *
 * @param {String} str
 * @param {Array} props
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function prefixed(str, props, prefix) {
  var re = /\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g;
  return str.replace(re, function(_){
    if ('(' == _[_.length - 1]) return prefix + _;
    if (!~props.indexOf(_)) return _;
    return prefix + _;
  });
}

/**
 * Return unique array.
 *
 * @param {Array} arr
 * @return {Array}
 * @api private
 */

function unique(arr) {
  var ret = [];

  for (var i = 0; i < arr.length; i++) {
    if (~ret.indexOf(arr[i])) continue;
    ret.push(arr[i]);
  }

  return ret;
}

});
require.register("visionmedia-debug/index.js", function(exports, require, module){
if ('undefined' == typeof window) {
  module.exports = require('./lib/debug');
} else {
  module.exports = require('./debug');
}

});
require.register("visionmedia-debug/debug.js", function(exports, require, module){

/**
 * Expose `debug()` as the module.
 */

module.exports = debug;

/**
 * Create a debugger with the given `name`.
 *
 * @param {String} name
 * @return {Type}
 * @api public
 */

function debug(name) {
  if (!debug.enabled(name)) return function(){};

  return function(fmt){
    fmt = coerce(fmt);

    var curr = new Date;
    var ms = curr - (debug[name] || curr);
    debug[name] = curr;

    fmt = name
      + ' '
      + fmt
      + ' +' + debug.humanize(ms);

    // This hackery is required for IE8
    // where `console.log` doesn't have 'apply'
    window.console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }
}

/**
 * The currently active debug mode names.
 */

debug.names = [];
debug.skips = [];

/**
 * Enables a debug mode by name. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} name
 * @api public
 */

debug.enable = function(name) {
  try {
    localStorage.debug = name;
  } catch(e){}

  var split = (name || '').split(/[\s,]+/)
    , len = split.length;

  for (var i = 0; i < len; i++) {
    name = split[i].replace('*', '.*?');
    if (name[0] === '-') {
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
    }
    else {
      debug.names.push(new RegExp('^' + name + '$'));
    }
  }
};

/**
 * Disable debug output.
 *
 * @api public
 */

debug.disable = function(){
  debug.enable('');
};

/**
 * Humanize the given `ms`.
 *
 * @param {Number} m
 * @return {String}
 * @api private
 */

debug.humanize = function(ms) {
  var sec = 1000
    , min = 60 * 1000
    , hour = 60 * min;

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
  if (ms >= min) return (ms / min).toFixed(1) + 'm';
  if (ms >= sec) return (ms / sec | 0) + 's';
  return ms + 'ms';
};

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

debug.enabled = function(name) {
  for (var i = 0, len = debug.skips.length; i < len; i++) {
    if (debug.skips[i].test(name)) {
      return false;
    }
  }
  for (var i = 0, len = debug.names.length; i < len; i++) {
    if (debug.names[i].test(name)) {
      return true;
    }
  }
  return false;
};

/**
 * Coerce `val`.
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

// persist

try {
  if (window.localStorage) debug.enable(localStorage.debug);
} catch(e){}

});
require.register("component-event/index.js", function(exports, require, module){

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  if (el.addEventListener) {
    el.addEventListener(type, fn, capture);
  } else {
    el.attachEvent('on' + type, fn);
  }
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  if (el.removeEventListener) {
    el.removeEventListener(type, fn, capture);
  } else {
    el.detachEvent('on' + type, fn);
  }
  return fn;
};

});
require.register("component-classes/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Whitespace regexp.
 */

var re = /\s+/;

/**
 * toString reference.
 */

var toString = Object.prototype.toString;

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

module.exports = function(el){
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  this.el = el;
  this.list = el.classList;
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function(name){
  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (!~i) arr.push(name);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove class `name` when present, or
 * pass a regular expression to remove
 * any which match.
 *
 * @param {String|RegExp} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function(name){
  if ('[object RegExp]' == toString.call(name)) {
    return this.removeMatching(name);
  }

  // classList
  if (this.list) {
    this.list.remove(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (~i) arr.splice(i, 1);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove all classes matching `re`.
 *
 * @param {RegExp} re
 * @return {ClassList}
 * @api private
 */

ClassList.prototype.removeMatching = function(re){
  var arr = this.array();
  for (var i = 0; i < arr.length; i++) {
    if (re.test(arr[i])) {
      this.remove(arr[i]);
    }
  }
  return this;
};

/**
 * Toggle class `name`.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function(name){
  // classList
  if (this.list) {
    this.list.toggle(name);
    return this;
  }

  // fallback
  if (this.has(name)) {
    this.remove(name);
  } else {
    this.add(name);
  }
  return this;
};

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function(){
  var arr = this.el.className.split(re);
  if ('' === arr[0]) arr.pop();
  return arr;
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has =
ClassList.prototype.contains = function(name){
  return this.list
    ? this.list.contains(name)
    : !! ~index(this.array(), name);
};

});
require.register("component-query/index.js", function(exports, require, module){

function one(selector, el) {
  return el.querySelector(selector);
}

exports = module.exports = function(selector, el){
  el = el || document;
  return one(selector, el);
};

exports.all = function(selector, el){
  el = el || document;
  return el.querySelectorAll(selector);
};

exports.engine = function(obj){
  if (!obj.one) throw new Error('.one callback required');
  if (!obj.all) throw new Error('.all callback required');
  one = obj.one;
  exports.all = obj.all;
};

});
require.register("component-reactive/lib/index.js", function(exports, require, module){
/**
 * Module dependencies.
 */

var adapter = require('./adapter');
var AttrBinding = require('./attr-binding');
var TextBinding = require('./text-binding');
var debug = require('debug')('reactive');
var bindings = require('./bindings');
var Binding = require('./binding');
var utils = require('./utils');
var query = require('query');

/**
 * Expose `Reactive`.
 */

exports = module.exports = Reactive;

/**
 * Bindings.
 */

exports.bindings = {};

/**
 * Define subscription function.
 *
 * @param {Function} fn
 * @api public
 */

exports.subscribe = function(fn){
  adapter.subscribe = fn;
};

/**
 * Define unsubscribe function.
 *
 * @param {Function} fn
 * @api public
 */

exports.unsubscribe = function(fn){
  adapter.unsubscribe = fn;
};

/**
 * Define a get function.
 *
 * @param {Function} fn
 * @api public
 */

exports.get = function(fn) {
  adapter.get = fn;
};

/**
 * Define a set function.
 *
 * @param {Function} fn
 * @api public
 */

exports.set = function(fn) {
  adapter.set = fn;
};

/**
 * Expose adapter
 */

exports.adapter = adapter;

/**
 * Define binding `name` with callback `fn(el, val)`.
 *
 * @param {String} name or object
 * @param {String|Object} name
 * @param {Function} fn
 * @api public
 */

exports.bind = function(name, fn){
  if ('object' == typeof name) {
    for (var key in name) {
      exports.bind(key, name[key]);
    }
    return;
  }

  exports.bindings[name] = fn;
};

/**
 * Initialize a reactive template for `el` and `obj`.
 *
 * @param {Element} el
 * @param {Element} obj
 * @param {Object} options
 * @api public
 */

function Reactive(el, obj, options) {
  if (!(this instanceof Reactive)) return new Reactive(el, obj, options);
  this.el = el;
  this.obj = obj;
  this.els = [];
  this.fns = options || {}; // TODO: rename, this is awful
  this.bindAll();
  this.bindInterpolation(this.el, []);
}

/**
 * Subscribe to changes on `prop`.
 *
 * @param {String} prop
 * @param {Function} fn
 * @return {Reactive}
 * @api private
 */

Reactive.prototype.sub = function(prop, fn){
  adapter.subscribe(this.obj, prop, fn);
  return this;
};

/**
 * Unsubscribe to changes from `prop`.
 *
 * @param {String} prop
 * @param {Function} fn
 * @return {Reactive}
 * @api private
 */

Reactive.prototype.unsub = function(prop, fn){
  adapter.unsubscribe(this.obj, prop, fn);
  return this;
};

/**
 * Get a `prop`
 *
 * @param {String} prop
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

Reactive.prototype.get = function(prop) {
  return adapter.get(this.obj, prop);
};

/**
 * Set a `prop`
 *
 * @param {String} prop
 * @param {Mixed} val
 * @return {Reactive}
 * @api private
 */

Reactive.prototype.set = function(prop, val) {
  adapter.set(this.obj, prop, val);
  return this;
};

/**
 * Traverse and bind all interpolation within attributes and text.
 *
 * @param {Element} el
 * @api private
 */

Reactive.prototype.bindInterpolation = function(el, els){

  // element
  if (el.nodeType == 1) {
    for (var i = 0; i < el.attributes.length; i++) {
      var attr = el.attributes[i];
      if (utils.hasInterpolation(attr.value)) {
        new AttrBinding(this, el, attr);
      }
    }
  }

  // text node
  if (el.nodeType == 3) {
    if (utils.hasInterpolation(el.data)) {
      debug('bind text "%s"', el.data);
      new TextBinding(this, el);
    }
  }

  // walk nodes
  for (var i = 0; i < el.childNodes.length; i++) {
    var node = el.childNodes[i];
    this.bindInterpolation(node, els);
  }
};

/**
 * Apply all bindings.
 *
 * @api private
 */

Reactive.prototype.bindAll = function() {
  for (var name in exports.bindings) {
    this.bind(name, exports.bindings[name]);
  }
};

/**
 * Bind `name` to `fn`.
 *
 * @param {String|Object} name or object
 * @param {Function} fn
 * @api public
 */

Reactive.prototype.bind = function(name, fn) {
  if ('object' == typeof name) {
    for (var key in name) {
      this.bind(key, name[key]);
    }
    return;
  }

  var obj = this.obj;
  var els = query.all('[' + name + ']', this.el);
  if (!els.length) return;

  debug('bind [%s] (%d elements)', name, els.length);
  for (var i = 0; i < els.length; i++) {
    var binding = new Binding(name, this, els[i], fn);
    binding.bind();
  }
};

// bundled bindings

bindings(exports.bind);

});
require.register("component-reactive/lib/utils.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var debug = require('debug')('reactive:utils');
var props = require('props');
var adapter = require('./adapter');

/**
 * Function cache.
 */

var cache = {};

/**
 * Return interpolation property names in `str`,
 * for example "{foo} and {bar}" would return
 * ['foo', 'bar'].
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

exports.interpolationProps = function(str) {
  var m;
  var arr = [];
  var re = /\{([^}]+)\}/g;

  while (m = re.exec(str)) {
    var expr = m[1];
    arr = arr.concat(props(expr));
  }

  return unique(arr);
};

/**
 * Interpolate `str` with the given `fn`.
 *
 * @param {String} str
 * @param {Function} fn
 * @return {String}
 * @api private
 */

exports.interpolate = function(str, fn){
  return str.replace(/\{([^}]+)\}/g, function(_, expr){
    var cb = cache[expr];
    if (!cb) cb = cache[expr] = compile(expr);
    return fn(expr.trim(), cb);
  });
};

/**
 * Check if `str` has interpolation.
 *
 * @param {String} str
 * @return {Boolean}
 * @api private
 */

exports.hasInterpolation = function(str) {
  return ~str.indexOf('{');
};

/**
 * Remove computed properties notation from `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.clean = function(str) {
  return str.split('<')[0].trim();
};

/**
 * Call `prop` on `model` or `view`.
 *
 * @param {Object} model
 * @param {Object} view
 * @param {String} prop
 * @return {Mixed}
 * @api private
 */

exports.call = function(model, view, prop){
  // view method
  if ('function' == typeof view[prop]) {
    return view[prop]();
  }

  // view value
  if (view.hasOwnProperty(prop)) {
    return view[prop];
  }

  // get property from model
  return adapter.get(model, prop);
};

/**
 * Compile `expr` to a `Function`.
 *
 * @param {String} expr
 * @return {Function}
 * @api private
 */

function compile(expr) {
  // TODO: use props() callback instead
  var re = /\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g;
  var p = props(expr);

  var body = expr.replace(re, function(_) {
    if ('(' == _[_.length - 1]) return access(_);
    if (!~p.indexOf(_)) return _;
    return call(_);
  });

  debug('compile `%s`', body);
  return new Function('model', 'view', 'call', 'return ' + body);
}

/**
 * Access a method `prop` with dot notation.
 *
 * @param {String} prop
 * @return {String}
 * @api private
 */

function access(prop) {
  return 'model.' + prop;
}

/**
 * Call `prop` on view, model, or access the model's property.
 *
 * @param {String} prop
 * @return {String}
 * @api private
 */

function call(prop) {
  return 'call(model, view, "' + prop + '")';
}

/**
 * Return unique array.
 *
 * @param {Array} arr
 * @return {Array}
 * @api private
 */

function unique(arr) {
  var ret = [];

  for (var i = 0; i < arr.length; i++) {
    if (~ret.indexOf(arr[i])) continue;
    ret.push(arr[i]);
  }

  return ret;
}

});
require.register("component-reactive/lib/text-binding.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var debug = require('debug')('reactive:text-binding');
var utils = require('./utils');

/**
 * Expose `TextBinding`.
 */

module.exports = TextBinding;

/**
 * Initialize a new text binding.
 *
 * @param {Reactive} view
 * @param {Element} node
 * @param {Attribute} attr
 * @api private
 */

function TextBinding(view, node) {
  var self = this;
  this.view = view;
  this.text = node.data;
  this.node = node;
  this.props = utils.interpolationProps(this.text);
  this.subscribe();
  this.render();
}

/**
 * Subscribe to changes.
 */

TextBinding.prototype.subscribe = function(){
  var self = this;
  var view = this.view;
  this.props.forEach(function(prop){
    view.sub(prop, function(){
      self.render();
    });
  });
};

/**
 * Render text.
 */

TextBinding.prototype.render = function(){
  var node = this.node;
  var text = this.text;
  var view = this.view;
  var obj = view.obj;

  // TODO: delegate most of this to `Reactive`
  debug('render "%s"', text);
  node.data = utils.interpolate(text, function(prop, fn){
    if (fn) {
      return fn(obj, view.fns, utils.call);
    } else {
      return view.get(obj, prop);
    }
  });
};

});
require.register("component-reactive/lib/attr-binding.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var debug = require('debug')('reactive:attr-binding');
var utils = require('./utils');

/**
 * Expose `AttrBinding`.
 */

module.exports = AttrBinding;

/**
 * Initialize a new attribute binding.
 *
 * @param {Reactive} view
 * @param {Element} node
 * @param {Attribute} attr
 * @api private
 */

function AttrBinding(view, node, attr) {
  var self = this;
  this.view = view;
  this.node = node;
  this.attr = attr;
  this.text = attr.value;
  this.props = utils.interpolationProps(this.text);
  this.subscribe();
  this.render();
}

/**
 * Subscribe to changes.
 */

AttrBinding.prototype.subscribe = function(){
  var self = this;
  var view = this.view;
  this.props.forEach(function(prop){
    view.sub(prop, function(){
      self.render();
    });
  });
};

/**
 * Render the value.
 */

AttrBinding.prototype.render = function(){
  var attr = this.attr;
  var text = this.text;
  var view = this.view;
  var obj = view.obj;

  // TODO: delegate most of this to `Reactive`
  debug('render %s "%s"', attr.name, text);
  attr.value = utils.interpolate(text, function(prop, fn){
    if (fn) {
      return fn(obj, view.fns, utils.call);
    } else {
      return view.get(obj, prop);
    }
  });
};

});
require.register("component-reactive/lib/binding.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var parse = require('format-parser');

/**
 * Expose `Binding`.
 */

module.exports = Binding;

/**
 * Initialize a binding.
 *
 * @api private
 */

function Binding(name, view, el, fn) {
  this.name = name;
  this.view = view;
  this.obj = view.obj;
  this.fns = view.fns;
  this.el = el;
  this.fn = fn;
}

/**
 * Apply the binding.
 *
 * @api private
 */

Binding.prototype.bind = function() {
  var val = this.el.getAttribute(this.name);
  this.fn(this.el, val, this.obj);
};

/**
 * Perform interpolation on `name`.
 *
 * @param {String} name
 * @return {String}
 * @api public
 */

Binding.prototype.interpolate = function(name) {
  var self = this;
  name = clean(name);

  if (~name.indexOf('{')) {
    return name.replace(/{([^}]+)}/g, function(_, name){
      return self.value(name);
    });
  }

  return this.formatted(name);
};

/**
 * Return value for property `name`.
 *
 *  - check if the "view" has a `name` method
 *  - check if the "model" has a `name` method
 *  - check if the "model" has a `name` property
 *
 * @param {String} name
 * @return {Mixed}
 * @api public
 */

Binding.prototype.value = function(name) {
  var self = this;
  var obj = this.obj;
  var view = this.view;
  var fns = view.fns;
  name = clean(name);

  // view method
  if ('function' == typeof fns[name]) {
    return fns[name]();
  }

  // view value
  if (fns.hasOwnProperty(name)) {
    return fns[name];
  }

  return view.get(name);
};

/**
 * Return formatted property.
 *
 * @param {String} fmt
 * @return {Mixed}
 * @api public
 */

Binding.prototype.formatted = function(fmt) {
  var calls = parse(clean(fmt));
  var name = calls[0].name;
  var val = this.value(name);

  for (var i = 1; i < calls.length; ++i) {
    var call = calls[i];
    call.args.unshift(val);
    var fn = this.fns[call.name];
    val = fn.apply(this.fns, call.args);
  }

  return val;
};

/**
 * Invoke `fn` on changes.
 *
 * @param {Function} fn
 * @api public
 */

Binding.prototype.change = function(fn) {
  fn.call(this);

  var self = this;
  var view = this.view;
  var val = this.el.getAttribute(this.name);

  // computed props
  var parts = val.split('<');
  val = parts[0];
  var computed = parts[1];
  if (computed) computed = computed.trim().split(/\s+/);

  // interpolation
  if (hasInterpolation(val)) {
    var props = interpolationProps(val);
    props.forEach(function(prop){
      view.sub(prop, fn.bind(self));
    });
    return;
  }

  // formatting
  var calls = parse(val);
  var prop = calls[0].name;

  // computed props
  if (computed) {
    computed.forEach(function(prop){
      view.sub(prop, fn.bind(self));
    });
    return;
  }

  // bind to prop
  view.sub(prop, fn.bind(this));
};

/**
 * Return interpolation property names in `str`,
 * for example "{foo} and {bar}" would return
 * ['foo', 'bar'].
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

function interpolationProps(str) {
  var m;
  var arr = [];
  var re = /\{([^}]+)\}/g;
  while (m = re.exec(str)) {
    arr.push(m[1]);
  }
  return arr;
}

/**
 * Check if `str` has interpolation.
 *
 * @param {String} str
 * @return {Boolean}
 * @api private
 */

function hasInterpolation(str) {
  return ~str.indexOf('{');
}

/**
 * Remove computed properties notation from `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function clean(str) {
  return str.split('<')[0].trim();
}

});
require.register("component-reactive/lib/bindings.js", function(exports, require, module){
/**
 * Module dependencies.
 */

var classes = require('classes');
var event = require('event');

/**
 * Attributes supported.
 */

var attrs = [
  'id',
  'src',
  'rel',
  'cols',
  'rows',
  'name',
  'href',
  'title',
  'class',
  'style',
  'width',
  'value',
  'height',
  'tabindex',
  'placeholder'
];

/**
 * Events supported.
 */

var events = [
  'change',
  'click',
  'dblclick',
  'mousedown',
  'mouseup',
  'blur',
  'focus',
  'input',
  'submit',
  'keydown',
  'keypress',
  'keyup'
];

/**
 * Apply bindings.
 */

module.exports = function(bind){

  /**
   * Generate attribute bindings.
   */

  attrs.forEach(function(attr){
    bind('data-' + attr, function(el, name, obj){
      this.change(function(){
        el.setAttribute(attr, this.interpolate(name));
      });
    });
  });

/**
 * Append child element.
 */

  bind('data-append', function(el, name){
    var other = this.value(name);
    el.appendChild(other);
  });

/**
 * Replace element.
 */

  bind('data-replace', function(el, name){
    var other = this.value(name);
    el.parentNode.replaceChild(other, el);
  });

  /**
   * Show binding.
   */

  bind('data-show', function(el, name){
    this.change(function(){
      if (this.value(name)) {
        classes(el).add('show').remove('hide');
      } else {
        classes(el).remove('show').add('hide');
      }
    });
  });

  /**
   * Hide binding.
   */

  bind('data-hide', function(el, name){
    this.change(function(){
      if (this.value(name)) {
        classes(el).remove('show').add('hide');
      } else {
        classes(el).add('show').remove('hide');
      }
    });
  });

  /**
   * Checked binding.
   */

  bind('data-checked', function(el, name){
    this.change(function(){
      if (this.value(name)) {
        el.setAttribute('checked', 'checked');
      } else {
        el.removeAttribute('checked');
      }
    });
  });

  /**
   * Text binding.
   */

  bind('data-text', function(el, name){
    this.change(function(){
      el.textContent = this.interpolate(name);
    });
  });

  /**
   * HTML binding.
   */

  bind('data-html', function(el, name){
    this.change(function(){
      el.innerHTML = this.formatted(name);
    });
  });

  /**
   * Generate event bindings.
   */

  events.forEach(function(name){
    bind('on-' + name, function(el, method){
      var fns = this.view.fns
      event.bind(el, name, function(e){
        var fn = fns[method];
        if (!fn) throw new Error('method .' + method + '() missing');
        fns[method](e);
      });
    });
  });
};

});
require.register("component-reactive/lib/adapter.js", function(exports, require, module){
/**
 * Default subscription method.
 * Subscribe to changes on the model.
 *
 * @param {Object} obj
 * @param {String} prop
 * @param {Function} fn
 */

exports.subscribe = function(obj, prop, fn) {
  if (!obj.on) return;
  obj.on('change ' + prop, fn);
};

/**
 * Default unsubscription method.
 * Unsubscribe from changes on the model.
 */

exports.unsubscribe = function(obj, prop, fn) {
  if (!obj.off) return;
  obj.off('change ' + prop, fn);
};

/**
 * Default setter method.
 * Set a property on the model.
 *
 * @param {Object} obj
 * @param {String} prop
 * @param {Mixed} val
 */

exports.set = function(obj, prop, val) {
  if ('function' == typeof obj[prop]) {
    obj[prop](val);
  } else {
    obj[prop] = val;
  }
};

/**
 * Default getter method.
 * Get a property from the model.
 *
 * @param {Object} obj
 * @param {String} prop
 * @return {Mixed}
 */

exports.get = function(obj, prop) {
  if ('function' == typeof obj[prop]) {
    return obj[prop]();
  } else {
    return obj[prop];
  }
};

});
require.register("RedVentures-reduce/index.js", function(exports, require, module){

/**
 * Reduce `arr` with `fn`.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @param {Mixed} initial
 *
 * TODO: combatible error handling?
 */

module.exports = function(arr, fn, initial){  
  var idx = 0;
  var len = arr.length;
  var curr = arguments.length == 3
    ? initial
    : arr[idx++];

  while (idx < len) {
    curr = fn.call(null, curr, arr[idx], ++idx, arr);
  }
  
  return curr;
};
});
require.register("visionmedia-superagent/lib/client.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var Emitter = require('emitter');
var reduce = require('reduce');

/**
 * Root reference for iframes.
 */

var root = 'undefined' == typeof window
  ? this
  : window;

/**
 * Noop.
 */

function noop(){};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * TODO: future proof, move to compoent land
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isHost(obj) {
  var str = {}.toString.call(obj);

  switch (str) {
    case '[object File]':
    case '[object Blob]':
    case '[object FormData]':
      return true;
    default:
      return false;
  }
}

/**
 * Determine XHR.
 */

function getXHR() {
  if (root.XMLHttpRequest
    && ('file:' != root.location.protocol || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
}

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return obj === Object(obj);
}

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    pairs.push(encodeURIComponent(key)
      + '=' + encodeURIComponent(obj[key]));
  }
  return pairs.join('&');
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var parts;
  var pair;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    parts = pair.split('=');
    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function type(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function params(str){
  return reduce(str.split(/ *; */), function(obj, str){
    var parts = str.split(/ *= */)
      , key = parts.shift()
      , val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req, options) {
  options = options || {};
  this.req = req;
  this.xhr = this.req.xhr;
  this.text = this.xhr.responseText;
  this.setStatusProperties(this.xhr.status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this.setHeaderProperties(this.header);
  this.body = this.parseBody(this.text);
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

Response.prototype.get = function(field){
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

Response.prototype.setHeaderProperties = function(header){
  // content-type
  var ct = this.header['content-type'] || '';
  this.type = type(ct);

  // params
  var obj = params(ct);
  for (var key in obj) this[key] = obj[key];
};

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype.parseBody = function(str){
  var parse = request.parse[this.type];
  return parse
    ? parse(str)
    : null;
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

Response.prototype.setStatusProperties = function(status){
  var type = status / 100 | 0;

  // status / class
  this.status = status;
  this.statusType = type;

  // basics
  this.info = 1 == type;
  this.ok = 2 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = (4 == type || 5 == type)
    ? this.toError()
    : false;

  // sugar
  this.accepted = 202 == status;
  this.noContent = 204 == status || 1223 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.notFound = 404 == status;
  this.forbidden = 403 == status;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var path = req.path;

  var msg = 'cannot ' + method + ' ' + path + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.path = path;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  Emitter.call(this);
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {};
  this._header = {};
  this.on('end', function(){
    var res = new Response(self);
    if ('HEAD' == method) res.text = null;
    self.callback(null, res);
  });
}

/**
 * Inherit from `Emitter.prototype`.
 */

Request.prototype = new Emitter;
Request.prototype.constructor = Request;

/**
 * Set timeout to `ms`.
 *
 * @param {Number} ms
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.timeout = function(ms){
  this._timeout = ms;
  return this;
};

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.clearTimeout = function(){
  this._timeout = 0;
  clearTimeout(this._timer);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */

Request.prototype.abort = function(){
  if (this.aborted) return;
  this.aborted = true;
  this.xhr.abort();
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Set header `field` to `val`, or multiple fields with one object.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Get case-insensitive header `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api private
 */

Request.prototype.getHeader = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} pass
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass){
  var str = btoa(user + ':' + pass);
  this.set('Authorization', 'Basic ' + str);
  return this;
};

/**
* Add query-string `val`.
*
* Examples:
*
*   request.get('/shoes')
*     .query('size=10')
*     .query({ color: 'blue' })
*
* @param {Object|String} val
* @return {Request} for chaining
* @api public
*/

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Send `data`, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // querystring
 *       request.get('/search')
 *         .end(callback)
 *
 *       // multiple data "writes"
 *       request.get('/search')
 *         .send({ search: 'query' })
 *         .send({ range: '1..5' })
 *         .send({ order: 'desc' })
 *         .end(callback)
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"})
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
  *      request.post('/user')
  *        .send('name=tobi')
  *        .send('species=ferret')
  *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.send = function(data){
  var obj = isObject(data);
  var type = this.getHeader('Content-Type');

  // merge
  if (obj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    if (!type) this.type('form');
    type = this.getHeader('Content-Type');
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!obj) return this;
  if (!type) this.type('json');
  return this;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  var fn = this._callback;
  if (2 == fn.length) return fn(err, res);
  if (err) return this.emit('error', err);
  fn(res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Origin is not allowed by Access-Control-Allow-Origin');
  err.crossDomain = true;
  this.callback(err);
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

Request.prototype.timeoutError = function(){
  var timeout = this._timeout;
  var err = new Error('timeout of ' + timeout + 'ms exceeded');
  err.timeout = timeout;
  this.callback(err);
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

Request.prototype.withCredentials = function(){
  this._withCredentials = true;
  return this;
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  var self = this;
  var xhr = this.xhr = getXHR();
  var query = this._query.join('&');
  var timeout = this._timeout;
  var data = this._data;

  // store callback
  this._callback = fn || noop;

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // state change
  xhr.onreadystatechange = function(){
    if (4 != xhr.readyState) return;
    if (0 == xhr.status) {
      if (self.aborted) return self.timeoutError();
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  if (xhr.upload) {
    xhr.upload.onprogress = function(e){
      e.percent = e.loaded / e.total * 100;
      self.emit('progress', e);
    };
  }

  // timeout
  if (timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self.abort();
    }, timeout);
  }

  // querystring
  if (query) {
    query = request.serializeObject(query);
    this.url += ~this.url.indexOf('?')
      ? '&' + query
      : '?' + query;
  }

  // initiate request
  xhr.open(this.method, this.url, true);

  // body
  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
    // serialize stuff
    var serialize = request.serialize[this.getHeader('Content-Type')];
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
    xhr.setRequestHeader(field, this.header[field]);
  }

  // send stuff
  xhr.send(data);
  return this;
};

/**
 * Expose `Request`.
 */

request.Request = Request;

/**
 * Issue a request:
 *
 * Examples:
 *
 *    request('GET', '/users').end(callback)
 *    request('/users').end(callback)
 *    request('/users', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

function request(method, url) {
  // callback
  if ('function' == typeof url) {
    return new Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new Request('GET', method);
  }

  return new Request(method, url);
}

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.del = function(url, fn){
  var req = request('DELETE', url);
  if (fn) req.end(fn);
  return req;
};

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} data
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} data or fn
 * @param {Function} fn
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * Expose `request`.
 */

module.exports = request;

});
require.register("socket.io/index.js", function(exports, require, module){
(function(){function require(p,parent,orig){var path=require.resolve(p),mod=require.modules[path];if(null==path){orig=orig||p;parent=parent||"root";throw new Error('failed to require "'+orig+'" from "'+parent+'"')}if(!mod.exports){mod.exports={};mod.client=mod.component=true;mod.call(this,mod,mod.exports,require.relative(path))}return mod.exports}require.modules={};require.aliases={};require.resolve=function(path){var orig=path,reg=path+".js",regJSON=path+".json",index=path+"/index.js",indexJSON=path+"/index.json";return require.modules[reg]&&reg||require.modules[regJSON]&&regJSON||require.modules[index]&&index||require.modules[indexJSON]&&indexJSON||require.modules[orig]&&orig||require.aliases[index]};require.normalize=function(curr,path){var segs=[];if("."!=path.charAt(0))return path;curr=curr.split("/");path=path.split("/");for(var i=0;i<path.length;++i){if(".."==path[i]){curr.pop()}else if("."!=path[i]&&""!=path[i]){segs.push(path[i])}}return curr.concat(segs).join("/")};require.register=function(path,fn){require.modules[path]=fn};require.alias=function(from,to){var fn=require.modules[from];if(!fn)throw new Error('failed to alias "'+from+'", it does not exist');require.aliases[to]=from};require.relative=function(parent){var p=require.normalize(parent,"..");function lastIndexOf(arr,obj){var i=arr.length;while(i--){if(arr[i]===obj)return i}return-1}function fn(path){var orig=path;path=fn.resolve(path);return require(path,parent,orig)}fn.resolve=function(path){if("."!=path.charAt(0)){var segs=parent.split("/");var i=lastIndexOf(segs,"deps")+1;if(!i)i=0;path=segs.slice(0,i+1).join("/")+"/deps/"+path;return path}return require.normalize(p,path)};fn.exists=function(path){return!!require.modules[fn.resolve(path)]};return fn};require.register("learnboost-engine.io-client/lib/index.js",function(module,exports,require){module.exports=require("./socket")});require.register("learnboost-engine.io-client/lib/parser.js",function(module,exports,require){var util=require("./util");var packets=exports.packets={open:0,close:1,ping:2,pong:3,message:4,upgrade:5,noop:6};var packetslist=util.keys(packets);var err={type:"error",data:"parser error"};exports.encodePacket=function(packet){var encoded=packets[packet.type];if(undefined!==packet.data){encoded+=String(packet.data)}return""+encoded};exports.decodePacket=function(data){var type=data.charAt(0);if(Number(type)!=type||!packetslist[type]){return err}if(data.length>1){return{type:packetslist[type],data:data.substring(1)}}else{return{type:packetslist[type]}}};exports.encodePayload=function(packets){if(!packets.length){return"0:"}var encoded="",message;for(var i=0,l=packets.length;i<l;i++){message=exports.encodePacket(packets[i]);encoded+=message.length+":"+message}return encoded};exports.decodePayload=function(data){if(data==""){return[err]}var packets=[],length="",n,msg,packet;for(var i=0,l=data.length;i<l;i++){var chr=data.charAt(i);if(":"!=chr){length+=chr}else{if(""==length||length!=(n=Number(length))){return[err]}msg=data.substr(i+1,n);if(length!=msg.length){return[err]}if(msg.length){packet=exports.decodePacket(msg);if(err.type==packet.type&&err.data==packet.data){return[err]}packets.push(packet)}i+=n;length=""}}if(length!=""){return[err]}return packets}});require.register("learnboost-engine.io-client/lib/socket.js",function(module,exports,require){var util=require("./util"),transports=require("./transports"),Emitter=require("./emitter"),debug=require("debug")("engine-client:socket");module.exports=Socket;var global="undefined"!=typeof window?window:global;function Socket(opts){if(!(this instanceof Socket))return new Socket(opts);if("string"==typeof opts){var uri=util.parseUri(opts);opts=arguments[1]||{};opts.host=uri.host;opts.secure=uri.protocol=="https"||uri.protocol=="wss";opts.port=uri.port}opts=opts||{};this.secure=null!=opts.secure?opts.secure:global.location&&"https:"==location.protocol;this.host=opts.host||opts.hostname||(global.location?location.hostname:"localhost");this.port=opts.port||(global.location&&location.port?location.port:this.secure?443:80);this.query=opts.query||{};this.query.uid=rnd();this.upgrade=false!==opts.upgrade;this.resource=opts.resource||"default";this.path=(opts.path||"/engine.io").replace(/\/$/,"");this.path+="/"+this.resource+"/";this.forceJSONP=!!opts.forceJSONP;this.timestampParam=opts.timestampParam||"t";this.timestampRequests=!!opts.timestampRequests;this.flashPath=opts.flashPath||"";this.transports=opts.transports||["polling","websocket","flashsocket"];this.readyState="";this.writeBuffer=[];this.policyPort=opts.policyPort||843;this.open();Socket.sockets.push(this);Socket.sockets.evs.emit("add",this)}Emitter(Socket.prototype);Socket.protocol=1;Socket.sockets=[];Socket.sockets.evs=new Emitter;Socket.Socket=Socket;Socket.Transport=require("./transport");Socket.Emitter=require("./emitter");Socket.transports=require("./transports");Socket.util=require("./util");Socket.parser=require("./parser");Socket.prototype.createTransport=function(name){debug('creating transport "%s"',name);var query=clone(this.query);query.transport=name;if(this.id){query.sid=this.id}var transport=new transports[name]({host:this.host,port:this.port,secure:this.secure,path:this.path,query:query,forceJSONP:this.forceJSONP,timestampRequests:this.timestampRequests,timestampParam:this.timestampParam,flashPath:this.flashPath,policyPort:this.policyPort});return transport};function clone(obj){var o={};for(var i in obj){if(obj.hasOwnProperty(i)){o[i]=obj[i]}}return o}Socket.prototype.open=function(){this.readyState="opening";var transport=this.createTransport(this.transports[0]);transport.open();this.setTransport(transport)};Socket.prototype.setTransport=function(transport){var self=this;if(this.transport){debug("clearing existing transport");this.transport.removeAllListeners()}this.transport=transport;transport.on("drain",function(){self.flush()}).on("packet",function(packet){self.onPacket(packet)}).on("error",function(e){self.onError(e)}).on("close",function(){self.onClose("transport close")})};Socket.prototype.probe=function(name){debug('probing transport "%s"',name);var transport=this.createTransport(name,{probe:1}),failed=false,self=this;transport.once("open",function(){if(failed)return;debug('probe transport "%s" opened',name);transport.send([{type:"ping",data:"probe"}]);transport.once("packet",function(msg){if(failed)return;if("pong"==msg.type&&"probe"==msg.data){debug('probe transport "%s" pong',name);self.upgrading=true;self.emit("upgrading",transport);debug('pausing current transport "%s"',self.transport.name);self.transport.pause(function(){if(failed)return;if("closed"==self.readyState||"closing"==self.readyState){return}debug("changing transport and sending upgrade packet");transport.removeListener("error",onerror);self.emit("upgrade",transport);self.setTransport(transport);transport.send([{type:"upgrade"}]);transport=null;self.upgrading=false;self.flush()})}else{debug('probe transport "%s" failed',name);var err=new Error("probe error");err.transport=transport.name;self.emit("error",err)}})});transport.once("error",onerror);function onerror(err){if(failed)return;failed=true;var error=new Error("probe error: "+err);error.transport=transport.name;transport.close();transport=null;debug('probe transport "%s" failed because of error: %s',name,err);self.emit("error",error)}transport.open();this.once("close",function(){if(transport){debug("socket closed prematurely - aborting probe");failed=true;transport.close();transport=null}});this.once("upgrading",function(to){if(transport&&to.name!=transport.name){debug('"%s" works - aborting "%s"',to.name,transport.name);transport.close();transport=null}})};Socket.prototype.onOpen=function(){debug("socket open");this.readyState="open";this.emit("open");this.onopen&&this.onopen.call(this);this.flush();if("open"==this.readyState&&this.upgrade&&this.transport.pause){debug("starting upgrade probes");for(var i=0,l=this.upgrades.length;i<l;i++){this.probe(this.upgrades[i])}}};Socket.prototype.onPacket=function(packet){if("opening"==this.readyState||"open"==this.readyState){debug('socket receive: type "%s", data "%s"',packet.type,packet.data);this.emit("packet",packet);this.emit("heartbeat");switch(packet.type){case"open":this.onHandshake(util.parseJSON(packet.data));break;case"pong":this.ping();break;case"error":var err=new Error("server error");err.code=packet.data;this.emit("error",err);break;case"message":this.emit("message",packet.data);var event={data:packet.data};event.toString=function(){return packet.data};this.onmessage&&this.onmessage.call(this,event);break}}else{debug('packet received with socket readyState "%s"',this.readyState)}};Socket.prototype.onHandshake=function(data){this.emit("handshake",data);this.id=data.sid;this.transport.query.sid=data.sid;this.upgrades=data.upgrades;this.pingInterval=data.pingInterval;this.pingTimeout=data.pingTimeout;this.onOpen();this.ping();this.removeListener("heartbeat",this.onHeartbeat);this.on("heartbeat",this.onHeartbeat)};Socket.prototype.onHeartbeat=function(timeout){clearTimeout(this.pingTimeoutTimer);var self=this;self.pingTimeoutTimer=setTimeout(function(){if("closed"==self.readyState)return;self.onClose("ping timeout")},timeout||self.pingInterval+self.pingTimeout)};Socket.prototype.ping=function(){var self=this;clearTimeout(self.pingIntervalTimer);self.pingIntervalTimer=setTimeout(function(){debug("writing ping packet - expecting pong within %sms",self.pingTimeout);self.sendPacket("ping");self.onHeartbeat(self.pingTimeout)},self.pingInterval)};Socket.prototype.flush=function(){if("closed"!=this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){debug("flushing %d packets in socket",this.writeBuffer.length);this.transport.send(this.writeBuffer);this.writeBuffer=[]}};Socket.prototype.write=Socket.prototype.send=function(msg){this.sendPacket("message",msg);return this};Socket.prototype.sendPacket=function(type,data){var packet={type:type,data:data};this.emit("packetCreate",packet);this.writeBuffer.push(packet);this.flush()};Socket.prototype.close=function(){if("opening"==this.readyState||"open"==this.readyState){this.onClose("forced close");debug("socket closing - telling transport to close");this.transport.close();this.transport.removeAllListeners()}return this};Socket.prototype.onError=function(err){this.emit("error",err);this.onClose("transport error",err)};Socket.prototype.onClose=function(reason,desc){if("closed"!=this.readyState){debug('socket close with reason: "%s"',reason);clearTimeout(this.pingIntervalTimer);clearTimeout(this.pingTimeoutTimer);this.readyState="closed";this.emit("close",reason,desc);this.onclose&&this.onclose.call(this);this.id=null}};function rnd(){return String(Math.random()).substr(5)+String(Math.random()).substr(5)}});require.register("learnboost-engine.io-client/lib/transport.js",function(module,exports,require){var util=require("./util"),parser=require("./parser"),Emitter=require("./emitter");module.exports=Transport;function Transport(opts){this.path=opts.path;this.host=opts.host;this.port=opts.port;this.secure=opts.secure;this.query=opts.query;this.timestampParam=opts.timestampParam;this.timestampRequests=opts.timestampRequests;this.readyState=""}Emitter(Transport.prototype);Transport.prototype.onError=function(msg,desc){var err=new Error(msg);err.type="TransportError";err.description=desc;this.emit("error",err);return this};Transport.prototype.open=function(){if("closed"==this.readyState||""==this.readyState){this.readyState="opening";this.doOpen()}return this};Transport.prototype.close=function(){if("opening"==this.readyState||"open"==this.readyState){this.doClose();this.onClose()}return this};Transport.prototype.send=function(packets){if("open"==this.readyState){this.write(packets)}else{throw new Error("Transport not open")}};Transport.prototype.onOpen=function(){this.readyState="open";this.writable=true;this.emit("open")};Transport.prototype.onData=function(data){this.onPacket(parser.decodePacket(data))};Transport.prototype.onPacket=function(packet){this.emit("packet",packet)};Transport.prototype.onClose=function(){this.readyState="closed";this.emit("close")}});require.register("learnboost-engine.io-client/lib/emitter.js",function(module,exports,require){var Emitter;try{Emitter=require("emitter")}catch(e){Emitter=require("emitter-component")}module.exports=Emitter;Emitter.prototype.addEventListener=Emitter.prototype.on;Emitter.prototype.removeEventListener=Emitter.prototype.off;Emitter.prototype.removeListener=Emitter.prototype.off;Emitter.prototype.removeAllListeners=function(){this._callbacks={}}});require.register("learnboost-engine.io-client/lib/util.js",function(module,exports,require){var pageLoaded=false;var global="undefined"!=typeof window?window:global;exports.inherits=function inherits(a,b){function c(){}c.prototype=b.prototype;a.prototype=new c};exports.keys=Object.keys||function(obj){var ret=[];var has=Object.prototype.hasOwnProperty;for(var i in obj){if(has.call(obj,i)){ret.push(i)}}return ret};exports.on=function(element,event,fn,capture){if(element.attachEvent){element.attachEvent("on"+event,fn)}else if(element.addEventListener){element.addEventListener(event,fn,capture)}};exports.load=function(fn){if(global.document&&document.readyState==="complete"||pageLoaded){return fn()}exports.on(global,"load",fn,false)};if("undefined"!=typeof window){exports.load(function(){pageLoaded=true})}exports.defer=function(fn){if(!exports.ua.webkit||"undefined"!=typeof importScripts){return fn()}exports.load(function(){setTimeout(fn,100)})};var rvalidchars=/^[\],:{}\s]*$/,rvalidescape=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rvalidtokens=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rvalidbraces=/(?:^|:|,)(?:\s*\[)+/g,rtrimLeft=/^\s+/,rtrimRight=/\s+$/;exports.parseJSON=function(data){if("string"!=typeof data||!data){return null}data=data.replace(rtrimLeft,"").replace(rtrimRight,"");if(global.JSON&&JSON.parse){return JSON.parse(data)}if(rvalidchars.test(data.replace(rvalidescape,"@").replace(rvalidtokens,"]").replace(rvalidbraces,""))){return new Function("return "+data)()}};exports.ua={};exports.ua.hasCORS="undefined"!=typeof XMLHttpRequest&&function(){try{var a=new XMLHttpRequest}catch(e){return false}return a.withCredentials!=undefined}();exports.ua.webkit="undefined"!=typeof navigator&&/webkit/i.test(navigator.userAgent);exports.ua.gecko="undefined"!=typeof navigator&&/gecko/i.test(navigator.userAgent);exports.ua.android="undefined"!=typeof navigator&&/android/i.test(navigator.userAgent);exports.ua.ios="undefined"!=typeof navigator&&/^(iPad|iPhone|iPod)$/.test(navigator.platform);exports.ua.ios6=exports.ua.ios&&/OS 6_/.test(navigator.userAgent);exports.request=function request(xdomain){if("undefined"!=typeof process){var XMLHttpRequest=require("xmlhttprequest").XMLHttpRequest;return new XMLHttpRequest}if(xdomain&&"undefined"!=typeof XDomainRequest&&!exports.ua.hasCORS){return new XDomainRequest}try{if("undefined"!=typeof XMLHttpRequest&&(!xdomain||exports.ua.hasCORS)){return new XMLHttpRequest}}catch(e){}if(!xdomain){try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}}};var re=/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;var parts=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];exports.parseUri=function(str){var m=re.exec(str||""),uri={},i=14;while(i--){uri[parts[i]]=m[i]||""}return uri};exports.qs=function(obj){var str="";for(var i in obj){if(obj.hasOwnProperty(i)){if(str.length)str+="&";str+=i+"="+encodeURIComponent(obj[i])}}return str}});require.register("learnboost-engine.io-client/lib/transports/index.js",function(module,exports,require){var XHR=require("./polling-xhr"),JSONP=require("./polling-jsonp"),websocket=require("./websocket"),flashsocket=require("./flashsocket"),util=require("../util");exports.polling=polling;exports.websocket=websocket;exports.flashsocket=flashsocket;var global="undefined"!=typeof window?window:global;function polling(opts){var xhr,xd=false,isXProtocol=false;if(global.location){var isSSL="https:"==location.protocol;var port=location.port;if(Number(port)!=port){port=isSSL?443:80}xd=opts.host!=location.hostname||port!=opts.port;isXProtocol=opts.secure!=isSSL}xhr=util.request(xd);if(isXProtocol&&global.XDomainRequest&&xhr instanceof global.XDomainRequest){return new JSONP(opts)}if(xhr&&!opts.forceJSONP){return new XHR(opts)}else{return new JSONP(opts)}}});require.register("learnboost-engine.io-client/lib/transports/polling.js",function(module,exports,require){var Transport=require("../transport"),util=require("../util"),parser=require("../parser"),debug=require("debug")("engine.io-client:polling");module.exports=Polling;var global="undefined"!=typeof window?window:global;function Polling(opts){Transport.call(this,opts)}util.inherits(Polling,Transport);Polling.prototype.name="polling";Polling.prototype.doOpen=function(){this.poll()};Polling.prototype.pause=function(onPause){var pending=0;var self=this;this.readyState="pausing";function pause(){debug("paused");self.readyState="paused";onPause()}if(this.polling||!this.writable){var total=0;if(this.polling){debug("we are currently polling - waiting to pause");total++;this.once("pollComplete",function(){debug("pre-pause polling complete");--total||pause()})}if(!this.writable){debug("we are currently writing - waiting to pause");total++;this.once("drain",function(){debug("pre-pause writing complete");--total||pause()})}}else{pause()}};Polling.prototype.poll=function(){debug("polling");this.polling=true;this.doPoll();this.emit("poll")};Polling.prototype.onData=function(data){debug("polling got data %s",data);var packets=parser.decodePayload(data);for(var i=0,l=packets.length;i<l;i++){if("opening"==this.readyState){this.onOpen()}if("close"==packets[i].type){this.onClose();return}this.onPacket(packets[i])}this.polling=false;this.emit("pollComplete");if("open"==this.readyState){this.poll()}else{debug('ignoring poll - transport state "%s"',this.readyState)}};Polling.prototype.doClose=function(){debug("sending close packet");this.send([{type:"close"}])};Polling.prototype.write=function(packets){var self=this;this.writable=false;this.doWrite(parser.encodePayload(packets),function(){self.writable=true;self.emit("drain")})};Polling.prototype.uri=function(){var query=this.query||{};var schema=this.secure?"https":"http";var port="";if(global.ActiveXObject||util.ua.android||util.ua.ios6||this.timestampRequests){query[this.timestampParam]=+new Date}query=util.qs(query);if(this.port&&("https"==schema&&this.port!=443||"http"==schema&&this.port!=80)){port=":"+this.port}if(query.length){query="?"+query}return schema+"://"+this.host+port+this.path+query}});require.register("learnboost-engine.io-client/lib/transports/polling-xhr.js",function(module,exports,require){var Polling=require("./polling"),util=require("../util"),Emitter=require("../emitter"),debug=require("debug")("engine.io-client:polling-xhr");module.exports=XHR;module.exports.Request=Request;var global="undefined"!=typeof window?window:global;var xobject=global[["Active"].concat("Object").join("X")];function empty(){}function XHR(opts){Polling.call(this,opts);if(global.location){this.xd=opts.host!=global.location.hostname||global.location.port!=opts.port}}util.inherits(XHR,Polling);XHR.prototype.doOpen=function(){var self=this;util.defer(function(){Polling.prototype.doOpen.call(self)})};XHR.prototype.request=function(opts){opts=opts||{};opts.uri=this.uri();opts.xd=this.xd;return new Request(opts)};XHR.prototype.doWrite=function(data,fn){var req=this.request({method:"POST",data:data});var self=this;req.on("success",fn);req.on("error",function(err){self.onError("xhr post error",err)});this.sendXhr=req};XHR.prototype.doPoll=function(){debug("xhr poll");var req=this.request();var self=this;req.on("data",function(data){self.onData(data)});req.on("error",function(err){self.onError("xhr poll error",err)});this.pollXhr=req};function Request(opts){this.method=opts.method||"GET";this.uri=opts.uri;this.xd=!!opts.xd;this.async=false!==opts.async;this.data=undefined!=opts.data?opts.data:null;this.create()}Emitter(Request.prototype);Request.prototype.create=function(){var xhr=this.xhr=util.request(this.xd);var self=this;xhr.open(this.method,this.uri,this.async);if("POST"==this.method){try{if(xhr.setRequestHeader){xhr.setRequestHeader("Content-type","text/plain;charset=UTF-8")}else{xhr.contentType="text/plain"}}catch(e){}}if(this.xd&&global.XDomainRequest&&xhr instanceof XDomainRequest){xhr.onerror=function(e){self.onError(e)};xhr.onload=function(){self.onData(xhr.responseText)};xhr.onprogress=empty}else{if("withCredentials"in xhr){xhr.withCredentials=true}xhr.onreadystatechange=function(){var data;try{if(4!=xhr.readyState)return;if(200==xhr.status||1223==xhr.status){data=xhr.responseText}else{self.onError(xhr.status)}}catch(e){self.onError(e)}if(undefined!==data){self.onData(data)}}}debug("sending xhr with url %s | data %s",this.uri,this.data);xhr.send(this.data);if(xobject){this.index=Request.requestsCount++;Request.requests[this.index]=this}};Request.prototype.onSuccess=function(){this.emit("success");this.cleanup()};Request.prototype.onData=function(data){this.emit("data",data);this.onSuccess()};Request.prototype.onError=function(err){this.emit("error",err);this.cleanup()};Request.prototype.cleanup=function(){this.xhr.onreadystatechange=empty;this.xhr.onload=this.xhr.onerror=empty;try{this.xhr.abort()}catch(e){}if(xobject){delete Request.requests[this.index]}this.xhr=null};Request.prototype.abort=function(){this.cleanup()};if(xobject){Request.requestsCount=0;Request.requests={};global.attachEvent("onunload",function(){for(var i in Request.requests){if(Request.requests.hasOwnProperty(i)){Request.requests[i].abort()}}})}});require.register("learnboost-engine.io-client/lib/transports/polling-jsonp.js",function(module,exports,require){var Polling=require("./polling"),util=require("../util");module.exports=JSONPPolling;var global="undefined"!=typeof window?window:global;var rNewline=/\n/g;var callbacks;var index=0;function empty(){}function JSONPPolling(opts){Polling.call(this,opts);if(!callbacks){if(!global.___eio)global.___eio=[];callbacks=global.___eio}this.index=callbacks.length;var self=this;callbacks.push(function(msg){self.onData(msg)});this.query.j=this.index}util.inherits(JSONPPolling,Polling);JSONPPolling.prototype.doOpen=function(){var self=this;util.defer(function(){Polling.prototype.doOpen.call(self)})};JSONPPolling.prototype.doClose=function(){if(this.script){this.script.parentNode.removeChild(this.script);this.script=null}if(this.form){this.form.parentNode.removeChild(this.form);this.form=null}Polling.prototype.doClose.call(this)};JSONPPolling.prototype.doPoll=function(){var script=document.createElement("script");if(this.script){this.script.parentNode.removeChild(this.script);this.script=null}script.async=true;script.src=this.uri();var insertAt=document.getElementsByTagName("script")[0];insertAt.parentNode.insertBefore(script,insertAt);this.script=script;if(util.ua.gecko){setTimeout(function(){var iframe=document.createElement("iframe");document.body.appendChild(iframe);document.body.removeChild(iframe)},100)}};JSONPPolling.prototype.doWrite=function(data,fn){var self=this;if(!this.form){var form=document.createElement("form"),area=document.createElement("textarea"),id=this.iframeId="eio_iframe_"+this.index,iframe;form.className="socketio";form.style.position="absolute";form.style.top="-1000px";form.style.left="-1000px";form.target=id;form.method="POST";form.setAttribute("accept-charset","utf-8");area.name="d";form.appendChild(area);document.body.appendChild(form);this.form=form;this.area=area}this.form.action=this.uri();function complete(){initIframe();fn()}function initIframe(){if(self.iframe){self.form.removeChild(self.iframe)}try{iframe=document.createElement('<iframe name="'+self.iframeId+'">')}catch(e){iframe=document.createElement("iframe");iframe.name=self.iframeId}iframe.id=self.iframeId;self.form.appendChild(iframe);self.iframe=iframe}initIframe();this.area.value=data.replace(rNewline,"\\n");try{this.form.submit()}catch(e){}if(this.iframe.attachEvent){this.iframe.onreadystatechange=function(){if(self.iframe.readyState=="complete"){complete()}}}else{this.iframe.onload=complete}}});require.register("learnboost-engine.io-client/lib/transports/websocket.js",function(module,exports,require){var Transport=require("../transport"),parser=require("../parser"),util=require("../util"),debug=require("debug")("engine.io-client:websocket");module.exports=WS;var global="undefined"!=typeof window?window:global;function WS(opts){Transport.call(this,opts)}util.inherits(WS,Transport);WS.prototype.name="websocket";WS.prototype.doOpen=function(){if(!this.check()){return}var self=this;this.socket=new(ws())(this.uri());this.socket.onopen=function(){self.onOpen()};this.socket.onclose=function(){self.onClose()};this.socket.onmessage=function(ev){self.onData(ev.data)};this.socket.onerror=function(e){self.onError("websocket error",e)}};WS.prototype.write=function(packets){for(var i=0,l=packets.length;i<l;i++){this.socket.send(parser.encodePacket(packets[i]))}};WS.prototype.doClose=function(){if(typeof this.socket!=="undefined"){this.socket.close()}};WS.prototype.uri=function(){var query=this.query||{};var schema=this.secure?"wss":"ws";var port="";if(this.port&&("wss"==schema&&this.port!=443||"ws"==schema&&this.port!=80)){port=":"+this.port}if(this.timestampRequests){query[this.timestampParam]=+new Date}query=util.qs(query);if(query.length){query="?"+query}return schema+"://"+this.host+port+this.path+query};WS.prototype.check=function(){var websocket=ws();return!!websocket&&!("__initialize"in websocket&&this.name===WS.prototype.name)};function ws(){if("undefined"!=typeof process){return require("ws")}return global.WebSocket||global.MozWebSocket}});require.register("learnboost-engine.io-client/lib/transports/flashsocket.js",function(module,exports,require){var WS=require("./websocket"),util=require("../util"),debug=require("debug")("engine.io-client:flashsocket");module.exports=FlashWS;var xobject=global[["Active"].concat("Object").join("X")];function FlashWS(options){WS.call(this,options);this.flashPath=options.flashPath;this.policyPort=options.policyPort}util.inherits(FlashWS,WS);FlashWS.prototype.name="flashsocket";FlashWS.prototype.doOpen=function(){if(!this.check()){return}function log(type){return function(){var str=Array.prototype.join.call(arguments," ");debug("[websocketjs %s] %s",type,str)}}WEB_SOCKET_LOGGER={log:log("debug"),error:log("error")};WEB_SOCKET_SUPPRESS_CROSS_DOMAIN_SWF_ERROR=true;WEB_SOCKET_DISABLE_AUTO_INITIALIZATION=true;if("undefined"==typeof WEB_SOCKET_SWF_LOCATION){WEB_SOCKET_SWF_LOCATION=this.flashPath+"WebSocketMainInsecure.swf"}var deps=[this.flashPath+"web_socket.js"];if("undefined"==typeof swfobject){deps.unshift(this.flashPath+"swfobject.js")}var self=this;load(deps,function(){self.ready(function(){WebSocket.__addTask(function(){WS.prototype.doOpen.call(self)})})})};FlashWS.prototype.doClose=function(){if(!this.socket)return;var self=this;WebSocket.__addTask(function(){WS.prototype.doClose.call(self)})};FlashWS.prototype.write=function(){var self=this,args=arguments;WebSocket.__addTask(function(){WS.prototype.write.apply(self,args)})};FlashWS.prototype.ready=function(fn){if(typeof WebSocket=="undefined"||!("__initialize"in WebSocket)||!swfobject){return}if(swfobject.getFlashPlayerVersion().major<10){return}function init(){if(!FlashWS.loaded){if(843!=self.policyPort){WebSocket.loadFlashPolicyFile("xmlsocket://"+self.host+":"+self.policyPort)}WebSocket.__initialize();FlashWS.loaded=true}fn.call(self)}var self=this;if(document.body){return init()}util.load(init)};FlashWS.prototype.check=function(){if("undefined"!=typeof process){return false}if(typeof WebSocket!="undefined"&&!("__initialize"in WebSocket)){return false}if(xobject){var control=null;try{control=new xobject("ShockwaveFlash.ShockwaveFlash")}catch(e){}if(control){return true}}else{for(var i=0,l=navigator.plugins.length;i<l;i++){for(var j=0,m=navigator.plugins[i].length;j<m;j++){if(navigator.plugins[i][j].description=="Shockwave Flash"){return true}}}}return false};var scripts={};function create(path,fn){if(scripts[path])return fn();var el=document.createElement("script");var loaded=false;debug('loading "%s"',path);el.onload=el.onreadystatechange=function(){if(loaded||scripts[path])return;var rs=el.readyState;if(!rs||"loaded"==rs||"complete"==rs){debug('loaded "%s"',path);el.onload=el.onreadystatechange=null;loaded=true;scripts[path]=true;fn()}};el.async=1;el.src=path;var head=document.getElementsByTagName("head")[0];head.insertBefore(el,head.firstChild)}function load(arr,fn){function process(i){if(!arr[i])return fn();create(arr[i],function(){process(++i)})}process(0)}});require.register("component-json/index.js",function(module,exports,require){module.exports="undefined"==typeof JSON?require("json-fallback"):JSON});require.register("learnboost-socket.io-protocol/index.js",function(module,exports,require){var json;try{json=require("json")}catch(e){json=JSON}exports.protocol=1;exports.types=["CONNECT","DISCONNECT","EVENT","ACK","ERROR"];exports.CONNECT=0;exports.DISCONNECT=1;exports.EVENT=2;exports.ACK=3;exports.ERROR=4;exports.encode=function(obj){var str="";var nsp=false;str+=obj.type;if(obj.nsp&&"/"!=obj.nsp){nsp=true;str+=obj.nsp}if(obj.id){if(nsp){str+=",";nsp=false}str+=obj.id}if(obj.data){if(nsp)str+=",";str+=json.stringify(obj.data)}return str};exports.decode=function(str){var p={};var i=0;p.type=Number(str.charAt(0));if(null==exports.types[p.type])return error();if("/"==str.charAt(i+1)){p.nsp="";while(++i){var c=str.charAt(i);if(","==c)break;p.nsp+=c;if(i+1==str.length)break}}else{p.nsp="/"}var next=str.charAt(i+1);if(""!=next&&Number(next)==next){p.id="";while(++i){var c=str.charAt(i);if(null==c||Number(c)!=c){--i;break}p.id+=str.charAt(i);if(i+1==str.length)break}}if(str.charAt(++i)){try{p.data=json.parse(str.substr(i))}catch(e){return error()}}return p};function error(data){return{type:exports.ERROR,data:"parser error"}}});require.register("component-emitter/index.js",function(module,exports,require){module.exports=Emitter;function Emitter(obj){if(obj)return mixin(obj)}function mixin(obj){for(var key in Emitter.prototype){obj[key]=Emitter.prototype[key]}return obj}Emitter.prototype.on=function(event,fn){this._callbacks=this._callbacks||{};(this._callbacks[event]=this._callbacks[event]||[]).push(fn);return this};Emitter.prototype.once=function(event,fn){var self=this;this._callbacks=this._callbacks||{};function on(){self.off(event,on);fn.apply(this,arguments)}fn._off=on;this.on(event,on);return this};Emitter.prototype.off=function(event,fn){this._callbacks=this._callbacks||{};var callbacks=this._callbacks[event];if(!callbacks)return this;if(1==arguments.length){delete this._callbacks[event];return this}var i=callbacks.indexOf(fn._off||fn);if(~i)callbacks.splice(i,1);return this};Emitter.prototype.emit=function(event){this._callbacks=this._callbacks||{};var args=[].slice.call(arguments,1),callbacks=this._callbacks[event];if(callbacks){callbacks=callbacks.slice(0);for(var i=0,len=callbacks.length;i<len;++i){callbacks[i].apply(this,args)}}return this};Emitter.prototype.listeners=function(event){this._callbacks=this._callbacks||{};return this._callbacks[event]||[]};Emitter.prototype.hasListeners=function(event){return!!this.listeners(event).length}});require.register("component-bind/index.js",function(module,exports,require){var slice=[].slice;module.exports=function(obj,fn){if("string"==typeof fn)fn=obj[fn];if("function"!=typeof fn)throw new Error("bind() requires a function");var args=[].slice.call(arguments,2);return function(){return fn.apply(obj,args.concat(slice.call(arguments)))
}}});require.register("component-json-fallback/index.js",function(module,exports,require){var JSON={};(function(){"use strict";function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==="string"){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else if(typeof space==="string"){indent=space}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}})();module.exports=JSON});require.register("timoxley-to-array/index.js",function(module,exports,require){module.exports=function toArray(collection){if(typeof collection==="undefined")return[];if(collection===null)return[null];if(collection===window)return[window];if(typeof collection==="string")return[collection];if(Array.isArray(collection))return collection.slice();if(typeof collection.length!="number")return[collection];if(typeof collection==="function")return[collection];var arr=[];for(var i=0;i<collection.length;i++){if(collection.hasOwnProperty(i)||i in collection){arr.push(collection[i])}}if(!arr.length)return[];return arr}});require.register("visionmedia-debug/index.js",function(module,exports,require){if("undefined"==typeof window){module.exports=require("./lib/debug")}else{module.exports=require("./debug")}});require.register("visionmedia-debug/debug.js",function(module,exports,require){module.exports=debug;function debug(name){if(!debug.enabled(name))return function(){};return function(fmt){var curr=new Date;var ms=curr-(debug[name]||curr);debug[name]=curr;fmt=name+" "+fmt+" +"+debug.humanize(ms);window.console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}}debug.names=[];debug.skips=[];debug.enable=function(name){localStorage.debug=name;var split=(name||"").split(/[\s,]+/),len=split.length;for(var i=0;i<len;i++){name=split[i].replace("*",".*?");if(name[0]==="-"){debug.skips.push(new RegExp("^"+name.substr(1)+"$"))}else{debug.names.push(new RegExp("^"+name+"$"))}}};debug.disable=function(){debug.enable("")};debug.humanize=function(ms){var sec=1e3,min=60*1e3,hour=60*min;if(ms>=hour)return(ms/hour).toFixed(1)+"h";if(ms>=min)return(ms/min).toFixed(1)+"m";if(ms>=sec)return(ms/sec|0)+"s";return ms+"ms"};debug.enabled=function(name){for(var i=0,len=debug.skips.length;i<len;i++){if(debug.skips[i].test(name)){return false}}for(var i=0,len=debug.names.length;i<len;i++){if(debug.names[i].test(name)){return true}}return false};if(window.localStorage)debug.enable(localStorage.debug)});require.register("socket.io/lib/index.js",function(module,exports,require){var url=require("./url"),parser=require("socket.io-parser"),Manager=require("./manager");module.exports=exports=lookup;var cache=exports.managers={};function lookup(uri,opts){opts=opts||{};var parsed=url(uri);var href=parsed.href;var io;if(opts.forceNew||false===opts.multiplex){io=Manager(href,opts)}else{var id=parsed.id;if(!cache[id])cache[id]=Manager(href,opts);io=cache[id]}return io.socket(parsed.pathname||"/")}if("undefined"!=typeof process){var read=require("fs").readFileSync;exports.source=read(__dirname+"/../socket.io-client.js")}exports.protocol=parser.protocol;exports.connect=lookup;exports.Manager=require("./manager");exports.Socket=require("./socket");exports.Emitter=require("./emitter")});require.register("socket.io/lib/manager.js",function(module,exports,require){var url=require("./url"),eio=require("./engine"),Socket=require("./socket"),Emitter=require("./emitter"),parser=require("socket.io-parser"),on=require("./on"),debug=require("debug")("socket.io-client:manager"),object,bind;module.exports=Manager;function Manager(socket,opts){if(!(this instanceof Manager))return new Manager(socket,opts);opts=opts||{};opts.path=opts.path||"/socket.io";this.nsps={};this.subs=[];this.reconnection(opts.reconnection);this.reconnectionAttempts(opts.reconnectionAttempts||Infinity);this.reconnectionDelay(opts.reconnectionDelay||1e3);this.reconnectionDelayMax(opts.reconnectionDelayMax||5e3);this.timeout(null==opts.timeout?1e4:opts.timeout);this.readyState="closed";if(!socket||!socket.write)socket=eio(socket,opts);this.engine=socket;this.open()}Emitter(Manager.prototype);Manager.prototype.reconnection=function(v){if(!arguments.length)return this._reconnection;this._reconnection=!!v;return this};Manager.prototype.reconnectionAttempts=function(v){if(!arguments.length)return this._reconnectionAttempts;this._reconnectionAttempts=v;return this};Manager.prototype.reconnectionDelay=function(v){if(!arguments.length)return this._reconnectionDelay;this._reconnectionDelay=v;return this};Manager.prototype.reconnectionDelayMax=function(v){if(!arguments.length)return this._reconnectionDelayMax;this._reconnectionDelayMax=v;return this};Manager.prototype.timeout=function(v){if(!arguments.length)return this._timeout;this._timeout=v;return this};Manager.prototype.open=Manager.prototype.connect=function(fn){if(~this.readyState.indexOf("open"))return this;var socket=this.engine;var self=this;var timerSub;this.readyState="opening";var openSub=on(socket,"open",bind(this,"onopen"));var errorSub=on(socket,"error",function(data){self.cleanup();self.emit("connect_error",data);if(fn){var err=new Error("Connection error");err.data=data;fn(err)}});if(false!==this._timeout){var timeout=this._timeout;debug("connect attempt will timeout after %d",timeout);var timer=setTimeout(function(){debug("connect attempt timed out after %d",timeout);openSub.destroy();errorSub.destroy();socket.close();socket.emit("error","timeout");self.emit("connect_timeout",timeout)},timeout);timerSub={destroy:function(){clearTimeout(timer)}};this.subs.push(timerSub)}this.subs.push(openSub);this.subs.push(errorSub);return this};Manager.prototype.onopen=function(){this.cleanup();this.readyState="open";this.emit("open");var socket=this.engine;this.subs.push(on(socket,"data",bind(this,"ondata")));this.subs.push(on(socket,"error",bind(this,"onerror")));this.subs.push(on(socket,"close",bind(this,"onclose")))};Manager.prototype.ondata=function(data){this.emit("packet",parser.decode(data))};Manager.prototype.onerror=function(err){this.emit("error",err)};Manager.prototype.socket=function(nsp){var socket=this.nsps[nsp];if(!socket){socket=new Socket(this,nsp);this.nsps[nsp]=socket}return socket};Manager.prototype.destroy=function(socket){delete this.nsps[socket.nsp];if(!object.length(this.nsps)){this.close()}};Manager.prototype.cleanup=function(){var sub;while(sub=this.subs.shift())sub.destroy()};Manager.prototype.close=Manager.prototype.disconnect=function(){this.skipReconnect=true;this.cleanup();this.engine.close()};Manager.prototype.onclose=function(){this.cleanup();if(!this.skipReconnect){var self=this;this.reconnect()}};Manager.prototype.reconnect=function(){var self=this;this.attempts++;if(this.attempts>this._reconnectionAttempts){this.emit("reconnect_failed");this.reconnecting=false}else{var delay=this.attempts*this._reconnectionDelay;delay=Math.min(delay,this._reconnectionDelayMax);debug("will wait %d before reconnect attempt",delay);this.reconnecting=true;var timer=setTimeout(function(){debug("attemptign reconnect");self.open(function(err){if(err){debug("reconnect attempt error");self.reconnect();return self.emit("reconnect_error",err.data)}else{debug("reconnect success");self.onreconnect()}})},delay);this.subs.push({destroy:function(){clearTimeout(timer)}})}};Manager.prototype.onreconnect=function(){var attempt=this.attempts;this.attempts=0;this.reconnecting=false;this.emit("reconnect",attempt)};try{bind=require("bind");object=require("object")}catch(e){bind=require("bind-component");object=require("object-component")}});require.register("socket.io/lib/engine.js",function(module,exports,require){var engine;try{engine=require("engine.io-client")}catch(e){engine=require("engine.io")}module.exports=engine});require.register("socket.io/lib/socket.js",function(module,exports,require){var parser=require("socket.io-parser"),Emitter=require("./emitter"),toArray=require("to-array"),debug=require("debug")("socket.io-client:socket"),on=require("./on"),bind;module.exports=exports=Socket;var events=exports.events=["connect","disconnect","error"];var emit=Emitter.prototype.emit;function Socket(io,nsp){this.io=io;this.nsp=nsp;this.json=this;this.ids=0;this.acks={};this.open();this.buffer=[];this.connected=false}Emitter(Socket.prototype);Socket.prototype.open=Socket.prototype.connect=function(){var io=this.io;io.open();if("open"==this.io.readyState)this.onopen();this.subs=[on(io,"open",bind(this,"onopen")),on(io,"error",bind(this,"onerror"))]};Socket.prototype.send=function(){var args=toArray(arguments);args.shift("message");this.emit.apply(this,args);return this};Socket.prototype.emit=function(ev){if(~events.indexOf(ev)){emit.apply(this,arguments)}else{var args=toArray(arguments);var packet={type:parser.EVENT,args:args};if("function"==typeof args[args.length-1]){debug("emitting packet with ack id %d",this.ids);this.acks[this.ids]=args.pop();packet.id=this.ids++}this.packet(packet)}return this};Socket.prototype.packet=function(packet){packet.nsp=this.nsp;this.io.write(parser.encode(packet))};Socket.prototype.onerror=function(data){this.emit("error",data)};Socket.prototype.onopen=function(){var io=this.io;this.subs.push(on(io,"packet",bind(this,"onpacket")),on(io,"close",bind(this,"onclose")))};Socket.prototype.onclose=function(reason){debug("close (%s)",reason);this.emit("disconnect",reason)};Socket.prototype.onpacket=function(packet){if(packet.nsp!=this.nsp)return;switch(packet.type){case parser.CONNECT:this.onconnect();break;case parser.EVENT:this.onevent(packet);break;case parser.ACK:this.onack(packet);break;case parser.DISCONNECT:this.ondisconnect();break;case parser.ERROR:this.emit("error",packet.data);break}};Socket.prototype.onevent=function(packet){var args=packet.data||[];debug("emitting event %j",args);if(packet.id){debug("attaching ack callback to event");args.push(this.ack(packet.id))}if(this.connected){emit.apply(this,args)}else{this.buffer.push(args)}};Socket.prototype.ack=function(){var self=this;var sent=false;return function(){if(sent)return;var args=toArray(arguments);debug("sending ack %j",args);self.packet({type:parser.ACK,data:args})}};Socket.prototype.onack=function(packet){debug("calling ack %s with %j",packet.id,packet.data);this.acks[packet.id].apply(this,packet.data);delete this.acks[packet.id]};Socket.prototype.onconnect=function(){this.emit("connect");this.connected=true;this.emitBuffered()};Socket.prototype.emitBuffered=function(){for(var i=0;i<this.buffer.length;i++){emit.apply(this,this.buffer[i])}this.buffer=[]};Socket.prototype.ondisconnect=function(){debug("server disconnect (%s)",this.nsp);this.destroy()};Socket.prototype.destroy=function(){debug("destroying socket (%s)",this.nsp);for(var i=0;i<this.subs.length;i++){this.subs[i].destroy()}this.io.destroy(this)};Socket.prototype.close=Socket.prototype.disconnect=function(){debug("performing disconnect (%s)",this.nsp);this.packet(parser.PACKET_DISCONNECT);for(var i=0;i<this.subs.length;i++){this.subs[i].destroy()}this.io.destroy(this);this.onclose("io client disconnect");return this};try{bind=require("bind")}catch(e){bind=require("bind-component")}});require.register("socket.io/lib/emitter.js",function(module,exports,require){var Emitter;try{Emitter=require("emitter")}catch(e){Emitter=require("emitter-component")}module.exports=Emitter;Emitter.prototype.removeListener=function(event,fn){return this.off(event,fn)};Emitter.prototype.removeAllListeners=function(){this._callbacks={};return this}});require.alias("learnboost-engine.io-client/lib/index.js","socket.io/deps/engine.io/lib/index.js");require.alias("learnboost-engine.io-client/lib/parser.js","socket.io/deps/engine.io/lib/parser.js");require.alias("learnboost-engine.io-client/lib/socket.js","socket.io/deps/engine.io/lib/socket.js");require.alias("learnboost-engine.io-client/lib/transport.js","socket.io/deps/engine.io/lib/transport.js");require.alias("learnboost-engine.io-client/lib/emitter.js","socket.io/deps/engine.io/lib/emitter.js");require.alias("learnboost-engine.io-client/lib/util.js","socket.io/deps/engine.io/lib/util.js");require.alias("learnboost-engine.io-client/lib/transports/index.js","socket.io/deps/engine.io/lib/transports/index.js");require.alias("learnboost-engine.io-client/lib/transports/polling.js","socket.io/deps/engine.io/lib/transports/polling.js");require.alias("learnboost-engine.io-client/lib/transports/polling-xhr.js","socket.io/deps/engine.io/lib/transports/polling-xhr.js");require.alias("learnboost-engine.io-client/lib/transports/polling-jsonp.js","socket.io/deps/engine.io/lib/transports/polling-jsonp.js");require.alias("learnboost-engine.io-client/lib/transports/websocket.js","socket.io/deps/engine.io/lib/transports/websocket.js");require.alias("learnboost-engine.io-client/lib/transports/flashsocket.js","socket.io/deps/engine.io/lib/transports/flashsocket.js");require.alias("learnboost-engine.io-client/lib/index.js","socket.io/deps/engine.io/index.js");require.alias("component-emitter/index.js","learnboost-engine.io-client/deps/emitter/index.js");require.alias("visionmedia-debug/index.js","learnboost-engine.io-client/deps/debug/index.js");require.alias("visionmedia-debug/debug.js","learnboost-engine.io-client/deps/debug/debug.js");require.alias("learnboost-socket.io-protocol/index.js","socket.io/deps/socket.io-parser/index.js");require.alias("component-json/index.js","learnboost-socket.io-protocol/deps/json/index.js");require.alias("component-emitter/index.js","socket.io/deps/emitter/index.js");require.alias("component-bind/index.js","socket.io/deps/bind/index.js");require.alias("component-json-fallback/index.js","socket.io/deps/json-fallback/index.js");require.alias("timoxley-to-array/index.js","socket.io/deps/to-array/index.js");require.alias("visionmedia-debug/index.js","socket.io/deps/debug/index.js");require.alias("visionmedia-debug/debug.js","socket.io/deps/debug/debug.js");if("undefined"==typeof module){window.eio=require("socket.io")}else{module.exports=require("socket.io")}})();
});
require.register("boot/index.js", function(exports, require, module){
navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

    var current = new google.maps.LatLng(lat, lng);

    var map = new google.maps.Map(document.querySelector('.map'), {
        center: current, zoom: 14
    });

    var marker = new google.maps.Marker({
        position: current, map: map
    });
});

});










require.alias("boot/index.js", "nearby/deps/boot/index.js");
require.alias("boot/index.js", "nearby/deps/boot/index.js");
require.alias("boot/index.js", "boot/index.js");
require.alias("component-domify/index.js", "boot/deps/domify/index.js");

require.alias("component-emitter/index.js", "boot/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("component-reactive/lib/index.js", "boot/deps/reactive/lib/index.js");
require.alias("component-reactive/lib/utils.js", "boot/deps/reactive/lib/utils.js");
require.alias("component-reactive/lib/text-binding.js", "boot/deps/reactive/lib/text-binding.js");
require.alias("component-reactive/lib/attr-binding.js", "boot/deps/reactive/lib/attr-binding.js");
require.alias("component-reactive/lib/binding.js", "boot/deps/reactive/lib/binding.js");
require.alias("component-reactive/lib/bindings.js", "boot/deps/reactive/lib/bindings.js");
require.alias("component-reactive/lib/adapter.js", "boot/deps/reactive/lib/adapter.js");
require.alias("component-reactive/lib/index.js", "boot/deps/reactive/index.js");
require.alias("component-format-parser/index.js", "component-reactive/deps/format-parser/index.js");

require.alias("component-props/index.js", "component-reactive/deps/props/index.js");
require.alias("component-props/index.js", "component-reactive/deps/props/index.js");
require.alias("component-props/index.js", "component-props/index.js");
require.alias("visionmedia-debug/index.js", "component-reactive/deps/debug/index.js");
require.alias("visionmedia-debug/debug.js", "component-reactive/deps/debug/debug.js");

require.alias("component-event/index.js", "component-reactive/deps/event/index.js");

require.alias("component-classes/index.js", "component-reactive/deps/classes/index.js");
require.alias("component-indexof/index.js", "component-classes/deps/indexof/index.js");

require.alias("component-query/index.js", "component-reactive/deps/query/index.js");

require.alias("component-reactive/lib/index.js", "component-reactive/index.js");
require.alias("visionmedia-superagent/lib/client.js", "boot/deps/superagent/lib/client.js");
require.alias("visionmedia-superagent/lib/client.js", "boot/deps/superagent/index.js");
require.alias("component-emitter/index.js", "visionmedia-superagent/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("RedVentures-reduce/index.js", "visionmedia-superagent/deps/reduce/index.js");

require.alias("visionmedia-superagent/lib/client.js", "visionmedia-superagent/index.js");
require.alias("socket.io/index.js", "boot/deps/socket.io/index.js");
require.alias("socket.io/index.js", "boot/deps/socket.io/index.js");
require.alias("socket.io/index.js", "socket.io/index.js");
require.alias("boot/index.js", "boot/index.js");