$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;
  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: "", // 文章分类的 Id
    state: "", // 文章的发布状态
  };

  // 定义补零的函数
  function padZero(n) {
    return n >= 9 ? n : "0" + n;
  }
  // 定义美化时间的过滤器

  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  // 获取文章列表数据的方法
  initTable();
  function initTable() {
    $.ajax({
      method: "get",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        console.log(res);
        if (res.code !== 0) {
          return layer.msg("获取文章列表失败");
        }
        layer.msg("获取文章列表成功");
        //模板引擎渲染页面
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        renderPage(res.total);
      },
    });
  }

  // 初始化文章分类的方法
  initCate();
  function initCate() {
    $.ajax({
      method: "get",
      url: "/my/cate/list",
      success: function (res) {
        console.log(res);
        if (res.code !== 0) {
          return layer.msg("获取分类数据失败！");
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template("tpl-cate", res);
        console.log(htmlStr);
        $("[name=cate_id]").html(htmlStr);
        // 通过 layui 重新渲染表单区域的UI结构
        form.render();
      },
    });
  }
  //为筛选表单绑定 submit 事件
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    // 获取表单中选中项的值
    var cate_id = $("[name=cate_id]").val();
    var state = $("[name=state]").val();
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id;
    q.state = state;
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable();
  });
  //定义渲染分页的方法
  function renderPage(total) {
    // console.log(total);
    laypage.render({
      elem: "pageBox", // 分页容器的 Id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 设置默认被选中的分页
      layout: ["count", "limit", "prev", "page", "naxt", "skip"],
      limits: [2, 3, 5, 10],
      // 分页发生切换的时候，触发 jump 回调
      jump: function (obj, first) {
        // console.log(obj.curr);
        // 把最新的页码值，赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        //首次不执行
        if (!first) {
          initTable();
        }
      },
    });
  }

  $('tbody').on('click', ".btn-delete", function () {
    // 获取删除按钮的个数
    var len = $(".btn-delete").length
     
    // 获取到文章的 id
    var id = $(this).attr("data-id")
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        method: 'DELETE',
        url: '/my/article/info?id=' + id,
        success: function (res) {
          if (res.code !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')

          if (len == 1) {
             // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
            // 页码值最小必须是 1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          initTable()
        }
      })

      layer.close(index)
    })
  })
});
//url: '/my/article/list'
//url: '/my/cate/list',$value.cate_name
//http://www.escook.cn:8086/index.html
