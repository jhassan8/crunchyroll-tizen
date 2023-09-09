window.browse = {
  id: "browse-screen",
  data: {
    categories: [],
    main: [],
  },

  init: function (selected) {
    var browse_element = document.createElement("div");
    browse_element.id = browse.id;

    loading.start();
    service.categories({
      success: function (response) {
        browse.data.categories = response.items;
        var elements = "";
        browse.data.categories.forEach((element, index) => {
          elements += `
          <li class="item${index === (selected || 0) ? " focus" : ""}">
            <img src="${element.images.low[0].source}"/>
            ${element.localization.title}
          </li>`;
        });

        browse_element.innerHTML = `
        <div class="content">
          <img id="browse-background"/>
          <div id="browse-menu">
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
        browse.move("down");
        browse.move("up");
      },
      error: function (error) {
        loading.end();
        console.log(error);
      },
    });
    main.state = browse.id;
  },

  destroy: function () {
    document.body.removeChild(document.getElementById(browse.id));
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        browse.destroy();
        menu.init();
        home.restart();
        break;
      case tvKey.KEY_UP:
        browse.move("up");
        break;
      case tvKey.KEY_DOWN:
        browse.move("down");
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        var options = $(".browse-content .item");
        var current =
          browse.data.categories[
            options.index($(".browse-content .item.focus"))
          ];

        loading.start();
        home.data.main = null;
        mapper.listByCategories(
          current.tenant_category,
          current.sub_categories,
          {
            success: function () {
              var options = $(".browse-content .item");
              var current = options.index($(".browse-content .item.focus"));
              loading.end();
              home.fromCategory.state = true;
              home.fromCategory.index = current;
              home.init();
              browse.destroy();
            },
          }
        );
        break;
    }
  },

  getCurrent: function () {},

  move: function (direction) {
    var options = $(".browse-content .item");
    var current = options.index($(".browse-content .item.focus"));

    options.removeClass("focus");

    if (direction === "up") {
      var newCurrent = current > 0 ? current - 1 : current;
    } else {
      var newCurrent = current < options.length - 1 ? current + 1 : current;
    }

    options.eq(newCurrent).addClass("focus");
    $("#browse-background").attr(
      "src",
      browse.data.categories[newCurrent].images.background[4].source
    );

    var marginTop = 0;
    var max = 9;
    if (options.length > max && newCurrent > max - 1) {
      marginTop = -((newCurrent - (max - 1)) * 110);
    }

    $(".browse-content-wrapper")[0].style.marginTop = `${marginTop}px`;
  },
};
