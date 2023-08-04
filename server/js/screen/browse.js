window.browse = {
  id: "browse-screen",

  init: function () {
    var browse_element = document.createElement("div");
    browse_element.id = browse.id;

    loading.start();
    service.categories({
      success: function (response) {
        var elements = "";
        response.items.forEach((element) => {
          elements += `
          <li class="item">
            ${element.localization.title}
          </li>`;
        });

        browse_element.innerHTML = `
        <div class="content">
          <div id="browse-menu">
            <div class="title">Browse</div> 
            <div class="browse-content">
              <ul class="browse-content-wrapper">
                ${elements}
              </ul>
            </div>
          </div>
        </div>`;

        document.body.appendChild(browse_element);
        menu.destroy();
        loading.end();
      },
      error: function (error) {
        loading.end();
        console.log(error);
      },
    });
  },

  destroy: function () {
    document.body.removeChild(document.getElementById(browse.id));
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        break;
    }
  },
};
