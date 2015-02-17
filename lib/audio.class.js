/**
 * 音频核心库文件
 * @auther:yangyifan
 * @email : yangyifanphp@gmail.com
 **/
define(['jquery','muplayer/player','jq_ui'],function($,Player,JqUi){

    /**
     * 定义play方法
     * @param params
     */
    var playClass = function (params){

        //初始化变量
        CONFIG = {
            btn : {
                $progress       : $('.audio_progress'),
                $ctrlIcon       : $('.audio_play'),
                $prev           : $('.audio_prev'),
                $next           : $('.audio_next'),
                $volume         : $('.audio_volume_progress'),
                $volume_mute    : $('.audio_volume_mute'),
                $model          : $('.audio_mode'),
                modes           : ['loop', 'list-random'],
                modeIndex       : 0
            },
            class : {
                play_class      : 'glyphicon-play',
                pause_class     : 'glyphicon-pause',
                audio_now_time  : "audio_now_time",
                audio_time      : "audio_time",
                volume_off      : 'glyphicon-volume-off',
                volume_down     : 'glyphicon-volume-down',
                random          : 'glyphicon-random',
                refresh         : 'glyphicon-refresh'
            },
            slider_type : {
                songs_progress_type     : 'horizontal',
                volume_progress_type    : 'vertical'
            },
            song : [

            ]
        }

        //组合参数
        var PARAMS = $.extend(true,params,CONFIG);

        //初始化音频播放器
        var player = new Player({
            baseDir     : 'http://static.womenshuo.com/@/muplayer/dist/',//必填选项，播放器核心库文件夹
            mode        : 'loop',//默认值: 'loop'。播放器的歌曲列表的播放顺序逻辑.可选值为 'loop'（循环播放），'list'（列表播放，该列表播放到最后一首或第一首后则停止播放），'single'（单曲播放），'random'（随机），'list-random'（列表随机，与random的区别是保证已随机过的列表中歌曲均播放一次后，再对列表随机重置）。
            mute        : false,//默认值: false。是否静音。
            volume      : 80,//默认值: 80。播放音量，取值范围0 - 100。
            singleton   : false,//默认值: true。初始化的Player实例是否是单实例。如果希望一个页面中有多个播放实例并存，可以设成false
            absoluteUrl : true,//默认值: true。播放音频的链接是否要自动转化成绝对地址。
            engines     : [{constructor: 'FlashMP4Core',rgs: {swf: 'http://static.womenshuo.com/@/muplayer/dist/muplayer_mp4.swf'}}, {constructor: 'AudioCore'}]

        })

        /**
         * 定义操作dom变量
         * @type {.btn.$progress|*}
         */
        var $progress       = PARAMS.btn.$progress ,
            $ctrlIcon       = PARAMS.btn.$ctrlIcon,
            $prev           = PARAMS.btn.$prev,
            $next           = PARAMS.btn.$next,
            $volume         = PARAMS.btn.$volume,
            $volume_mute    = PARAMS.btn.$volume_mute,
            $model          = PARAMS.btn.$model,
            modes           = PARAMS.btn.modes,
            modeIndex       = PARAMS.btn.modeIndex;

        //添加歌曲列表到当前音频播放器
        player.add(PARAMS.song);

        /**
         * 播放和暂停播放器
         * @param obj
         */
        $ctrlIcon.on('click',function(){
            //操作class样式，如果有播放的样式，点击的时候移除播放的样式，换成暂停的样式，反之一样
            if($(this).hasClass(PARAMS.class.play_class)){
                $(this).removeClass(PARAMS.class.play_class).addClass(PARAMS.class.pause_class);
                player.play();//开启播放器
            }else{
                $(this).removeClass(PARAMS.class.pause_class).addClass(PARAMS.class.play_class);
                player.pause();//暂停播放器
            }

        })

        /**
         * 播放器上一首
         */
        $prev.on('click',function(){
            player.prev();
        })

        /**
         * 播放下一首
         */
        $next.on('click',function(){
            player.next();
        })

        /**
         * 设置当前播放器循环模式
         */
        $model.click(function() {
            var mode = modes[++modeIndex % 2];
            player.setMode(mode);
            if (mode === 'loop') {
                $model.removeClass(PARAMS.class.random).addClass(PARAMS.class.refresh);
            } else {
                $model.removeClass(PARAMS.class.refresh).addClass(PARAMS.class.random);
            }
        });


        /**
         * 设置当前音量为静音或者关闭静音
         */
        $volume_mute.click(function() {
            var $this = $(this),
                isMute = player.getMute();

            if (isMute) {
                $this.removeClass(PARAMS.class.volume_off).addClass(PARAMS.class.volume_down);
                player.setMute(false);
            } else {
                $this.removeClass(PARAMS.class.volume_down).addClass(PARAMS.class.volume_off);
                player.setMute(true);
            }
        });

        /**
         * 滑块调整当前音量
         */
        $volume.slider({
            value       : player.getVolume(),
            range       : 'min',
            orientation :params.slider_type.volume_progress_type,//改变滑块的滑动方向，"horizontal"（横向）, "vertical"（纵向）
            slide: function(e, ui) {
                player.setVolume(ui.value);
            },
            stop: function(e, ui) {
                $(ui.handle).blur();
            }
        });

        // 通过jquery-ui的slider组件实现播放进度条的交互
        $progress.slider({
            range       : 'min',
            max         : 1000,
            orientation :PARAMS.slider_type.songs_progress_type,//改变滑块的滑动方向，"horizontal"（横向）, "vertical"（纵向）
            start: function() {
                // 为了使拖动操作不受打断，进度条拖动操作开始时即暂停对timeupdate事件的监听
                player.off('timeupdate');
            },
            stop: function(e, ui) {
                // 拖动结束时再恢复对timeupdate事件的监听
                player.on('timeupdate', handleTimeupdate).play(ui.value * player.duration());
                $(ui.handle).blur();
            }
        });

        /**
         * 监听播放器
         */
        handleTimeupdate = function() {
            var pos = player.curPos(),
                duration = player.duration();
            $progress.slider('option', 'value', duration ? pos / duration * 1000 : 0);
        };
        var iTime = null;
        // 事件驱动的UI：即UI应监听player派发的事件，以决定是否切换到对应的状态
        player.on('player:play', function() {
            var iTime = setInterval(function(){
                $('.' + PARAMS.class.audio_now_time).html(Number(player.curPos()).formatTime());
            },1000)
            $progress.slider('enable');
            $ctrlIcon.removeClass(PARAMS.class.play_class).addClass(PARAMS.class.pause_class);
        }).on('player:pause player:stop', function() {
            clearInterval(iTime);
            $progress.slider('disable');
            $ctrlIcon.removeClass(PARAMS.class.pause_class).addClass(PARAMS.class.play_class);
        }).on('timeupdate', function() {
            $('.' + PARAMS.class.audio_time).html(player.duration(true));
        });


    }

    Number.prototype.formatTime=function(){
        // 计算
        var h=0,i=0,s=parseInt(this);
        if(s>60){
            i=parseInt(s/60);
            s=parseInt(s%60);
            if(i > 60) {
                h=parseInt(i/60);
                i = parseInt(i%60);
            }
        }
        // 补零
        var zero=function(v){
            return (v>>0)<10?"0"+v:v;
        };
        return [zero(i),zero(s)].join(":");
    };

    return {play : playClass};

})
