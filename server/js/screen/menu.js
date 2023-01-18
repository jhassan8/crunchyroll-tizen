var menu = {
  id: "menu-screen",
  previus: null,
  selected: 0,
};

menu.init = function () {
  var menu_element = document.createElement("div");
  menu_element.id = this.id;

  menu_element.innerHTML =
    '<div class="' +
    this.id +
    '-option item list" value="Animes"></div>' +
    '<div class="' +
    this.id +
    '-option item list" value="Dramas"></div>' +
    '<div class="' +
    this.id +
    '-option item search" value="Buscar"></div>' +
    '<div id="' +
    this.id +
    '-title" class="title"></div>';
  document.body.appendChild(menu_element);

  this.move(this.selected);
  this.previus = main.state;
  main.state = this.id;
  translate.init();
};

menu.destroy = function () {
  document.body.removeChild(document.getElementById(this.id));
  main.state = this.previus;
};

menu.keyDown = function (event) {
  switch (event.keyCode) {
    case tvKey.KEY_BACK:
      //widgetAPI.blockNavigation(event);
      this.destroy();
      break;
    case tvKey.KEY_LEFT:
      this.move(this.selected == 0 ? 0 : this.selected - 1);
      break;
    case tvKey.KEY_RIGHT:
      this.move(this.selected == 2 ? 2 : this.selected + 1);
      break;
    case tvKey.KEY_ENTER:
    case tvKey.KEY_PANEL_ENTER:
      this.send();
      break;
  }
};

menu.move = function (selected) {
  this.selected = selected;
  var options = document.getElementsByClassName(this.id + "-option");
  for (var i = 0; i < options.length; i++) {
    options[i].className = options[i].className.replace(" selected", "");
    if (i == selected) {
      options[i].className = options[i].className + " selected";
      document.getElementById(this.id + "-title").innerText =
        options[i].getAttribute("value");
    }
  }
};

menu.send = function () {
  console.log("send");
  this.destroy();
};
