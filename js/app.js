var app = {
  state: false,
};

window.onload = function () {
  app.initError();
};

app.initError = function () {
  app.state = false;
  document.getElementById("error-screen").style.display = "flex";
};

window.onunload = function () {};

app.keyDown = function (e) {
  switch (e.keyCode) {
    case tvKey.KEY_RETURN:
    case tvKey.KEY_EXIT:
      tizen.application.getCurrentApplication().hide();
      break;
  }
};
