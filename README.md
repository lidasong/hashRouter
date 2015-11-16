# hashRouter

## 使用说明

``` javascript
+ var router = new Router({
    hash1:function(){alert(location.hash);console.log(arguments);},
	hash2:function(){}
})

router.addRouter({
	hash3:function(){}
});

router.removeRouter('hash3');
``` 