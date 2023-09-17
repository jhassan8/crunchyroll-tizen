window.exit = {
  id: "exit-screen",
  previous: null,
  selected: false,
  logout: false,

  init: function (logout) {
    var exit_element = document.createElement("div");
    exit_element.id = exit.id;
    exit.logout = logout;

    exit_element.innerHTML =
      '<div class="content">' +
      '  <div class="window">' +
      `    <div class="text">${translate.go(`exit.message${exit.logout ? "_logout" : ""}`)}` +
      '    <div class="buttons">' +
      `      <div class="button" id="exit-screen-yes">${translate.go('exit.yes')}</div>` +
      `      <div class="button" id="exit-screen-no">${translate.go('exit.no')}</div>` +
      "    </div>" +
      "  </div>" +
      "</div>";
    document.body.appendChild(exit_element);

    exit.previous = main.state;
    main.state = exit.id;
    exit.move(false);
  },

  destroy: function () {
    document.body.removeChild(document.getElementById(this.id));
    main.state = exit.previous;
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        exit.destroy();
        break;
      case tvKey.KEY_EXIT:
        exit.destroy();
        break;
      case tvKey.KEY_LEFT:
        exit.move(true);
        break;
      case tvKey.KEY_RIGHT:
        exit.move(false);
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        exit.action(exit.selected);
        break;
    }
  },

  move: function (selected) {
    exit.selected = selected;
    document.getElementById(
      exit.id + "-" + (selected ? "yes" : "no")
    ).className = "button selected";
    document.getElementById(
      exit.id + "-" + (!selected ? "yes" : "no")
    ).className = "button";
  },

  action: function (selected) {
    if (selected) {
      if (exit.logout) {
        session.clear();
      }
      tizen.application.getCurrentApplication().exit();
    } else {
      exit.destroy();
    }
  },
};
