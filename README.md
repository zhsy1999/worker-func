# worker-func

通过传入一个Function，构造一个本地的Web Worker，并通过Promise返回结果

## 使用方法

```javascript
const WorkerFunc = require('@ali/worker-func');

const sumWorker = WorkerFunc(function(arg1, arg2, callback) {
  //当前作用域内部:
  //1、无法访问 DOM 节点
  //2、运行在另一个上下文中，无法使用Window对象
  //3、Web Worker 的运行不会影响主线程，但与主线程交互时仍受到主线程单线程的瓶颈制约。换言之，如果 Worker 线程频繁与主线程进行交互，主线程由于需要处理交互，仍有可能使页面发生阻塞
  //4、共享线程可以被多个浏览上下文（Browsing context）调用，但所有这些浏览上下文必须同源（相同的协议，主机和端口号）
  callback(arg1 + arg2)
});

sumWorker(1, 2).then(res => {
    console.log(res)
})

```



Changelog
=======

  * v1.0.0 
