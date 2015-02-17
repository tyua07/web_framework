/**
 * 音频插件
 * @auther:yangyifan
 * @email : yangyifanphp@gmail.com
 **/

/**
 * 设置需要加载组件的path路径和映射关系
 * @description:路径相对于当前文件的路径
 */
require.config({
    'paths'     : {
        jquery      : 'http://static.womenshuo.com/jquery1.0.10.0.min',
        muplayer    : 'http://static.womenshuo.com/@/muplayer/dist/',
        jq_ui       : 'http://static.womenshuo.com/@/jquery-ui-1.11.3/jquery-ui.min',
        audio_class : 'http://static.womenshuo.com/@/womenshuo/lib/audio.class'
    }
})

/**
 * 逻辑代码
 */
require(['jquery','muplayer/player','jq_ui','audio_class'],function($,Player,JqUi,audio){

    //业务代码开始
    $(function(){
        //把当前播放器居中
        $('.audio').css({
            position    :   'relative',
            left        :   (window.innerWidth - $('.audio').width())/2,
            top         :   (window.innerHeight - $('.audio').height()) / 2
        });

        //修改音量效果
        $('.audio_volume').hover(function(){
            $(this).find('.audio_volume_progress_box').show();
        },function(){
            $(this).find('.audio_volume_progress_box').hide();
        })



        //音乐播放
        audio.play({
            song : [
                'http://static.womenshuo.com/@/static/data/mp3/娱乐天空.mp3',
                'http://static.womenshuo.com/@/static/data/mp3/You Make Me Feel....mp3',
                'http://static.womenshuo.com/@/static/data/mp3/On The Floor.mp3',
                'http://static.womenshuo.com/@/static/data/mp3/I Got You.mp3',
                'http://static.womenshuo.com/@/static/data/mp3/止战之殇.mp3',
                'http://static.womenshuo.com/@/static/data/mp3/特别的人.mp3',
            ]
        })

    })
    //业务代码结束


})
