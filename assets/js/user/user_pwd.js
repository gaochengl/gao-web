$(function () {
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    somePwd: function (value) {
      if (value === $("[name=old_pwd]").val()) {
        return "旧密码和新密码不能一致！";
      }
    },
    rePwd: function (value) {
      if (value === $("[name=new_pwd]").val()) {
        return "两次密码不一致！";
      }
    },
  });

  //更新密码
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "patch",
      url: "/my/updatepwd",
      data: $(this).serialize(),
      success: function (res) {
        if (res.code !== 0) {
          return layui.layer.msg("更新密码失败！");
        }
        layui.layer.msg("更新密码成功！");
        $(".layui-form").reset();
      },
    });
  });
});
///my/updatepwd   patch
