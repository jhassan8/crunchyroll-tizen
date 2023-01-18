var loading = {
  id: "loading-screen",
};

loading.init = function () {
  var loading_element = document.createElement("div");
  loading_element.id = loading.id;

  loading_element.innerHTML = `
  <div class="content">
    <div class="logo">
      <img src="server/img/logo.png" alt="">
    </div>
    <div class="loading">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>`;
  document.body.appendChild(loading_element);

  main.state = loading.id;
  translate.init();
};

loading.destroy = function () {
  document.body.removeChild(document.getElementById(this.id));
};

loading.keyDown = function (event) {
  switch (event.keyCode) {
    case tvKey.KEY_BACK:
    case tvKey.KEY_EXIT:
      tizen.application.getCurrentApplication().hide();
      break;
  }
};
