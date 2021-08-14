function getUserInfo() {
  let layer = layui.layer;
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    // headers: {
    //   Authorization: localStorage.getItem("token") || "",
    // },
    success: function (res) {
      console.log(res);
      if (res.code !== 0) {
        return layer.msg("获取用户信息失败！");
      }
      layer.msg("获取用户信息成功！");
      renderAvatar(res.data);
    },
    complete: function (res) {
      console.log(res);
      //   if (res.responseJSON.code === 1) {
      //     //强制清空token
      //     localStorage.removeItem("token");
      //     //强制跳转登录页面
      //     location.href = "/login.html";
      //   }
    },
  });
}

$(function () {
  getUserInfo();
  var layer = layui.layer;

  // 点击按钮，实现退出功能
  $("#btnLogout").on("click", function () {
    // 提示用户是否确认退出
    layer.confirm(
      "确定退出登录?",
      { icon: 3, title: "提示" },
      function (index) {
        //do something
        // 1. 清空本地存储中的 token
        localStorage.removeItem("token");
        // 2. 重新跳转到登录页面
        location.href = "/login.html";

        // 关闭 confirm 询问框
        layer.close(index);
      }
    );
  });
});

// 渲染用户的头像
function renderAvatar(user) {
  console.log(user);
  // 1. 获取用户的名称
  var name = user.nickname || user.username;
  // 2. 设置欢迎的文本
  $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
  // 3. 按需渲染用户的头像
  if (user.user_pic !== null) {
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    // 3.2 渲染文本头像
    $(".layui-nav-img").hide();
    var first = name[0].toUpperCase();
    $(".text-avatar").html(first).show();
  }
}
