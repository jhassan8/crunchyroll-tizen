var home = {
  id: "home-screen",
  data: {
    main: NaN,
  },
};

home.init = function () {
  menu.init();
  var home_element = document.createElement("div");
  home_element.id = home.id;

  home_element.innerHTML = `
  <div class="content">
  </div>`;

  document.body.appendChild(home_element);
  main.state = home.id;
};

home.destroy = function () {
  document.body.removeChild(document.getElementById(home.id));
};

home.keyDown = function (event) {
  switch (event.keyCode) {
    case tvKey.KEY_BACK:
    case 27:
      menu.open();
      break;
    case tvKey.KEY_NEXT:
      break;
    case tvKey.KEY_UP:
      break;
    case tvKey.KEY_DOWN:
      break;
    case tvKey.KEY_LEFT:
      break;
    case tvKey.KEY_RIGHT:
      break;
    case tvKey.KEY_ENTER:
    case tvKey.KEY_PANEL_ENTER:
      break;
  }
};
