//��Ƶ�ӳ�������ʱ����
function timing1(options){
    options.a           = options.a || 0;//��ʼ
    options.z           = options.z || 100;//����
    options.step        = options.step || +1;//����
    options.delay       = options.delay || 10;//�ӳ�
    options.onStart     = options.onStart || function(i){};//����ʱ
    options.onTiming    = options.onTiming || function(i){};//����ʱ
    options.onStop      = options.onStop || function(i){};//����ʱ
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









//��Ƶ�ӳ���
function timing2(options){
    options.a           = options.a || 0;//��ʼ
    options.z           = options.z || 100;//����
    options.step        = options.step || +1;//����
    options.delay       = options.delay || 10;//�ӳ�
    options.amplTop     = options.amplTop || +20;//�����ֵ
    options.amplBot     = options.amplBot || -15;//�����ֵ
    options.onStart     = options.onStart || function(i){};//����ʱ
    options.onTiming    = options.onTiming || function(i){};//����ʱ
    options.onStop      = options.onStop || function(i){};//����ʱ
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