var loading = {
  id: "loading-screen",
  timer: null,
};

loading.init = function () {
  var loading_element = document.createElement("div");
  loading_element.id = loading.id;

  loading_element.innerHTML =
    '<div class="content"><div class="logo"></div>' +
    '<img id="' +
    loading.id +
    '-progress"/></div>';
  document.body.appendChild(loading_element);
  loading.animate(1);

  main.state = loading.id;
};

loading.destroy = function () {
  clearTimeout(loading.timer);
  document.body.removeChild(document.getElementById(this.id));
};

loading.keyDown = function (event) {
  switch (event.keyCode) {
    case tvKey.KEY_RETURN:
    case tvKey.KEY_PANEL_RETURN:
      widgetAPI.blockNavigation(event);
      exit.init();
      break;
  }
};

loading.animate = function (index) {
  document.getElementById(loading.id + "-progress").src =
    main.urls.src + "loading/frame_" + index + ".png";
  index++;
  if (index > 18) index = 1;
  loading.timer = setTimeout("loading.animate(" + index + ");", 50);
};
