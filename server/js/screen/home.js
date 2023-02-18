var home = {
  id: "home-screen",
  data: {
    main: NaN,
  },
  position: 0,
};

home.init = function () {
  var home_element = document.createElement("div");
  home_element.id = home.id;

  home_element.innerHTML = `
  <div class="content">
    <div class="details full">
      <div class="background">
        <img src="${home.data.main.banner.background}">
      </div>
      <div class="info">
        <div class="title resize">${home.data.main.banner.title}</div>
        <div class="description resize">${home.data.main.banner.description}</div>
        <div class="buttons">
          <a class="selected">Reproducir</a>
          <a>Mas Informacion</a>
        </div>
      </div>
    </div>
  </div>`;

  document.body.appendChild(home_element);
  menu.init();
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
      if (home.position > 0) {
      } else {
        var buttons = $(".details .buttons a");
        var current = buttons.index($(`.details .buttons a.selected`));
        buttons.removeClass("selected");
        buttons.eq(current > 0 ? current - 1 : current).addClass("selected");
      }
      break;
    case tvKey.KEY_RIGHT:
      if (home.position > 0) {
      } else {
        var buttons = $(".details .buttons a");
        var current = buttons.index($(`.details .buttons a.selected`));
        buttons.removeClass("selected");
        buttons
          .eq(current < buttons.length - 1 ? current + 1 : current)
          .addClass("selected");
      }
      break;
    case tvKey.KEY_ENTER:
    case tvKey.KEY_PANEL_ENTER:
      break;
  }
};
