window.loading = {
  id: "loading-screen",
  active: false,

  start: function () {
    if(!document.getElementById(loading.id)) {
      loading.active = true;
      var loading_element = document.createElement("div");
      loading_element.id = loading.id;
      loading_element.className = "flat";
      loading_element.innerHTML = `
      <div class="content flat">
        <div class="loading"></div>
      </div>`;
      document.body.appendChild(loading_element);
    }
    loading.active = true;
  },

  end: function () {
    document.getElementById(loading.id) &&
      document.body.removeChild(document.getElementById(this.id));
    loading.active = false;
  },

  init: function () {
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
    //translate.init();
  },

  destroy: function () {
    document.body.removeChild(document.getElementById(this.id));
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case tvKey.KEY_EXIT:
      case 27:
        tizen.application.getCurrentApplication().hide();
        break;
    }
  },
};
