var menu = {
  id: "menu-screen",
  options: [
    { id: 'search', label: "Search", icon: "fa-solid fa-magnifying-glass", action: search.init},
    { id: 'home', label: "Home", icon: "fa-solid fa-house", action: home.init },
    { id: 'list', label: "My list", icon: "fa-solid fa-bookmark" },
    { id: 'history', label: "History", icon: "fa-solid fa-clock-rotate-left" },
    { id: 'browse', label: "Browse", icon: "fa-regular fa-rectangle-list" },
  ],
  selected: 1,
  previous: NaN,
};

menu.init = function () {
  var menu_element = document.createElement("div");
  menu_element.id = this.id;

  var menu_options = "";

  menu.options.forEach((element, index) => {
    menu_options += `
    <a class="option ${index === menu.selected ? "selected" : ""}">
      <i class="${element.icon}"></i>
      <p>${element.label}</p>
    </a>`;
  });

  menu_element.innerHTML = `
  <div class="content">
    <div class="profile ${session.storage.account.premium ? "premium" : ""}">
      <div class="avatar">
        <img src="https://static.crunchyroll.com/assets/avatar/170x170/${
          session.storage.account.avatar
        }">
      </div>
      <p>${session.storage.account.username}</p>
      <i class="fa-solid fa-crown"></i>
    </div>
    <div class="options">
      ${menu_options}
    </div>
    <div class="tools">
      <a class="option">
        <i class="fa-solid fa-gear"></i>
        <p>Settings</p>
      </a>
    </div>
  </div>`;

  document.body.appendChild(menu_element);
};

menu.destroy = function () {
  document.body.removeChild(document.getElementById(this.id));
  main.state = this.previous;
};

menu.open = function () {
  $("body").addClass("open-menu");
  $(`#${menu.id} .option.selected`).addClass("focus");
  this.previous = main.state;
  main.state = this.id;
};

menu.close = function () {
  $("body").removeClass("open-menu");
  $(`#${menu.id} .option`).removeClass("focus");
  main.state = this.previous;
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

menu.keyDown = function (event) {
  switch (event.keyCode) {
    case tvKey.KEY_BACK:
    case tvKey.KEY_RIGHT:
    case 27:
      menu.close();
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
      if(menu.options[current].action) {
        var selected = options.index($(`#${menu.id} .option.selected`));
        options.removeClass("selected");
        options.eq(current).addClass("selected");
        this.previous = window[menu.options[current].id].id;
        window[menu.options[selected].id].destroy();
        menu.options[current].action();
        menu.close();
      }
      break;
  }
};
