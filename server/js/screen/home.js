var home = {
  id: "home-screen",
  data: {
    main: NaN,
  },
  position: 0,
};

home.init = function () {
  var home_element = document.createElement("div");
  home_element.id = home.id;

  var poster_items = ``;
  home.data.main.lists.forEach((element, index) => {
    poster_items += `
    <div class="row">
      <div class="row-title">${element.title}</div>
      <div class="row-content ${element.items[0].display}">`;
    element.items.forEach((item, position) => {
      poster_items += `
      <div class="item">
        <div class="poster ${item.display}">
          <img data-lazy="${
            item.display === "serie" ? item.poster : item.background
          }">
        </div>
      </div>`;
    });
    for (var index = 0; index < 9; index++) {
      poster_items += `
      <div class="item">
        <div class="poster ${element.items[0].display}">
          <img data-lazy="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">
        </div>
      </div>`;
    }
    poster_items += `</div></div>`;
  });

  home_element.innerHTML = `
  <div class="content">
    <div class="details full">
      <div class="background">
        <img src="${home.data.main.banner.background}">
      </div>
      <div class="info">
        <div class="title resize">${home.data.main.banner.title}</div>
        <div class="description resize">${home.data.main.banner.description}</div>
        <div class="buttons">
          <a class="selected">Reproducir</a>
          <a>Mas Informacion</a>
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
    lazyLoad: "ondemand",
    vertical: true,
    dots: false,
    arrows: false,
    infinite: false,
    slidesToShow: 1.5,
    slidesToScroll: 1,
    speed: 200,
  });

  $(`#${home.id} .rows .row-content`).not(".episode").slick({
    dots: false,
    arrows: false,
    infinite: false,
    slidesToShow: 9,
    slidesToScroll: 1,
    speed: 150,
  });

  $(`#${home.id} .rows .row-content.episode`).slick({
    dots: false,
    arrows: false,
    infinite: false,
    slidesToShow: 4.5,
    slidesToScroll: 1,
    speed: 150,
  });

  $(`#${home.id} .rows`)[0].slick.slickGoTo(0);
  $(`#${home.id} .rows .row-content`)[0].slick.slickGoTo(0);

  menu.init();
  main.state = home.id;
};

home.destroy = function () {
  document.body.removeChild(document.getElementById(home.id));
};

home.show_details = function () {
  var item =
    home.position > 0
      ? this.data.main.lists[home.position - 1].items[
          $(".row-content")[home.position - 1].slick.currentSlide
        ]
      : home.data.main.banner;
  $(".details .background img").attr("src", item.background);
  $(".details .info .title").text(item.title);
  $(".details .info .description").text(item.description);
};

home.keyDown = function (event) {
  switch (event.keyCode) {
    case tvKey.KEY_BACK:
    case 27:
      menu.open();
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
          home.position < this.data.main.lists.length
            ? home.position + 1
            : home.position;
        if (home.position <= this.data.main.lists.length) {
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
          menu.open();
        } else {
          $(".row-content")[home.position - 1].slick.prev();
          home.show_details();
        }
      } else {
        var buttons = $(".details .buttons a");
        var current = buttons.index($(`.details .buttons a.selected`));
        if (current === 0) {
          menu.open();
        } else {
          buttons.removeClass("selected");
          buttons.eq(current > 0 ? current - 1 : current).addClass("selected");
        }
      }
      break;
    case tvKey.KEY_RIGHT:
      if (home.position > 0) {
        if (
          $(".row-content")[home.position - 1].slick.currentSlide <
          this.data.main.lists[home.position - 1].items.length - 1
        ) {
          $(".row-content")[home.position - 1].slick.next();
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
      if (home.position > 0) {
        var item =
          home.position > 0
            ? this.data.main.lists[home.position - 1].items[
                $(".row-content")[home.position - 1].slick.currentSlide
              ]
            : home.data.main.banner;
        home.details.init(item);
      } else {
      }
      break;
  }
};
