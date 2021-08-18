$(function () {
  var layer = layui.layer;
  let form = layui.form;
  getArticle();
  function getArticle() {
    $.ajax({
      method: "get",
      url: "/my/cate/list",
      success: function (res) {
        // console.log(res);
        var htmlstr = template("tpl", res);
        $("tbody").html(htmlstr);
      },
    });
  }

  var indexAdd = null;
  $("#btnAdd").on("click", function () {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#dialog-add").html(),
    });
  });
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();
    $.ajax({
      method: "post",
      url: "/my/cate/add",
      data: $(this).serialize(),
      success: function (res) {
        if (res.code !== 0) {
          return layer.msg("增添分类失败");
        }
        layer.msg("增添分类成功");
        getArticle();
        layer.close(indexAdd);
      },
    });
  });

  var indexEdit = null;
  //通过 代理 的形式，为 btn-edit 按钮绑定点击事件：
  $("tbody").on("click", ".btn-edit", function (e) {
    //修改文章分类信息的层
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章分类",
      content: $("#dialog-edit").html(),
    });
    var id = $(this).attr("data-id");
    // console.log(id);
    //获取分类数据
    $.ajax({
      method: "get",
      url: "/my/cate/info?id=" + id,
      success: function (res) {
        console.log(res);
        form.val("form-edit", res.data);
      },
    });
  });

  //通过代理的形式，为修改分类的表单绑定 submit 事件：

  $("body").on("submit", "#form-edit", function (e) {
    console.log($(this).serialize());
    e.preventDefault();
    $.ajax({
      method: "PUT",
      url: "/my/cate/info",
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.code !== 0) {
          return layer.msg("更新分类数据失败");
        }
        layer.msg("更新分类数据成功");
        getArticle();
        layer.close(indexEdit);
      },
    });
  });
  //删除文章
  $("tbody").on("click", ".btn-delete", function () {
    var id = $(this).attr("data-id");
    // 提示用户是否要删除
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "delete",
        url: "/my/cate/del?id=" + id,
        success: function (res) {
          if (res.code !== 0) {
            return layer.msg("删除分类失败！");
          }
          layer.msg("删除分类成功！");
          layer.close(index);
          getArticle();
        },
      });
    });
  });
});
//请求接口：/my/cate/list

// 返回数据cate_name   cate_alias
///my/cate/add

//url: '/my/cate/info?id=' + id,
//修改分类  ‘PUT’  url：'/my/cate/info'

// method: 'delete',

// url: '/my/cate/del?id=' + id,
