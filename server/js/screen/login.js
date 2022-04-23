var login = {
  id: "login-screen",
  selected: 0,
};

login.init = function () {
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
          <input type="text" placeholder="Enter user...">
        </div>
        <div class="input ${login.id}-option">
          <input type="text" type="password" placeholder="Enter password...">
        </div>
        <a class="button ${login.id}-option">LOGIN</a>
      </div>
    </div>
  </div>`;
  document.body.appendChild(login_element);

  login.move(login.selected);
  main.state = login.id;
};

login.destroy = function () {
  document.body.removeChild(document.getElementById(this.id));
};

login.keyDown = function (event) {
  switch (event.keyCode) {
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
};

login.move = function (selected) {
  login.selected = selected;
  var options = document.getElementsByClassName(login.id + "-option");
  for (var i = 0; i < options.length; i++) {
    options[i].className = options[i].className.replace(" focus", "");
    if (i == selected) {
      options[i].className = options[i].className + " focus";
    }
  }
};

login.action = function (selected) {
  var options = document.getElementsByClassName(login.id + "-option");
  if (selected == 2) {
    if (options[0].value.length < 3 || options[1].value.length < 3) {
      console.log("Enter valid credentials...");
    } else {
      var username = options[0].value;
      var password = options[1].value;
      loading.init();
      this.destroy();
      service.login({
        data: {
          username: username,
          password: password,
          mac: main.mac,
        },
        success: function (data) {
          main.setToken(data.token);
          main.events.home();
        },
        error: function () {
          loading.destroy();
          login.init();
        },
      });
    }
  } else {
    keyboard.init(options[selected]);
  }
};
