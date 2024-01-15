window.mylist = {
  id: "mylist-screen",
  previous: NaN,
  data: {
    loadedLists: 0,
    lists: [],
  },
  selectedRow: 0,

  init: function () {
    var mylist_element = document.createElement("div");
    mylist_element.id = mylist.id;
    loading.start();
    mylist.loadLists({
      success: function () {
        mylist_element.innerHTML = `
        <div class="content">
          <div class="details">
            <div class="background">
              <img id="generic-background"/>
            </div>
            <div class="information">
              <div id="generic-title"></div>
              <div id="generic-description"></div>
              <div class="extra-info"></div>
            </div>
          </div>
          <div class="lists">
            <div class="inner-lists">
              ${mylist.generateLists()}
              <div class="list-end">
                <img src="server/img/empty_data.png"/>
                <div class="text">${translate.go("lists.empty")}</div>
              </div>
            </div>
          </div>
          <div class="logo-fixed">
            <img src="server/img/logo-big.png"/>
          </div>
        </div>`;

        document.body.appendChild(mylist_element);

        $(`#${mylist.id} .lists .row-content`).slick({
          dots: false,
          arrows: false,
          infinite: false,
          slidesToShow: 6.5,
          slidesToScroll: 1,
          speed: 150,
        });
        mylist.details();
        loading.end();
      },
      error: function (error) {
        console.log(error);
        mylist_element.innerHTML = `
        <div class="content">
          error
          <div class="logo-fixed">
            <img src="server/img/logo-big.png"/>
          </div>
        </div>`;
        document.body.appendChild(mylist_element);
        loading.end();
      },
    });
  },

  destroy: function () {
    mylist.data.lists = [];
    mylist.data.loadedLists = 0;
    mylist.selectedRow = 0;
    document.body.removeChild(document.getElementById(mylist.id));
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case tvKey.KEY_ESCAPE:
        menu.open();
        break;
      case tvKey.KEY_UP:
        var options = $(`.row`);
        var current = mylist.selectedRow;

        options.removeClass("selected");
        var newCurrent = current > 0 ? current - 1 : current;
        options.eq(newCurrent).addClass("selected");
        mylist.selectedRow = newCurrent;
        var marginTop = 0;
        var max = 1;
        if (options.length > max && newCurrent > max - 1) {
          marginTop = -((newCurrent - (max - 1)) * 235);
        }

        $(".inner-lists")[0].style.marginTop = `${marginTop}px`;
        mylist.details();
        break;
      case tvKey.KEY_DOWN:
        // -235px
        var options = $(`.row`);
        var current = mylist.selectedRow;

        options.removeClass("selected");
        var newCurrent = current < options.length - 1 ? current + 1 : current;
        options.eq(newCurrent).addClass("selected");
        mylist.selectedRow = newCurrent;

        var marginTop = 0;
        var max = 1;
        if (options.length > max && newCurrent > max - 1) {
          marginTop = -((newCurrent - (max - 1)) * 235);
        }

        $(".inner-lists")[0].style.marginTop = `${marginTop}px`;
        mylist.details();
        break;
      case tvKey.KEY_LEFT:
        if (
          $(".row-content").length === 0 ||
          $(".row-content")[mylist.selectedRow].slick.currentSlide === 0
        ) {
          menu.open();
        } else {
          $(".row-content")[mylist.selectedRow].slick.prev();
          mylist.details();
        }
        break;
      case tvKey.KEY_RIGHT:
        if (
          $(".row-content")[mylist.selectedRow].slick.currentSlide <
          mylist.data.lists[mylist.selectedRow].items.length - 1
        ) {
          $(".row-content")[mylist.selectedRow].slick.next();
          mylist.details();
        }
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        var item =
          mylist.data.lists[mylist.selectedRow].items[
            $(".row-content")[mylist.selectedRow].slick.currentSlide
          ];
        home_details.init(
          item,
          function (item) {
            var home_element = document.createElement("div");
            home_element.id = home.id;
            home_element.innerHTML = `
            <div class="content">
              <div class="details full">
                <div class="background">
                  <img src="${item.background}">
                </div>
                <div class="info">
                  <div class="title resize">${item.title}</div>
                  <div class="description resize">${item.description}</div>
                  <div class="buttons">
                    <a class="selected">${translate.go("home.banner.play")}</a>
                    <a>${translate.go("home.banner.info")}</a>
                  </div>
                </div>
              </div>
              <div class="logo-fixed">
                <img src="server/img/logo-big.png"/>
              </div>
            </div>`;

            document.getElementById(mylist.id).style.display = "none";
            document.body.appendChild(home_element);
          },
          function () {
            document.getElementById(mylist.id).style.display = "block";
            home.destroy();
          }
        );
        break;
    }
  },

  loadLists: function (callback) {
    service.getCustomLists({
      success: function (responseList) {
        listToFetch = [
          {
            order: 0,
            title: "lists.watchlist",
            method: "getWatchList",
          },
        ];

        responseList.data.forEach((customList, index) => {
          listToFetch.push({
            order: index + 1,
            title: customList.title,
            method: "getCustomListItems",
            data: customList.list_id,
          });
        });

        listToFetch.forEach((item) => {
          service[item.method]({
            data: item.data,
            success: function (responseItems) {
              mylist.data.loadedLists++;

              if (responseItems.data.length > 0) {
                mylist.data.lists.push({
                  order: item.order,
                  title: item.title,
                  items: mapper.mapItems(responseItems.data),
                });
              }

              if (mylist.data.loadedLists === listToFetch.length) {
                mylist.data.lists.sort(function (a, b) {
                  return a.order - b.order;
                });
                callback.success();
              }
            },
            error: function (error) {
              console.log(error);
            },
          });
        });
      },
      error: function (error) {
        callback.error(error);
      },
    });
  },

  generateLists: function () {
    var poster_items = ``;
    mylist.data.lists.forEach((element, index) => {
      if (element.items.length > 0) {
        poster_items += `
      <div class="row ${index === mylist.selectedRow ? "selected" : ""}">
        <div class="row-title">${translate.go(element.title)}</div>
        <div class="row-content">`;
        element.items.forEach((item) => {
          poster_items += mylist.createItem(item);
        });
        for (var index = 0; index < 9; index++) {
          poster_items += mylist.createEmptyItem();
        }
        poster_items += `</div></div>`;
      }
    });

    return poster_items;
  },

  createItem: function (item) {
    var playhead = item.playhead
      ? `<div class="progress" style="width: ${
          (item.playhead * 100) / item.duration
        }%" value="${item.duration - item.playhead}m"></div>`
      : "";
    return `
    <div class="item">
      <div class="poster">
        <img src="${item.background}"/>
        ${playhead}
      </div>
    </div>`;
  },

  createEmptyItem: function (type) {
    return `
    <div class="item">
      <div class="poster">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">
      </div>
    </div>`;
  },

  details: function () {
    try {
      var item =
        mylist.data.lists[mylist.selectedRow].items[
          $(".row-content")[mylist.selectedRow].slick.currentSlide
        ];
      $(".details .background img").attr("src", item.background);
      var title = $(".details .information #generic-title")[0];
      title.innerText = item.title;
      title.style.fontSize =
        title.scrollHeight > title.clientHeight ? "2.5vh" : "4vh";

      var description = $(".details .information #generic-description")[0];
      description.innerText = item.description;
      description.style.fontSize =
        description.scrollHeight > description.clientHeight ? "1.5vh" : "2vh";
    } catch (error) {
      console.log(error);
    }
  },

  toggleStatus: function (id, status, callback) {
    var action = status ? "addWatchlist" : "removeWatchlist";
    service[action]({
      data: {
        content_id: id,
      },
      success: callback.success,
      error: callback.error,
    });
  },
};
