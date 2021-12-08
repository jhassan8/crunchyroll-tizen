var exit = {
  id: "exit-screen",
  previus: null,
  selected: false,
};

exit.init = function () {
  var exit_element = document.createElement("div");
  exit_element.id = exit.id;

  exit_element.innerHTML =
    '<div class="window">' +
    '  <div class="text">¿Queres salir de la aplicación?</div>' +
    '  <div class="buttons">' +
    '    <div class="button" id="exit-screen-yes">SI</div>' +
    '    <div class="button" id="exit-screen-no">NO</div>' +
    "  </div>" +
    "</div>";
  document.body.appendChild(exit_element);

  exit.previus = main.state;
  main.state = exit.id;
  exit.move(false);
};

exit.destroy = function () {
  document.body.removeChild(document.getElementById(this.id));
  main.state = exit.previus;
};

exit.keyDown = function (event) {
  switch (event.keyCode) {
    case tvKey.KEY_RETURN:
    case tvKey.KEY_PANEL_RETURN:
      widgetAPI.blockNavigation(event);
      exit.destroy();
      break;
    case tvKey.KEY_EXIT:
      widgetAPI.blockNavigation(event);
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
};

exit.move = function (selected) {
  exit.selected = selected;
  document.getElementById(exit.id + "-" + (selected ? "yes" : "no")).className =
    "button selected";
  document.getElementById(
    exit.id + "-" + (!selected ? "yes" : "no")
  ).className = "button";
};

exit.action = function (selected) {
  if (selected) {
    widgetAPI.sendExitEvent();
  } else {
    exit.destroy();
  }
};
