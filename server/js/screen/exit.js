var exit = {
  id: "exit-screen",
  previous: null,
  selected: false,
};

exit.init = function () {
  var exit_element = document.createElement("div");
  exit_element.id = exit.id;

  exit_element.innerHTML =
    '<div class="content">' +
    '  <div class="window">' +
    '    <div class="text">Do you want to exit the application?</div>' +
    '    <div class="buttons">' +
    '      <div class="button" id="exit-screen-yes">YES</div>' +
    '      <div class="button" id="exit-screen-no">NO</div>' +
    "    </div>" +
    "  </div>" +
    "</div>";
  document.body.appendChild(exit_element);

  exit.previous = main.state;
  main.state = exit.id;
  exit.move(false);
  //translate.init();
};

exit.destroy = function () {
  document.body.removeChild(document.getElementById(this.id));
  main.state = exit.previous;
};

exit.keyDown = function (event) {
  switch (event.keyCode) {
    case tvKey.KEY_BACK:
      case 27:
      //widgetAPI.blockNavigation(event);
      exit.destroy();
      break;
    case tvKey.KEY_EXIT:
      //widgetAPI.blockNavigation(event);
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
    tizen.application.getCurrentApplication().exit();
    //widgetAPI.sendExitEvent();
  } else {
    exit.destroy();
  }
};
