(function(root, factory) {
    /*global define, exports, module */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function() {
    'use strict';

    function EventEmit() {
        this.events = {};
    }

    (function() {
        var arrProtoSlice = Array.prototype.slice;

        function bind(event, callback) {
            if (this.events[event]) {
                this.events[event].push(callback);
            } else {
                this.events[event] = [];
                this.events[event].push(callback);
            }
            return this.events[event];
        }

        function unbind(event, callback) {
            if (callback && typeof callback == 'function') {
                try {
                    var index = this.events[event].indexOf(callback);
                    index !== -1 ? this.events[event].splice(index, 1) : '';
                    return index;
                } catch (e) {
                    return e.message;
                }
            } else {
                this.events[event] ? delete this.events[event] : '';
                return true;
            }
            return false;
        }

        function once(event, callback) {
            var self = this;
            var outerCallback = function outerCallback() {
                callback();
                self.unbind(event, outerCallback);
            };
            this.bind(event, outerCallback)
        }

        function emit(event, callback) {
            var args = arrProtoSlice.call(arguments, 1);
            if (callback && typeof callback == 'function') {
                args.shift();
                if (this.events[event]) {
                    var index = this.events[event].indexOf(callback);
                    index !== -1 ? this.events[event][index].apply(null, args) : '';
                    return index;
                } else {
                    return false;
                }
            } else {
                this.events[event].forEach(function(callback, index) {
                    callback.apply(null, args);
                });
            }
        }

        EventEmit.prototype = {
            bind: bind,
            on: bind,
            off: unbind,
            unbind: unbind,
            once: once,
            emit: emit
        };
    })()


    function Router(routers) {
        this._initRouter(routers);
        this._openHash();
    }
    Router.prototype = new EventEmit();

    (function() {
        function include(target, mixin) {
            var mixinKeys = Object.keys(mixin);
            mixinKeys.forEach(function(key, index) {
                target[key] = mixin[key];
            });
        }

        function _init(routers) {
            var keys = Object.keys(routers),
                self = this;
            keys.forEach(function(routerKey, index) {
                self.bind(routerKey, routers[routerKey]);
            });
        }

        function _openHash() {
            var self = this;
            window.addEventListener('hashchange', function(ev) {
                var args = location.hash.slice(1).split(/\//),
                    currentHash = args[0];
                args.shift();
                if (self.events[currentHash])
                    self.emit(currentHash, args.join('/'))
            });
        }

        function addRouter(routers) {
            var keys = Object.keys(routers),
                self = this;
            keys.forEach(function(routerKey, index) {
                self.bind(routerKey, routers[routerKey]);
            });
        }

        function removeRouter(router) {
            this.unbind(router);
        }
        include(Router.prototype, {
            addRouter: addRouter,
            removeRouter: removeRouter
        });
    })()
    
})).call(this);
