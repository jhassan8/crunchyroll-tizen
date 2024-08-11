window.menu = {
  id: "menu-screen",
  options: [
    {
      id: "profilesScreen",
      label: "menu.profiles",
      icon: "fa-solid fa-user",
      tool: true,
      action: "profilesScreen.init",
      hidden: true
    },
    {
      id: "search",
      label: "menu.search",
      icon: "fa-solid fa-magnifying-glass",
      action: "search.init",
    },
    {
      id: "home",
      label: "menu.home",
      icon: "fa-solid fa-house",
      action: "home.restart",
    },
    {
      id: "mylist",
      label: "menu.list",
      icon: "fa-solid fa-bookmark",
      action: "mylist.init",
    },
    {
      id: "historyScreen",
      label: "menu.history",
      icon: "fa-solid fa-clock-rotate-left",
      action: "historyScreen.init",
    },
    {
      id: "browse",
      label: "menu.browse",
      icon: "fa-regular fa-rectangle-list",
      action: "browse.init",
    },
    {
      id: "settings",
      label: "menu.settings",
      icon: "fa-solid fa-gear",
      tool: true,
      action: "settings.init",
    },
    {
      id: "logout",
      label: "menu.logout",
      icon: "fa-solid fa-sign-out",
      tool: true,
      event: "logout",
    },
  ],
  selected: 2,
  previous: NaN,
  isOpen: false,

  init: function (reset) {
    var menu_element = document.createElement("div");
    menu_element.id = this.id;

    var tool_options = "";
    var menu_options = "";

    menu.options.forEach((element, index) => {
      if (!element.hidden) {
        if (!!element.tool) {
          tool_options += `
          <a class="option ${
            reset && element.id === "settings"
              ? "selected"
              : index === menu.selected
              ? "selected"
              : ""
          }">
            <i class="${element.icon}"></i>
            <p>${translate.go(element.label)}</p>
          </a>`;
        } else {
          menu_options += `
          <a class="option ${
            !reset && index === menu.selected ? "selected" : ""
          }">
            <i class="${element.icon}"></i>
            <p>${translate.go(element.label)}</p>
          </a>`;
        }
      }
    });

    menu_element.innerHTML = `
    <div class="content">
      <div class="options">
        <div class="option profile ${session.storage.account.premium ? "premium" : ""}">
          <div class="avatar">
            <img src="https://static.crunchyroll.com/assets/avatar/170x170/${
              session.storage.account.avatar
            }">
          </div>
          <div class="profile-text">
            <div class="profile-name">
              <span id="active-profile-name">${session.get_active_profile_name()}</span>
              <i class="fa-solid fa-crown"></i>
            </div>
            <div class="profile-change">${translate.go('profiles.change')}</div>
          </div>
        </div>
        ${menu_options}
      </div>
      <div class="tools">
        ${tool_options}
      </div>
    </div>`;

    !document.getElementById(this.id) && document.body.appendChild(menu_element);
  },

  destroy: function () {
    if (menu.isOpen) {
      menu.close();
    }
    document.getElementById(this.id) &&
      document.body.removeChild(document.getElementById(this.id));
  },

  open: function () {
    menu.isOpen = true;
    $("body").addClass("open-menu");
    $(`#${menu.id} .option.selected`).addClass("focus");
    this.previous = main.state;
    main.state = this.id;
  },

  close: function () {
    menu.isOpen = false;
    $("body").removeClass("open-menu");
    $(`#${menu.id} .option`).removeClass("focus");
    main.state = this.previous;
  },

  move: function () {
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
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_RIGHT:
        menu.close();
        break;
      case tvKey.IS_KEY_BACK(event.keyCode):
        exit.init();
        break;
      case tvKey.KEY_UP:
        var options = $(`#${menu.id} .option`);
        var current = options.index($(`#${menu.id} .option.focus`));
        options.removeClass("focus");
        options.eq(current > 0 ? current - 1 : current).addClass("focus");
        break;
      case tvKey.KEY_DOWN:
        var options = $(`#${menu.id} .option`);
        var current = options.index($(`#${menu.id} .option.focus`));
        options.removeClass("focus");
        options
          .eq(current < options.length - 1 ? current + 1 : current)
          .addClass("focus");
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        var options = $(`#${menu.id} .option`);
        var current = options.index($(`#${menu.id} .option.focus`));
        if (menu.options[current].action) {
          var selected = options.index($(`#${menu.id} .option.selected`));
          options.removeClass("selected");
          options.eq(current).addClass("selected");
          this.previous = window[menu.options[current].id].id;
          window[menu.options[selected].id].destroy();
          test = menu.options[current].action.split(".");
          window[test[0]][test[1]]();
          menu.close();
        } else if (menu.options[current].event) {
          window.main.events[menu.options[current].event]();
        }
        break;
    }
  },
};
