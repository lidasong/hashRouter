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
        root.HashView = factory();
    }
}(window, function() {
    'use strict';

    function HashView(hashviews, container) {
        this.container = container;
        this.router = new Router();
        this.xhr = new XHR();
        this._init(hashviews);
    }

    HashView.prototype = {
        _init: _init,
        addHashView: addHashView,
        removeHashView: removeHashView
    };

    function _init(hashviews) {
        var hashKeys = Object.keys(hashviews),
            reg = /^#\w+/,
            self = this;
        hashKeys.forEach(function(key, index) {
            if (reg.test(hashviews[key])) {
                var routerItem = {};
                routerItem[key] = function(ev, paras) {
                    var id = hashviews[key],
                        html = document.querySelector(id).innerHTML;
                    self.container.innerHTML = html;
                };
                self.router.addRouter(routerItem);
            } else {
                var routerItem = {};
                routerItem[key] = function(ev, paras) {
                    var url = hashviews[key];
                    self.xhr.load(url, function(res) {
                        self.container.innerHTML = res;
                    });
                };
                self.router.addRouter(routerItem);
            }
        });
    }

    function addHashView(hashview) {
        var hashKey = Object.keys(hashview)[0],
            reg = /^#\w+/,
            self = this;
        if (reg.test(hashview[hashKey])) {
            this.router.addRouter({
                hashKey: function(ev, paras) {
                    var id = hashviews[key],
                        html = document.querySelector(id).innerHTML;
                    self.container.innerHTML = html;
                }
            });
        } else {
            this.router.addRouter({
                key: function(ev, paras) {
                    var url = hashviews[key];
                    self.xhr.load(url, function(res) {
                        self.container.innerHTML = res;
                    });
                }
            });
        }
    }

    function removeHashView(hashKey) {
        this.router.removeRouter(hashKey);
    }

    function XHR() {
        this.xhr = new XMLHttpRequest();
    }
    XHR.prototype = {
        load: load,
        get:get,
        post:post,
        patch:patch,
        put:put,
        xhrAlways:xhrAlways
    }

    function load(options) {
    	var success = options.success || function(){},
    		fail = options.fail || function(){};
        this.xhr.open('get', options.url);
        this.xhr.setRequestHeader('accept','text/html');
    	this.xhrAlways(success,fail);
    }

    function get(options){
    	var success = options.success || function(){},
    		fail = options.fail || function(){};
    	this.xhr.open('get',options.url);
    	this.xhrAlways(success,fail);
    }

    function post(options){
    	var success = options.success || function(){},
    		fail = options.success || funciton(){},
    		data = options.data || {};
    	data = param(data);
    	this.xhr.open('post',options.url);
    	this.xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    	this.xhr.send(data);
    	this.xhrAlways(success,fail);
    }

    function put(options){
    	var success = options.success || function(){},
    		fail = options.success || funciton(){},
    		data = options.data || {};
    	data = param(data);
    	this.xhr.open('post',options.url);
    	this.xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    	this.xhr.setRequestHeader('X-HTTP-Method-Override', 'put');
    	this.xhr.send(data);
    	this.xhrAlways(success,fail);
    }

    function patch(options){
    	var success = options.success || function(){},
    		fail = options.success || funciton(){},
    		data = options.data || {};
    	data = param(data);
    	this.xhr.open('post',options.url);
    	this.xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    	this.xhr.setRequestHeader('X-HTTP-Method-Override', 'patch');
    	this.xhr.send(data);
    	this.xhrAlways(success,fail);
    }

    function xhrAlways(success,fail){
    	this.xhr.addEventListener('loadend',function(evt){
    		var response = evt.currentTarget.response;
    		success(response,evt);
    	});
    	this.xhr.addEventListener('error',function(evt){
    		fail(evt);
    	});
    }

    function param(data){
    	var parsedData = [],r20 = /%20/g,
    		add = function(key,value){
    			value = typeof value === 'function' ? value() : value;
    			parsedData[parsedData.length] = encodeURIComponent(key) + '=' + encodeURIComponent(vlaue);
    		};
    	if(typeof data === 'object'){
    		for(var i in obj){
    			add(i,obj[i]);
    		}
    	}
    	return parsedData.join('&').replace(r20,'+');
    }

    return HashView;
}));
