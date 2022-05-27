var home = {
  id: "home-screen",
  type: "anime",
  filters:  [
    { label: "Alphabetical", value: "alpha" },
    { label: "Popular", value: "popular" },
    { label: "Newest", value: "newest" },
    { label: "Updated", value: "updated" },
    { label: "Simulcast", value: "simulcast" },
  ],
  filter: "alpha",
  move: {},
  event: {},
  state: 0,
  previus_state: 0,
  selected: {
    menu: 0,
    serie: 0,
    season: 0,
    episode: 0,
    search: 0,
  },
  data: {
    series: [],
    seasons: [],
    episodes: [],
    search: [],
  },
};

home.init = function () {
  var home_element = document.createElement("div");
  home_element.id = home.id;

  let menu_items = ``;
  home.filters.forEach(filter => {
    menu_items += `<li class="${home.id}-menu-option">${filter.label}</li>`
  });

  let poster_items = ``;
  for (let index = 0; index < 20; index++) {
    poster_items += `<div class="${home.id}-item ${index === 11 ? 'selected' : ''}"><img alt=""></div>`;
  }

  home_element.innerHTML = `
  <div class="content">
    <div id="${home.id}-title"></div>
    <div class="menu">
      <div class="logo">
        <img src="${main.urls.src}/logo-big.png" alt="">
      </div>
      <ul>
        ${menu_items}
      </ul>
    </div>
    <div class="header"></div>
    <div class="list">
      <div class="content-list">
        ${poster_items}
      </div>
    </div>
    <div id="${home.id}-description"></div>
    <div class="tools"></div>
  </div>`;
  
  document.body.appendChild(home_element);

  home.move.menu(home.selected.menu);
  home.move.item(home.selected.serie);
  main.state = home.id;
};
 
home.destroy = function () {
  document.body.removeChild(document.getElementById(home.id));
};

home.keyDown = function (event) {
  switch (event.keyCode) {
    case tvKey.KEY_RETURN:
    case tvKey.KEY_PANEL_RETURN:
      widgetAPI.blockNavigation(event);
      if (home.state == 0) {
        exit.init();
      } else {
        if (home.state == 2) {
          document.getElementById(home.id + "-list").className = "list";
        }
        home.state = home.state == 1 ? 0 : home.previus_state;
        var selected =
          home.state == 0
            ? home.selected.serie
            : home.state == 1
            ? home.selected.season
            : home.selected.episode;
        home.move.item(selected);
      }
      break;
    case tvKey.KEY_PANEL_MENU:
    case tvKey.KEY_MENU:
      widgetAPI.blockNavigation(event);
      menu.init();
      break;
    case tvKey.KEY_UP:
      home.move.menu(home.selected.menu == 0 ? 0 : home.selected.menu - 1);
      break;
    case tvKey.KEY_DOWN:
      home.move.menu(home.selected.menu == 4 ? 4 : home.selected.menu + 1);
      break;
    case tvKey.KEY_LEFT:
      var selected =
        home.state == 0
          ? home.selected.serie
          : home.state == 1
          ? home.selected.season
          : home.selected.episode;
      home.move.item(selected == 0 ? 0 : selected - 1);
      break;
    case tvKey.KEY_RIGHT:
      var selected =
        home.state == 0
          ? home.selected.serie
          : home.state == 1
          ? home.selected.season
          : home.selected.episode;
      var max =
        home.state == 0
          ? home.data.series.length
          : home.state == 1
          ? home.data.seasons.length
          : home.data.episodes.length;
      home.move.item(selected + 1 > max - 1 ? max - 1 : selected + 1);
      break;
    case tvKey.KEY_ENTER:
    case tvKey.KEY_PANEL_ENTER:
      home.send();
      break;
  }
};

home.move.menu = function (selected) {
  home.selected.menu = selected;
  var options = document.getElementsByClassName(home.id + "-menu-option");
  for (var i = 0; i < options.length; i++) {
    if (i == selected) {
      options[i].className = home.id + "-menu-option selected";
    } else {
      options[i].className = home.id + "-menu-option";
    }
  }
};

home.move.item = function (selected) {
  console.log(
    (home.state == 0 ? "serie" : home.state == 1 ? "season" : "episode") +
      " to " +
      selected
  );
  home.selected[
    home.state == 0 ? "serie" : home.state == 1 ? "season" : "episode"
  ] = selected;
  var options = document.getElementsByClassName(`${home.id}-item`);
  for (var i = 0; i < options.length; i++) {
    var value = selected - 4 + i;
    options[i].className = options[i].className.replace(" hide", "");
    if (
      value > -1 &&
      value <
        (home.state == 0
          ? home.data.series
          : home.state == 1
          ? home.data.seasons
          : home.data.episodes
        ).length
    ) {
      var element = (
        home.state == 0
          ? home.data.series
          : home.state == 1
          ? home.data.seasons
          : home.data.episodes
      )[value];
      console.log(element);
      if (home.state == 2) {
        options[i].firstChild.setAttribute(
          "src",
          element.screenshot_image.fwide_url
        );
      } else {
        options[i].firstChild.setAttribute(
          "src",
          element.portrait_image != null
            ? element.portrait_image.thumb_url
            : home.data.series[home.selected.serie].portrait_image.thumb_url
        );
      }
      if (i == 4) {
        if (home.state == 0) {
          document.getElementById(home.id + "-title").innerText =
            home.data.series[value].name;
        } else {
          document.getElementById(home.id + "-title").innerText =
            (home.state == 1 ? home.data.seasons : home.data.episodes)[value][
              home.state == 1 ? "season" : "episode_number"
            ] +
            " - " +
            (home.state == 1 ? home.data.seasons : home.data.episodes)[value]
              .name;
        }
        document.getElementById(home.id + "-description").innerText = (
          home.state == 0
            ? home.data.series
            : home.state == 1
            ? home.data.seasons
            : home.data.episodes
        )[value].description;
      }
    } else {
      options[i].className = options[i].className + " hide";
    }
  }
};

home.send = function () {
  switch (home.state) {
    case 0:
      service.season({
        data: {
          mac: main.mac,
          token: main.token,
          id: home.data.series[home.selected.serie].series_id,
        },
        success: function (data) {
          home.selected.season = 0;
          home.data.seasons = data.data;
          if (data.data.length == 1) {
            home.event.episodes();
          } else {
            home.previus_state = home.state;
            home.state = 1;
            home.move.item(home.selected.season);
          }
        },
        error: function () {
          console.log("error");
        },
      });
      break;
    case 1:
      home.event.episodes();
      break;
    case 2:
      video.init(home.data.episodes[home.selected.episode].media_id);
      break;
    default:
      break;
  }
};

home.event.episodes = function () {
  home.selected.episode = 0;
  home.previus_state = home.state;
  home.state = 2;
  service.episode({
    data: {
      mac: main.mac,
      token: main.token,
      id: home.data.seasons[home.selected.season].collection_id,
    },
    success: function (data) {
      home.data.episodes = data.data;
      home.move.item(home.selected.episode);
      document.getElementById(home.id + "-list").className = "list episodes";
    },
    error: function () {
      console.log("error");
    },
  });
};
