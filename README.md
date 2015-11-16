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

## Router详细介绍

Router原型继承EventEmit

### EventEmit

```javascript
	EventEmit包含常规的事件O-O模式
	listener监听
	removeListener监听解除
```

Router根据hash值得不同，触发对应的监听器响应，
hash后可以添加参数，监听器的响应包含hash的添加参数
比如：
```javascript
	router.addRouter({
		hash:function(){
			console.log(arguments);
		}
	});

	点击<a href="#hash/参数">console显示参数<a>
	点击后console显示：[参数]
```
