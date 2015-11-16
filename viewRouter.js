function HashView(hashviews, container) {
    this.container = container;
    this.router = new Router();
    this.xhr = new XHR();
    this.init(hashviews);
}

function init(hashKeys) {
    var hashKeys = Object.keys(hashviews),
        reg = /^#\w+/,
        self = this;
    hashKeys.forEach(function(key, index) {
        if (reg.test(hashviews[key])) {
            self.router.addRouter({
                key: function(ev, paras) {
                    var id = hashviews[key],
                        html = document.querySelector(id).innerHTML;
                    self.container.innerHTML = html;
                }
            });
        } else {
            self.router.addRouter({
                key: function(ev, paras) {
                    var url = hashviews[key];
                    self.xhr.load(url, function(res) {
                        self.container.innerHTML = res;
                    });
                }
            });
        }
    });
}

function addHashView(hashview) {
    var hashKey = Object.keys(hashview)[0],
        reg = /^#\w+/,
        self = this;
    if (reg.test(hashview[hashKey])) {
        this.router.addRouter({
            hashKey: function(ev,paras) {
            	var id = hashviews[key],
            	    html = document.querySelector(id).innerHTML;
            	self.container.innerHTML = html;
            }
        });
    }else{
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

function removeHashView(hashKey){
	this.router.removeRouter(hashKey);
}

function XHR(){
	this.xhr = new XMLHttpRequest();
}

function load(url,success){
	this.xhr.open('get',url);
	this.xhr.addEventListener('loadend',function(evt){
		var responseHtml = evt.currentTarget.response;
		success(responseHtml);
	})
}