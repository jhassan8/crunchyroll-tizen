var menu = {
  id: "menu-screen",
  options: [
    { title: "Animes", icon: "list" },
    { title: "Dramas", icon: "list" },
    { title: "Quotes", icon: "quotes" },
    { title: "Search", icon: "search" },
    {
      title: "Settings",
      icon: "settings",
      childs: [
        { title: "Return", icon: "return" },
        { title: "Quality", icon: `quality-${session.info.settings.quality}` },
        { title: "Subtitles", text: session.info.settings.subtitles },
        { title: "Logout", icon: "logout" },
        { title: "About", icon: "about" },
      ],
    },
  ],
  option: { root: true, item: 0, selected: 0 },
  previus: null,
};

menu.init = function () {
  var menu_element = document.createElement("div");
  menu_element.id = this.id;

  menu_element.innerHTML = `<div class="content">
    <div class="window">
      <div id="${menu.id}-options"></div>
      <div id="${menu.id}-title"></div>
    </div>
  </div>`;

  document.body.appendChild(menu_element);

  this.move();
  this.previus = main.state;
  main.state = this.id;
  //translate.init();
};

menu.move = function () {
  var options = "";
  (menu.option.root
    ? menu.options
    : menu.options[menu.option.item].childs
  ).forEach((element, index) => {
    options += `<div class="option ${element.icon}${
      this.option.selected === index ? " selected" : ""
    }"></div>`;
    if (this.option.selected === index) {
      document.getElementById(this.id + "-title").innerText = element.title;
    }
  });
  document.getElementById(`${menu.id}-options`).innerHTML = options;
};

menu.destroy = function () {
  document.body.removeChild(document.getElementById(this.id));
  main.state = this.previus;
};

menu.keyDown = function (event) {
  switch (event.keyCode) {
    case tvKey.KEY_BACK:
      if (this.option.root) {
        this.destroy();
      } else {
        this.option.root = true;
        this.move();
      }
      break;
    case tvKey.KEY_LEFT:
      this.option.selected =
        this.option.selected == 0 ? 0 : this.option.selected - 1;
      this.move();
      break;
    case tvKey.KEY_RIGHT:
      this.option.selected =
        this.option.selected == 4 ? 4 : this.option.selected + 1;
      this.move();
      break;
    case tvKey.KEY_ENTER:
    case tvKey.KEY_PANEL_ENTER:
      this.send();
      break;
  }
};

// menu.move = function (selected) {
//   this.selected = selected;
//   var options = document.getElementsByClassName(this.id + "-option");
//   for (var i = 0; i < options.length; i++) {
//     options[i].className = options[i].className.replace(" selected", "");
//     if (i == selected) {
//       options[i].className = options[i].className + " selected";
//       document.getElementById(this.id + "-title").innerText =
//         options[i].getAttribute("value");
//     }
//   }
// };

menu.send = function () {
  console.log("send");
  this.destroy();
};
