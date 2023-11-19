window.home = {
  id: "home-screen",
  data: {
    main: NaN,
  },
  position: 0,
  fromCategory: {
    index: NaN,
    state: false,
  },

  init: function () {
    var home_element = document.createElement("div");
    home_element.id = home.id;

    var poster_items = ``;
    home.data.main.lists.forEach((element, index) => {
      if (element.items.length > 0) {
        poster_items += `
      <div class="row">
        <div class="row-title">${element.title}</div>
        <div class="row-content ${element.items[0].display}">`;
        element.items.forEach((item) => {
          poster_items += home.createItem(item);
        });
        for (var index = 0; index < 9; index++) {
          poster_items += home.createEmptyItem(element.items[0].display);
        }
        poster_items += `</div></div>`;
      }
    });

    home_element.innerHTML = `
    <div class="content">
      ${
        home.fromCategory.state
          ? `<div class="browse-back"><span></span><p>${home.fromCategory.title}</p></div>`
          : ""
      }
      <div class="details full">
        <div class="background">
          <img src="${home.data.main.banner.background}">
        </div>
        <div class="info">
          <div class="title resize">${home.data.main.banner.title}</div>
          <div class="description resize">${
            home.data.main.banner.description
          }</div>
          <div class="buttons">
            <a class="selected">${translate.go("home.banner.play")}</a>
            <a>${translate.go("home.banner.info")}</a>
          </div>
        </div>
      </div>
      <div class="rows">
        ${poster_items}
      </div>
      <div class="logo-fixed">
        <img src="server/img/logo-big.png"/>
      </div>
    </div>`;

    document.body.appendChild(home_element);

    $(`#${home.id} .rows`).slick({
      vertical: true,
      dots: false,
      arrows: false,
      infinite: false,
      slidesToShow: 1.5,
      slidesToScroll: 1,
      speed: 0,
      waitForAnimate: false,
    });

    $(`#${home.id} .rows .row-content`).not(".episode").slick({
      dots: false,
      arrows: false,
      infinite: false,
      slidesToShow: 9,
      slidesToScroll: 1,
      speed: 0,
      waitForAnimate: false,
    });

    $(`#${home.id} .rows .row-content.episode`).slick({
      dots: false,
      arrows: false,
      infinite: false,
      slidesToShow: 4.5,
      slidesToScroll: 1,
      speed: 0,
      waitForAnimate: false,
    });

    $(`#${home.id} .rows`)[0].slick.slickGoTo(0);
    $(`#${home.id} .rows .row-content`)[0].slick.slickGoTo(0);

    main.state = home.id;
    changelog.init();
  },

  destroy: function () {
    home.position = 0;
    document.body.removeChild(document.getElementById(home.id));
  },

  show_details: function () {
    var item =
      home.position > 0
        ? home.data.main.lists[home.position - 1].items[
            $(".row-content")[home.position - 1].slick.currentSlide
          ]
        : home.data.main.banner;
    $(".details .background img").attr("src", item.background);
    $(".details .info .title").text(item.title);
    $(".details .info .description").text(item.description);
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        if (!home.fromCategory.state) {
          menu.open();
        } else {
          home.destroy();
          browse.init(home.fromCategory.index);
        }
        break;
      case tvKey.KEY_NEXT:
        break;
      case tvKey.KEY_UP:
        $(".row-content").removeClass("selected");
        if (home.position > 1) {
          home.position--;
          $(".rows")[0].slick.slickGoTo(home.position - 1);
          $(".row-content")[home.position - 1].slick.slickGoTo(
            $(".row-content")[home.position - 1].slick.getCurrent()
          );
          $(".row-content")[home.position - 1].className =
            $(".row-content")[home.position - 1].className + " selected";
        } else {
          $(".details").addClass("full");
          home.position = 0;
        }
        home.show_details();
        break;
      case tvKey.KEY_DOWN:
        if (home.position > 0) {
          $(".row-content").removeClass("selected");
          home.position =
            home.position < home.data.main.lists.length
              ? home.position + 1
              : home.position;
          if (home.position <= home.data.main.lists.length) {
            $(".rows")[0].slick.slickGoTo(home.position - 1);
            $(".row-content")[home.position - 1].slick.slickGoTo(
              $(".row-content")[home.position - 1].slick.getCurrent()
            );
          }
          $(".row-content")[home.position - 1].className =
            $(".row-content")[home.position - 1].className + " selected";
        } else {
          $(".details.full").removeClass("full");
          var first_row = $(".row-content")[0];
          $(".rows")[0].slick.slickGoTo(0);
          first_row.slick.slickGoTo(first_row.slick.getCurrent());
          first_row.className = first_row.className + " selected";
          home.position++;
        }
        home.show_details();
        break;
      case tvKey.KEY_LEFT:
        if (home.position > 0) {
          if ($(".row-content")[home.position - 1].slick.currentSlide === 0) {
            if (!home.fromCategory.state) {
              menu.open();
            } else {
              home.destroy();
              browse.init(home.fromCategory.index);
            }
          } else {
            $(".row-content")[home.position - 1].slick.prev();
            home.show_details();
          }
        } else {
          var buttons = $(".details .buttons a");
          var current = buttons.index($(`.details .buttons a.selected`));
          if (current === 0) {
            if (!home.fromCategory.state) {
              menu.open();
            } else {
              home.destroy();
              browse.init(home.fromCategory.index);
            }
          } else {
            buttons.removeClass("selected");
            buttons
              .eq(current > 0 ? current - 1 : current)
              .addClass("selected");
          }
        }
        break;
      case tvKey.KEY_RIGHT:
        if (home.position > 0) {
          var currentList = home.data.main.lists[home.position - 1];
          var currentSlide = $(".row-content")[home.position - 1];

          if (currentSlide.slick.currentSlide < currentList.items.length - 1) {
            if (home.fromCategory.state && currentList.lazy) {
              if (
                currentList.items.length > 15 &&
                currentSlide.slick.currentSlide > currentList.items.length - 10
              ) {
                currentList.lazy = false;
                loading.start();
                mapper.loadCategoryListAsync(
                  `${home.data.main.category},${currentList.id}`,
                  currentList.items.length,
                  20,
                  home.position - 1,
                  {
                    success: function (response, index) {
                      home.data.main.lists[index].lazy =
                        response.items.length === 20;
                      home.addToList(index, mapper.mapItems(response.items));
                      loading.end();
                    },
                    error: function (error) {
                      console.log(error);
                      loading.end();
                    },
                  }
                );
              }
            }
            currentSlide.slick.next();
            home.show_details();
          }
        } else {
          var buttons = $(".details .buttons a");
          var current = buttons.index($(`.details .buttons a.selected`));
          buttons.removeClass("selected");
          buttons
            .eq(current < buttons.length - 1 ? current + 1 : current)
            .addClass("selected");
        }
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        var item =
          home.position > 0
            ? home.data.main.lists[home.position - 1].items[
                $(".row-content")[home.position - 1].slick.currentSlide
              ]
            : home.data.main.banner;
        home_details.init(item);
        break;
    }
  },

  restart: function () {
    home.fromCategory.state = false;
    home.fromCategory.index = NaN;
    loading.start();
    home.data.main = null;
    service.home({
      success: function (response) {
        mapper.home(response, {
          success: function () {
            home.init();
            loading.end();
          },
        });
      },
      error: function (error) {
        loading.end();
        console.log(error);
      },
    });
  },

  addToList: function (index, newItems) {
    var itemsCount = home.data.main.lists[index].items.length;
    var currentSlide = $(".row-content")[home.position - 1];
    home.data.main.lists[index].items =
      home.data.main.lists[index].items.concat(newItems);

    // remove empty items for prevent move error
    for (var index = 0; index < 9; index++) {
      currentSlide.slick.slickRemove(itemsCount + 8 - index);
    }

    // added new items
    newItems.forEach((element) =>
      currentSlide.slick.slickAdd(home.createItem(element))
    );

    // added empty items for prevent move error
    for (var index = 0; index < 9; index++) {
      currentSlide.slick.slickAdd(home.createEmptyItem(newItems[0].display));
    }
  },

  createItem: function (item) {
    var playhead = item.playhead
      ? `<div class="progress" style="width: ${
          (item.playhead * 100) / item.duration
        }%" value="${item.duration - item.playhead}m"></div>`
      : "";
    return `
    <div class="item">
      <div class="poster ${item.display}">
        ${
          item.display !== "serie"
            ? '<img src="' + item.background + '">' + playhead
            : '<img src="' + item.poster + '">'
        }
      </div>
    </div>`;
  },

  createEmptyItem: function (type) {
    return `
    <div class="item">
      <div class="poster ${type}">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">
      </div>
    </div>`;
  },
};
