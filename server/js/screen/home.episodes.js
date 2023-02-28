home.episodes = {
  id: "home_episodes-screen",
  previus: NaN,
  data: {
    seasons: NaN,
    episodes: NaN,
  },
};

home.episodes.init = function (item) {
  var episode_contents = document.createElement("div");
  episode_contents.className = `${home.episodes.id} ${home.episodes.id}_content`;

  episode_contents.innerHTML = `
  <div class="seasons">
    <div class="title resize">${item.title}</div>
    <div class="seasons-list"></div>
  </div>
  <div class="episodes">
    <div class="title">Temporada 1</div>
    <div class="episodes-list"></div>
  </div>
  `;

  $(`#${home.id}`).append(episode_contents);

  service.seasons({
    data: {
      id: item.id,
    },
    success: function (response) {
      home.episodes.data.seasons = mapper.seasons(response);
      var seasons_html;
      home.episodes.data.seasons.forEach((season) => {
        seasons_html += `
        <div>${season.title}</div>`;
      });
      $(".seasons .seasons-list").eq(0).html(seasons_html);
      service.episodes({
        data: {
          id: home.episodes.data.seasons[0].id,
        },
        success: function (response) {
          home.episodes.data.episodes = mapper.episodes(response);
          home.episodes.load();
        },
        error: function (error) {
          console.log(error);
        },
      });
    },
    error: function (error) {
      console.log(error);
    },
  });

  $(`body`).addClass(`${home.episodes.id}`);

  home.episodes.previus = main.state;
  main.state = home.episodes.id;
};

home.episodes.load = function () {
  var episodes_html;
  home.episodes.data.episodes.forEach((episode) => {
    episodes_html += `
    <div class="episode">
      <div class="episode-image">
        <img data-lazy="${episode.background}">
      </div>
      <div class="episode-details">
        <div class="episode-title">${episode.title}</div>
        <div class="episode-description">${episode.description}</div>
      </div>
    </div>`;
  });
  $(".episodes .episodes-list").eq(0).html(episodes_html);

  $(".episodes .episodes-list").slick({
    lazyLoad: "ondemand",
    vertical: true,
    dots: false,
    arrows: false,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    speed: 200,
  });
};

home.episodes.destroy = function () {
  $(`body`).removeClass(`${home.episodes.id}`);
  setTimeout(() => {
    $(`body`).removeClass(`${home.episodes.id}`);
    $(`.${home.episodes.id}`).remove();
    main.state = home.episodes.previus;
  }, 400);
};

home.episodes.keyDown = function (event) {
  switch (event.keyCode) {
    case tvKey.KEY_BACK:
    case 27:
      home.episodes.destroy();
      break;
    case tvKey.KEY_UP:
      break;
    case tvKey.KEY_DOWN:
      break;
    case tvKey.KEY_ENTER:
    case tvKey.KEY_PANEL_ENTER:
      break;
  }
};
