var menu = {
  id: "menu-screen",
  languages: [
    "N/A",
    "enUS",
    "esLA",
    "esES",
    "ptBR",
    "ptPT",
    "frFR",
    "deDE",
    "itIT",
    "ruRU",
  ],
  qualities: ["fhd", "hd", "sd", "auto"],
  option: { root: true, item: 0, selected: 0 },
  previus: null,
};

menu.initOptions = function () {
  menu.options = [
    {
      title: "Animes",
      icon: "list",
      action: function () {
        home.type = "anime";
        home.move.menu(0);
        menu.destroy();
      },
    },
    {
      title: "Dramas",
      icon: "list",
      action: function () {
        home.type = "drama";
        home.move.menu(0);
        menu.destroy();
      },
    },
    { title: "Quotes", icon: "quotes" },
    { title: "Search", icon: "search" },
    {
      title: "Settings",
      icon: "settings",
      childs: [
        {
          title: "Return",
          icon: "return",
          action: function () {
            menu.option = { root: true, item: 0, selected: 0 };
            menu.move();
          },
        },
        {
          title: "Quality",
          icon: `quality-${session.info.settings.quality}`,
          change: true,
          onChange: function (value) {
            var index = menu.qualities.indexOf(session.info.settings.quality);
            var newIndex =
              index + value > menu.qualities.length - 1 ? 0 : index + value;
            newIndex = newIndex < 0 ? menu.qualities.length - 1 : newIndex;
            session.info.settings.quality = menu.qualities[newIndex];
            session.update();
            this.icon = `quality-${session.info.settings.quality}`;
            menu.move();
          },
        },
        {
          title: "Subtitles",
          icon: "text",
          text: session.info.settings.subtitles,
          change: true,
          onChange: function (value) {
            var index = menu.languages.indexOf(session.info.settings.subtitles);
            var newIndex =
              index + value > menu.languages.length - 1 ? 0 : index + value;
            newIndex = newIndex < 0 ? menu.languages.length - 1 : newIndex;
            session.info.settings.subtitles = menu.languages[newIndex];
            session.update();
            this.text = session.info.settings.subtitles;
            menu.move();
          },
        },
        { title: "Logout", icon: "logout" },
        { title: "About", icon: "about" },
      ],
    },
  ];
};

menu.init = function () {
  menu.initOptions();
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
    }">${element.text ? element.text : ""}</div>`;
    if (this.option.selected === index) {
      document.getElementById(this.id + "-title").innerText = element.title;
    }
  });
  document.getElementById(`${menu.id}-options`).innerHTML = options;
};

menu.destroy = function () {
  document.body.removeChild(document.getElementById(this.id));
  this.option = { root: true, item: 0, selected: 0 };
  main.state = this.previus;
};

menu.keyDown = function (event) {
  switch (event.keyCode) {
    case tvKey.KEY_BACK:
      if (this.option.root) {
        this.destroy();
      } else {
        this.option = { root: true, item: 0, selected: 0 };
        this.move();
      }
      break;
    case tvKey.KEY_NEXT:
      this.destroy();
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
    case tvKey.KEY_UP:
      if (!menu.option.root) {
        if (
          menu.options[menu.option.item].childs[menu.option.selected].change
        ) {
          menu.options[menu.option.item].childs[menu.option.selected].onChange(
            1
          );
        }
      } else {
        if (menu.options[menu.option.selected].change) {
          menu.options[menu.option.selected].onChange(1);
        }
      }
      break;
    case tvKey.KEY_DOWN:
      if (!menu.option.root) {
        if (
          menu.options[menu.option.item].childs[menu.option.selected].change
        ) {
          menu.options[menu.option.item].childs[menu.option.selected].onChange(
            -1
          );
        }
      } else {
        if (menu.options[menu.option.selected].change) {
          menu.options[menu.option.selected].onChange(-1);
        }
      }
      break;
    case tvKey.KEY_ENTER:
    case tvKey.KEY_PANEL_ENTER:
      this.send();
      break;
  }
};

menu.send = function () {
  var option = menu.options[menu.option.selected];

  if (!menu.option.root) {
    menu.options[menu.option.item].childs[menu.option.selected].action();
  } else {
    if (menu.options[menu.option.selected].childs) {
      menu.option.root = false;
      menu.option.item = menu.option.selected;
      menu.option.selected = 0;
      menu.move();
    } else {
      option.action();
    }
  }
};
