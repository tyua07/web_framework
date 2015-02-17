/**
 * 上传组件核心库文件
 * @auther:yangyifan
 * @email : yangyifanphp@gmail.com
 **/
define(['jquery','jq_ui','plupload','plupload_zh','upload_ui','upload_sdk'],function($,JqUi,upload_plus,pload_plus_zh,upload_ui,upload_sdk){

    var upload = function (params){
        /**
         * 定义play方法
         * @param params
         */
        var isWhat = function(file) {
            var Suffixes   = [".png", ".jpg", ".jpeg", ".gif", ".bmp",".mp4",".flv",".mp3",".wmp"];
            var suffix = file.substr(file.lastIndexOf(".")).toLowerCase();
            for (var i = 0; i < Suffixes.length ; i++ ) {
                if (suffix == Suffixes[i]) {
                    return 1;
                }
            }
            return -1;
        };
        var _ON = true;
        var uploaderClass = Qiniu.uploader({
            runtimes: 'html5,flash,html4',
            browse_button: 'pickfiles',
            container: 'container',
            drop_element: 'container',
            max_file_size: _size,
            flash_swf_url: 'http://static.womenshuo.com/@/plupload/Moxie.swf',
            dragdrop: true,
            chunk_size: '4mb',
            uptoken_url: _uptoken_url,
            domain: _domain,
            auto_start: true,
            init: {
                'FilesAdded': function(up, files) {
                    if(_ON){
                        $('table').show();
                        $('#success').hide();
                        plupload.each(files, function (file) {
                            var progress = new FileProgress(file, 'fsUploadProgress');
                            progress.setStatus("等待...");

                        });
                    }else{
                        alert('文件类型错误，不允许上传');
                    }

                },
                'BeforeUpload': function(up, file) {
                    if(isWhat(file.name) <= 0 ){
                        _ON = false;
                    }else{
                        _ON = true;
                        var progress = new FileProgress(file, 'fsUploadProgress');
                        var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                        if (up.runtime === 'html5' && chunk_size) {
                            progress.setChunkProgess(chunk_size);
                        }
                    }
                },
                'UploadProgress': function(up, file) {
                    if(_ON) {
                        var progress = new FileProgress(file, 'fsUploadProgress');
                        var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                        progress.setProgress(file.percent + "%", up.total.bytesPerSec, chunk_size);
                    }

                },
                'UploadComplete': function() {
                    if(_ON) {
                        $('#success').show();
                    }
                },
                'FileUploaded': function(up, file, info) {
                    if(_ON) {
                        var progress = new FileProgress(file, 'fsUploadProgress');
                        progress.setComplete(up, info);
                    }
                },
                'Error': function(up, err, errTip) {
                    $('table').show();
                    var progress = new FileProgress(err.file, 'fsUploadProgress');
                    progress.setError();
                    progress.setStatus(errTip);
                }
                // ,
                // 'Key': function(up, file) {
                //     var key = "";
                //     // do something with key
                //     return key
                // }
            }
        });
    }


    return {upload : upload};

})
