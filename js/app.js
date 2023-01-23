var app = {
  state: false,
};

window.loggertest = function (text) {
  let timer = new Date();
  let linelog = document.createElement("p");
  linelog.innerText = timer.toLocaleTimeString() + "- " + text;
  let consolelog = document.getElementById("console");
  consolelog.appendChild(linelog);
};

window.onload = function () {
  if (typeof main != "undefined") {
    app.state = true;
    main.init();
  } else {
    app.initError();
  }
};

app.initError = function () {
  app.state = false;
  document.getElementById("error-screen").style.display = "flex";
};

window.onunload = function () {
  if (app.state) main.destroy();
};

app.keyDown = function (e) {
  if (app.state) main.keyDown(e);
  else {
    switch (e.keyCode) {
      case tvKey.KEY_BACK:
      case tvKey.KEY_EXIT:
        tizen.application.getCurrentApplication().hide();
        break;
    }
  }
};
