window.historyScreen = {
  id: "history-screen",
  data: [],

  init: function () {
    var history_element = document.createElement("div");
    history_element.id = historyScreen.id;

    history_element.innerHTML = `
    <div class="content">
      <div class="list-container">
        <div class="list-container-over" id="history-list"></div>
      </div>
      <div class="logo-fixed">
        <img src="server/img/logo-big.png"/>
      </div>
    </div>`;

    document.body.appendChild(history_element);

    loading.start();
    service.history({
      success: function (response) {
        var elements = "";
        historyScreen.data = mapper.history(response);
        historyScreen.data.forEach((element, index) => {
          elements += `
          <div class="item${index === 0 ? " selected" : ""}">
            <img src="${element.background}" alt="">
            ${historyScreen.view(element)}
          </div>`;
        });
        document.getElementById("history-list").innerHTML = elements;
        loading.end();
      },
      error: function (error) {
        loading.end();
        console.log(error);
      },
    });
  },

  destroy: function () {
    historyScreen.data = [];
    document.body.removeChild(document.getElementById(historyScreen.id));
  },

  view: function (item) {
    return item.playhead !== 0
      ? `<div class="progress" style="width: ${
          (item.playhead * 100) / item.duration
        }%" value="${
          item.duration === item.playhead
            ? translate.go('home.episodes.watched')
            : item.duration - item.playhead + "m"
        }"></div>`
      : "";
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.IS_KEY_BACK(event.keyCode):
        menu.open();
        break;
      case tvKey.KEY_NEXT:
        break;
      case tvKey.KEY_UP:
        var options = $(`.list-container .item`);
        var current = options.index($(`.list-container-over .item.selected`));

        options.removeClass("selected");
        var newCurrent = current > 4 ? current - 5 : current;
        options.eq(newCurrent).addClass("selected");

        var row = Math.ceil((newCurrent + 1) / 5);
        $(".list-container-over").get(0).style.marginTop = `${
          row > 4 ? (row - 4) * -210 : 0
        }px`;
        break;
      case tvKey.KEY_DOWN:
        var options = $(`.list-container-over .item`);
        var current = options.index($(`.list-container-over .item.selected`));

        options.removeClass("selected");
        var newCurrent = current < options.length - 5 ? current + 5 : current;
        options.eq(newCurrent).addClass("selected");

        var row = Math.ceil((newCurrent + 1) / 5);
        $(".list-container-over").get(0).style.marginTop = `${
          row > 4 ? (row - 4) * -210 : 0
        }px`;
        break;
      case tvKey.KEY_LEFT:
        var options = $(`.list-container-over .item`);
        var current = options.index($(`.list-container-over .item.selected`));
        if (current !== 0 && current % 5 !== 0) {
          options.removeClass("selected");
          options.eq(current - 1).addClass("selected");
        } else {
          menu.open();
        }
        break;
      case tvKey.KEY_RIGHT:
        var options = $(`.list-container-over .item`);
        var current = options.index($(`.list-container-over .item.selected`));

        options.removeClass("selected");
        var newCurrent =
          current + 1 < options.length && (current + 1) % 5 !== 0
            ? current + 1
            : current;
        options.eq(newCurrent).addClass("selected");
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        var options = $(`.list-container-over .item`);
        var current = options.index($(`.list-container-over .item.selected`));
        home_details.init(
          historyScreen.data[current],
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
                    <a class="selected">${translate.go('home.banner.play')}</a>
                    <a>${translate.go('home.banner.info')}</a>
                  </div>
                </div>
              </div>
              <div class="logo-fixed">
                <img src="server/img/logo-big.png"/>
              </div>
            </div>`;

            document.getElementById(historyScreen.id).style.display = "none";
            document.body.appendChild(home_element);
          },
          function () {
            document.getElementById(historyScreen.id).style.display = "block";
            home.destroy();
          }
        );
        break;
    }
  },
};
