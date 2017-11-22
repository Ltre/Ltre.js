//恒频延迟器（定时器）
function timing1(opt){
    opt.a           = opt.a || 0;//开始
    opt.z           = opt.z || 100;//结束
    opt.step        = opt.step || +1;//步长
    opt.delay       = opt.delay || 10;//延迟
    opt.onStart     = opt.onStart || function(i){};//启动时
    opt.onTiming    = opt.onTiming || function(i){};//进行时
    opt.onStop      = opt.onStop || function(i){};//结束时
    opt.i = opt.a;
    ~ function f(){
        if (opt.i <= opt.z) {
            var copiedOpt = JSON.parse(JSON.stringify(opt));//这里作拷贝，防止过短的delay导致循环体错读到别的opt
            opt.a == opt.i && opt.onStart(copiedOpt);
            opt.onTiming(copiedOpt);
            opt.z == opt.i && opt.onStop(copiedOpt);
            setTimeout(f, opt.delay);
        }
        opt.i += opt.step;
    }();
}
timing1({
    delay: 100,
    onStart: function(opt){
        console.log('start');
    },
    onTiming: function(opt){
        console.log('timing');
    },
    onStop: function(opt){
        console.log('stop');
    }
});









//变频延迟器
function timing2(opt){
    opt.a           = opt.a || 0;//开始
    opt.z           = opt.z || 100;//结束
    opt.step        = opt.step || +1;//步长
    opt.delay       = opt.delay || 10;//延迟
    opt.amplTop     = opt.amplTop || +20;//振幅峰值
    opt.amplBot     = opt.amplBot || -15;//振幅谷值
    opt.onStart     = opt.onStart || function(i){};//启动时
    opt.onTiming    = opt.onTiming || function(i){};//进行时
    opt.onStop      = opt.onStop || function(i){};//结束时
    opt.i = opt.a;
    ~ function f(){
        if (opt.i <= opt.z) {
            var copiedOpt = JSON.parse(JSON.stringify(opt));//这里作拷贝，防止过短的delay导致循环体错读到别的opt
            opt.a == opt.i && opt.onStart(copiedOpt);
            opt.onTiming(copiedOpt);
            opt.z == opt.i && opt.onStop(copiedOpt);
            var randAmpl = opt.amplBot + Math.random() * (opt.amplTop - opt.amplBot);
            console.log({randAmpl:randAmpl});
            setTimeout(f, opt.delay + randAmpl);
        }
        opt.i += opt.step;
    }();
}
timing2({
    onStart: function(opt){
        console.log('start');
    },
    onTiming: function(opt){
        console.log('timing');
    },
    onStop: function(opt){
        console.log('stop');
    }
});