$(function () {
  $.ajaxPrefilter(function (options) {
    options.url = "http://www.liulongbin.top:3008" + options.url;
  });
});
