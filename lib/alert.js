/**
* 弹出框插件
* @auther:yangyifan
* @email : yangyifanphp@gmail.com
**/


/**
 * 设置需要加载组件的path路径和映射关系
 * @description:路径相对于当前文件的路径
 */
require.config({
	baseUrl : './lib/',
	paths   :{
		'dialog' 	: 'http://static.womenshuo.com/sweet-alert.min',
		'jquery' 	: 'http://static.womenshuo.com/jquery1.0.10.0.min'
	}
})

/**
 * 逻辑代码
 */
require(['dialog','jquery'],function(A,$){
    /**
     * 简单弹出框提示(只有标题)
     */
	show_alert1 = function (){
        A(
            "这个选项是标题" //标题
        );
	}

    /**
     * 有标题和文本的
     */
	show_alert2 = function (){
        A(
            "这个选项是标题",//标题
            "这个选项是文本"//文本内容
         );
    }

    /**
     * 带有成功提示和错误提示的
     */
    show_alert3 = function (){
        A(
            "这个选项是标题",//标题
            "这个选项是文本",//文本内容
            'error'//success表示成功，error表示失败
        );
    }

    /**
     * 带有确认和取消按钮的弹出框
     */
    show_alert4 = function (){
        A({
            title: "这个选项是标题",//标题
            text: "这个选项是文本",//文本内容
            type: "warning",//类型：warning(警告)；error（错误）;info(信息);success(成功)
            showCancelButton: true,//是否显示取消按钮
            confirmButtonColor: '#DD6B55',//确认按钮的颜色
            confirmButtonText: '删除',//确认按钮的文字
            closeOnConfirm: false//关闭确认按钮 true:关闭；false:不关闭
        },
        function(){
            A("删除", "删除成功", "success");
        });
    }

    /**
     * 带有确认和取消按钮的弹出框2
     */
    show_alert5 = function (){
        A({
            title: "这个选项是标题",//标题
            text: "这个选项是文本",//文本内容
            type: "warning",//类型：warning(警告)；error（错误）;info(信息);success(成功)
            showCancelButton: true,//是否显示取消按钮
            confirmButtonColor: '#DD6B55',//确认按钮的颜色
            confirmButtonText: 'Yes, delete it!',//确认按钮的文字
            cancelButtonText: "取消",//取消按钮的文字
            closeOnConfirm: false,//关闭确认按钮 true:关闭；false:不关闭
            closeOnCancel: false//关闭取消按钮 true:关闭；false:不关闭
        },
        function(isConfirm){//参数代表是否点击了确认按钮，如果点击了，则为true，否则为false
            if (isConfirm){
                A("删除", "删除成功", "success");
            } else {
                A("取消", "取消成功", "error");
            }
        });
    }

    /**
     * 带有图片的弹出框
     */
    show_alert6 = function (){
        A({
            title: "这个选项是标题",//标题
            text: "这个选项是文本",//文本内容
            imageUrl: './alert/images/thumbs-up.jpg'
        });
    }

    /**
     * 带有html的弹出框
     */
    show_alert7 = function (){
        A({
            title: "<h2>这个选项是标题</h2>",//标题
            text: "<h3 style='color: red;'>这个选项是文本</h3>",//文本内容
            html: true//开启html
        });
    }

    /**
     * 带有定时关闭的弹出框
     */
    show_alert8 = function (){
        A({
            title: "<h2>这个选项是标题</h2>",//标题
            text: "<h3 style='color: red;'>这个选项是文本</h3>",//文本内容
            html: true,//开启html
            timer:2000//表示2s后关闭弹出框
        });
    }

})
