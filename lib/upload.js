/**
 * 上传插件
 * @auther:yangyifan
 * @email : yangyifanphp@gmail.com
 **/

/**
 * 设置需要加载组件的path路径和映射关系
 * @description:路径相对于当前文件的路径
 */
require.config({
    'paths'     : {
        jquery          : 'http://static.womenshuo.com/jquery1.0.10.0.min',
        jq_ui           : 'http://static.womenshuo.com/@/jquery-ui-1.11.3/jquery-ui.min',
        plupload        : 'http://static.womenshuo.com/@/plupload/plupload.full.min',
        plupload_zh     : 'http://static.womenshuo.com/@/plupload/i18n/zh_CN',
        upload_ui       : 'http://static.womenshuo.com/@/upload/ui/ui',
        upload_sdk      : 'http://static.womenshuo.com/@/upload/qiniu',
        upload_class    : 'http://static.womenshuo.com/@/womenshuo/lib/upload.class'
    }
})

/**
 * 逻辑代码
 */
require(['jquery','jq_ui','plupload','plupload_zh','upload_ui','upload_sdk','upload_class'],function($,JqUi,upload_plus,pload_plus_zh,upload_ui,upload_sdk,upload){

    //业务代码开始
    $(function() {

        upload.upload({

        })

        //upload.upload.bind('FileUploaded', function(file,key) {
        //
        //});

        $('#container').on(
            'dragenter',
            function(e) {
                e.preventDefault();
                $('#container').addClass('draging');
                e.stopPropagation();
            }
        ).on('drop', function(e) {
                e.preventDefault();
                $('#container').removeClass('draging');
                e.stopPropagation();
            }).on('dragleave', function(e) {
                e.preventDefault();
                $('#container').removeClass('draging');
                e.stopPropagation();
            }).on('dragover', function(e) {
                e.preventDefault();
                $('#container').addClass('draging');
                e.stopPropagation();
            });



        $('#show_code').on('click', function() {
            $('#myModal-code').modal();
            $('pre code').each(function(i, e) {
                hljs.highlightBlock(e);
            });
        });


        $('body').on('click', 'table button.btn', function() {
            $(this).parents('tr').next().toggle();
        });


        var getRotate = function(url) {
            if (!url) {
                return 0;
            }
            var arr = url.split('/');
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i] === 'rotate') {
                    return parseInt(arr[i + 1], 10);
                }
            }
            return 0;
        };

        $('#myModal-img .modal-body-footer').find('a').on('click', function() {
            var img = $('#myModal-img').find('.modal-body img');
            var key = img.data('key');
            var oldUrl = img.attr('src');
            var originHeight = parseInt(img.data('h'), 10);
            var fopArr = [];
            var rotate = getRotate(oldUrl);
            if (!$(this).hasClass('no-disable-click')) {
                $(this).addClass('disabled').siblings().removeClass('disabled');
                if ($(this).data('imagemogr') !== 'no-rotate') {
                    fopArr.push({
                        'fop': 'imageMogr2',
                        'auto-orient': true,
                        'strip': true,
                        'rotate': rotate,
                        'format': 'png'
                    });
                }
            } else {
                $(this).siblings().removeClass('disabled');
                var imageMogr = $(this).data('imagemogr');
                if (imageMogr === 'left') {
                    rotate = rotate - 90 < 0 ? rotate + 270 : rotate - 90;
                } else if (imageMogr === 'right') {
                    rotate = rotate + 90 > 360 ? rotate - 270 : rotate + 90;
                }
                fopArr.push({
                    'fop': 'imageMogr2',
                    'auto-orient': true,
                    'strip': true,
                    'rotate': rotate,
                    'format': 'png'
                });
            }

            $('#myModal-img .modal-body-footer').find('a.disabled').each(function() {

                var watermark = $(this).data('watermark');
                var imageView = $(this).data('imageview');
                var imageMogr = $(this).data('imagemogr');

                if (watermark) {
                    fopArr.push({
                        fop: 'watermark',
                        mode: 1,
                        image: 'http://www.b1.qiniudn.com/images/logo-2.png',
                        dissolve: 100,
                        gravity: watermark,
                        dx: 100,
                        dy: 100
                    });
                }

                if (imageView) {
                    var height;
                    switch (imageView) {
                        case 'large':
                            height = originHeight;
                            break;
                        case 'middle':
                            height = originHeight * 0.5;
                            break;
                        case 'small':
                            height = originHeight * 0.1;
                            break;
                        default:
                            height = originHeight;
                            break;
                    }
                    fopArr.push({
                        fop: 'imageView2',
                        mode: 3,
                        h: parseInt(height, 10),
                        q: 100,
                        format: 'png'
                    });
                }

                if (imageMogr === 'no-rotate') {
                    fopArr.push({
                        'fop': 'imageMogr2',
                        'auto-orient': true,
                        'strip': true,
                        'rotate': 0,
                        'format': 'png'
                    });
                }
            });

            var newUrl = Qiniu.pipeline(fopArr, key);

            var newImg = new Image();
            img.attr('src', 'loading.gif');
            newImg.onload = function() {
                img.attr('src', newUrl);
                img.parent('a').attr('href', newUrl);
            };
            newImg.src = newUrl;
            return false;
        });

    });
    //业务代码结束


})
