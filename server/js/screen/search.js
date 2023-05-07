window.search = {
  id: "search-screen",
  previous: NaN,
  input: NaN,
  position: 0,
  data: {
    result: [],
  },

  init: function () {
    var search_element = document.createElement("div");
    search_element.id = search.id;

    search_element.innerHTML = `
      <div class="content">
        <div class="input focus" id="search-screen_input">
          <input type="text" placeholder="Search...">
        </div>
        <div class="list-container">
          <div class="list-container-over"></div>
        </div>
        <div class="logo-fixed">
          <img src="server/img/logo-big.png"/>
        </div>
      </div>`;

    document.body.appendChild(search_element);
    search.input = document.getElementById(
      "search-screen_input"
    ).firstElementChild;
  },

  destroy: function () {
    search.data.result = [];
    document.body.removeChild(document.getElementById(search.id));
  },

  start: function () {
    loading.start();
    service.search({
      data: {
        query: search.input.value,
      },
      success: function (response) {
        loading.end();
        search.data.result = mapper.search(response);
        var elements_content = "";
        search.data.result.forEach((element, index) => {
          elements_content += `
              <div class="item${index === 0 ? " selected" : ""}">
                <img src="${element.poster}" alt="">
              </div>`;
        });

        $(".list-container-over").html(elements_content);
      },
      error: function (error) {
        loading.end();
        console.log(error);
      },
    });
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        if (search.position === 0) {
          menu.open();
        } else {
          $("#search-screen_input").addClass("focus");
          $(".list-container").removeClass("focus");
          search.position = 0;
        }
        break;
      case tvKey.KEY_NEXT:
        break;
      case tvKey.KEY_UP:
        rows = Math.ceil(
          $(".list-container-over").get(0).childElementCount / 9
        );
        options = $(`.list-container .item`);
        current = options.index($(`.list-container-over .item.selected`));

        if (Math.ceil((current + 1) / 9) === 1) {
          $("#search-screen_input").addClass("focus");
          $(".list-container").removeClass("focus");
          search.position = 0;
        } else {
          options.removeClass("selected");
          var newCurrent = current > 8 ? current - 9 : current;
          options.eq(newCurrent).addClass("selected");

          row = Math.ceil((newCurrent + 1) / 9);
          $(".list-container-over").get(0).style.marginTop = `${
            row > 3 ? (row - 3) * -275 : 0
          }px`;
        }

        break;
      case tvKey.KEY_DOWN:
        if (search.position === 0) {
          if (search.data.result.length > 0) {
            $("#search-screen_input").removeClass("focus");
            $(".list-container").addClass("focus");
            search.position = 1;
          }
        } else {
          rows = Math.ceil(
            $(".list-container-over").get(0).childElementCount / 9
          );
          options = $(`.list-container-over .item`);
          current = options.index($(`.list-container-over .item.selected`));

          options.removeClass("selected");
          var newCurrent = current < options.length - 9 ? current + 9 : current;
          options.eq(newCurrent).addClass("selected");

          row = Math.ceil((newCurrent + 1) / 9);
          $(".list-container-over").get(0).style.marginTop = `${
            row > 3 ? (row - 3) * -275 : 0
          }px`;
        }

        break;
      case tvKey.KEY_LEFT:
        options = $(`.list-container-over .item`);
        current = options.index($(`.list-container-over .item.selected`));

        if (search.position === 1 && current !== 0 && current % 9 !== 0) {
          rows = Math.ceil(
            $(".list-container-over").get(0).childElementCount / 9
          );

          options.removeClass("selected");
          options.eq(current - 1).addClass("selected");
        } else {
          menu.open();
        }
        break;
      case tvKey.KEY_RIGHT:
        if (search.position === 1) {
          rows = Math.ceil(
            $(".list-container-over").get(0).childElementCount / 9
          );
          options = $(`.list-container-over .item`);
          current = options.index($(`.list-container-over .item.selected`));

          options.removeClass("selected");
          var newCurrent =
            current + 1 < options.length && (current + 1) % 9 !== 0
              ? current + 1
              : current;
          options.eq(newCurrent).addClass("selected");
        }
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        if (this.position === 0) {
          keyboard.init(search.input, search.start);
        } else {
          options = $(`.list-container-over .item`);
          current = options.index($(`.list-container-over .item.selected`));
          home_details.init(
            search.data.result[current],
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
                    <a class="selected">Play</a>
                    <a>More information</a>
                  </div>
                </div>
              </div>
              <div class="logo-fixed">
                <img src="server/img/logo-big.png"/>
              </div>
            </div>`;

              document.getElementById(search.id).style.display = "none";
              document.body.appendChild(home_element);
            },
            function () {
              document.getElementById(search.id).style.display = "block";
              home.destroy();
            }
          );
        }
        break;
    }
  },
};
