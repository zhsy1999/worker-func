const {URL, Blob, Worker} = window || {};
const isEnabled = URL && Blob && Worker;
let bridge = function () {
    let callback = function (result) {
        self.postMessage(result);
        self.close();
    };
    self.onmessage = function (msg) {
        let args = msg.data.slice();
        args.push(callback);
        _func.apply(self, args);
    };
};

let bStr = 'var _b = ' + bridge.toString() + ';' + '_b();';

function CreateWorker(src) {
    if (isEnabled) {
        let blob = new Blob([src], {type: "text/javascript"});
        return new Worker(URL.createObjectURL(blob));
    } else {
        throw Error('WorkFunc: Your browser do not support web worker.');
    }
}

function WorkFunc(fn) {
    const fnStr = 'var _func = ' + fn.toString() + ';' + bStr;
    return function () {
        let args = Array.prototype.slice.call(arguments, 0);
        return new Promise(function (resolve, reject) {
            let worker = new CreateWorker(fnStr);
            worker.onmessage = function (result) {
                resolve(result.data);
            };
            worker.onerror = function (err) {
                reject(err);
            };
            worker.postMessage(args);
        });
    }
}

module.exports = WorkFunc;
