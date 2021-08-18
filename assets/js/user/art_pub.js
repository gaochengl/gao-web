$(function() {
    var layer = layui.layer;
    var form = layui.form;

    //初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    initCate()

    function initCate() {
        $.ajax({
            method: "get",
            url: '/my/cate/list',
            success: function(res) {
                console.log(res);
                if (res.code !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                $("[ name=cate_id]").html(htmlStr);
                //调用 form.render() 方法
                form.render()
            }
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)



    $("#btnChooseImage").on("click", function() {
        $("#coverFile").click();
    })


    $("#coverFile").on("change", function(e) {
        var files = e.target.files;
        console.log(files);
        if (files.length === 0) {
            return
        }

        //拿到用户选择的文件
        var file = e.target.files[0];
        //创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //定义文章的发布状态
    var art_state = '已发布';
    $("#btnSave2").on("click", function() {
        art_state = '草稿';
    })


    $("#form-pub").on("submit", function(e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        fd.append("state", art_state);
        // fd.forEach(o, k);
        // console.log(k,o);

        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                    // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })


    })

    function publishArticle(fd) {
        $.ajax({
            method: "post",
            url: "/my/article/add",
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                location.href = 'art_list.html'
            }

        })
    }

})

//url: '/my/cate/list'