//恒频延迟器（定时器）
function timing1(options){
    var a           = options.a || 0, 
        z           = options.z || 100, 
        step        = options.step || +1, 
        delay       = options.delay || 10;//i, 开始, 结束, 步长
    var onStart     = options.onStart || function(i){},
        onTiming    = options.onTiming || function(i){},
        onStop      = options.onStop || function(i){};
    var i = a;
    !function f(){
        if (i < z) {
            if (a == i) {
                onStart(i);
            } else {
                onTiming(i);
            }
            setTimeout(f, delay);
        } else {
            onStop(i);
        }
        i += step;
    }();
}
timing1({
    delay: 100,
    onStart: function(){
        console.log('start');
    },
    onTiming: function(){
        console.log('timing');
    },
    onStop: function(){
        console.log('stop');
    }
});









//变频延迟器
function timing2(options){
    var a           = options.a || 0, 
        z           = options.z || 100, 
        step        = options.step || +1, 
        amplTop     = options.amplTop || +20, 
        amplBot     = options.amplBot || -15, 
        delay       = options.delay || 10;//i, 开始, 结束, 步长, 振幅峰值, 振幅谷值, 延迟
    var onStart     = options.onStart || function(i){},
        onTiming    = options.onTiming || function(i){},
        onStop      = options.onStop || function(i){};
    var i = a;
    !function f(){
        if (i <= z) {
            if (a == i) {
                onStart(i);
            } else {
                onTiming(i);
            };
            var randAmpl = amplBot + Math.random() * (amplTop - amplBot);
            setTimeout(f, delay + randAmpl);
        } else {
            onStop(i);
        }
        i += step;
    }();
}
timing2({
    onStart: function(){
        console.log('start');
    },
    onTiming: function(){
        console.log('timing');
    },
    onStop: function(){
        console.log('stop');
    }
});