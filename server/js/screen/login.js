window.login = {
  id: "login-screen",
  selected: 0,

  init: function () {
    var login_element = document.createElement("div");
    login_element.id = login.id;

    login_element.innerHTML = `
  <div class="content">
    <div class="box">
      <div class="logo">
        <img src="server/img/logo-big.png" alt="">
      </div>
      <div class="form">
        <div class="input ${login.id}-option">
          <input type="text" placeholder="${translate.go('login.username')}">
        </div>
        <div class="input ${login.id}-option">
          <input type="password" placeholder="${translate.go('login.password')}">
        </div>
        <a class="button ${login.id}-option" translate>${translate.go('login.enter')}</a>
      </div>
    </div>
  </div>`;
    document.body.appendChild(login_element);

    login.move(login.selected);
    main.state = login.id;
  },

  destroy: function () {
    document.body.removeChild(document.getElementById(this.id));
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
        case tvKey.KEY_ESCAPE:
          exit.init();
          break;
      case tvKey.KEY_UP:
        login.move(login.selected == 0 ? 0 : login.selected - 1);
        break;
      case tvKey.KEY_DOWN:
        login.move(login.selected == 2 ? 2 : login.selected + 1);
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        login.action(this.selected);
        break;
    }
  },

  move: function (selected) {
    login.selected = selected;
    var options = document.getElementsByClassName(login.id + "-option");
    for (var i = 0; i < options.length; i++) {
      options[i].className = options[i].className.replace(" focus", "");
      if (i == selected) {
        options[i].className = options[i].className + " focus";
      }
    }
  },

  action: function (selected) {
    var options = document.getElementsByClassName(login.id + "-option");
    if (selected == 2) {
      var username = options[0].firstElementChild.value;
      var password = options[1].firstElementChild.value;
      if (username.length < 3 || password.length < 3) {
        console.log("Enter valid credentials...");
      } else {
        login.destroy();
        loading.init();
        session.start(username, password, {
          success: function () {
            main.events.login();
          },
          error: function () {
            loading.destroy();
            login.init();
          },
        });
      }
    } else {
      keyboard.init(options[selected].firstElementChild);
    }
  },
};
