//恒频延迟器（定时器）
function timing1(options){
    options.a           = options.a || 0;//开始
    options.z           = options.z || 100;//结束
    options.step        = options.step || +1;//步长
    options.delay       = options.delay || 10;//延迟
    options.onStart     = options.onStart || function(i){};//启动时
    options.onTiming    = options.onTiming || function(i){};//进行时
    options.onStop      = options.onStop || function(i){};//结束时
    options.i = options.a;
    !function f(){
        if (options.i < options.z) {
            if (options.a == options.i) {
                options.onStart(options);
            } else {
                options.onTiming(options);
            }
            setTimeout(f, options.delay);
        } else {
            options.onStop(options);
        }
        options.i += options.step;
    }();
}
timing1({
    delay: 100,
    onStart: function(options){
        console.log('start');
    },
    onTiming: function(options){
        console.log('timing');
    },
    onStop: function(options){
        console.log('stop');
    }
});









//变频延迟器
function timing2(options){
    options.a           = options.a || 0;//开始
    options.z           = options.z || 100;//结束
    options.step        = options.step || +1;//步长
    options.delay       = options.delay || 10;//延迟
    options.amplTop     = options.amplTop || +20;//振幅峰值
    options.amplBot     = options.amplBot || -15;//振幅谷值
    options.onStart     = options.onStart || function(i){};//启动时
    options.onTiming    = options.onTiming || function(i){};//进行时
    options.onStop      = options.onStop || function(i){};//结束时
    options.i = options.a;
    !function f(){
        if (options.i < options.z) {
            if (options.a == options.i) {
                options.onStart(options);
            } else {
                options.onTiming(options);
            };
            var randAmpl = options.amplBot + Math.random() * (options.amplTop - options.amplBot);
            setTimeout(f, options.delay + randAmpl);
        } else {
            options.onStop(options);
        }
        options.i += options.step;
    }();
}
timing2({
    onStart: function(options){
        console.log('start');
    },
    onTiming: function(options){
        console.log('timing');
    },
    onStop: function(options){
        console.log('stop');
    }
});