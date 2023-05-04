window.home_episodes = {
  id: "home_episodes-screen",
  previous: NaN,
  data: {
    seasons: NaN,
    episodes: NaN,
  },

  init: function (item) {
    var episode_contents = document.createElement("div");
    episode_contents.className = `${home_episodes.id} ${home_episodes.id}_content`;

    episode_contents.innerHTML = `
  <div class="option seasons">
    <div class="title resize">${item.title}</div>
    <div class="seasons-list"></div>
  </div>
  <div class="option episodes active">
    <div class="title"></div>
    <div class="episodes-list"></div>
  </div>
  `;

    $(`#${home.id}`).append(episode_contents);

    service.seasons({
      data: {
        id: item.id,
      },
      success: function (response) {
        home_episodes.data.seasons = mapper.seasons(response);
        var seasons_html = "";
        home_episodes.data.seasons.forEach((season, index) => {
          seasons_html += `
        <div class="season${index === 0 ? " selected" : ""}">${
            season.title
          }</div>`;
        });
        $(".seasons .seasons-list").eq(0).html(seasons_html);
        home_episodes.load(home_episodes.data.seasons[0]);
      },
      error: function (error) {
        console.log(error);
      },
    });

    $(`body`).addClass(`${home_episodes.id}`);

    home_episodes.previous = main.state;
    main.state = home_episodes.id;
  },

  load: function (season) {
    $(".episodes .title")[0].innerText = season.title;
    $(".episodes .episodes-list")[0].slick &&
      $(".episodes .episodes-list")[0].slick.destroy();
    service.episodes({
      data: {
        id: season.id,
      },
      success: function (response) {
        mapper.episodes(response, function (result) {
          home_episodes.data.episodes = result;

          var episodes_html = "";
          home_episodes.data.episodes.forEach((episode) => {
            episodes_html += `
        <div class="episode">
          <div class="episode-image">
            <img src="${episode.background}">
            ${home_episodes.view(episode)}
          </div>
          <div class="episode-details">
            <div class="episode-title">${episode.title}</div>
            <div class="episode-description">${episode.description}</div>
          </div>
        </div>`;
          });
          for (var index = 0; index < 4; index++) {
            episodes_html += `
        <div class="episode">
          <div class="episode-image">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">
          </div>
        </div>`;
          }
          $(".episodes .episodes-list").eq(0).html(episodes_html);

          $(".episodes .episodes-list").slick({
            vertical: true,
            dots: false,
            arrows: false,
            infinite: false,
            slidesToShow: 5,
            slidesToScroll: 1,
            speed: 0,
            waitForAnimate: false,
          });

          $(".episodes .episodes-list")[0].slick.slickGoTo(0);
        });
      },
      error: function (error) {
        console.log(error);
      },
    });
  },

  view: function (episode) {
    return episode.playhead !== 0
      ? `<div class="progress" style="width: ${
          (episode.playhead * 100) / episode.duration
        }%" value="${
          episode.duration === episode.playhead
            ? "Watched"
            : episode.duration - episode.playhead + "m"
        }"></div>`
      : "";
  },

  destroy: function () {
    $(`body`).removeClass(`${home_episodes.id}`);
    setTimeout(() => {
      $(`body`).removeClass(`${home_episodes.id}`);
      $(`.${home_episodes.id}`).remove();
      main.state = home_episodes.previous;
    }, 400);
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        home_episodes.destroy();
        break;
      case tvKey.KEY_LEFT:
        var options = $(
          `.${home_episodes.id}.${home_episodes.id}_content .option`
        );
        var current = options.index(
          $(`.${home_episodes.id}.${home_episodes.id}_content .option.active`)
        );
        options.removeClass("active");
        options.eq(current > 0 ? current - 1 : current).addClass("active");
        break;
      case tvKey.KEY_RIGHT:
        var options = $(
          `.${home_episodes.id}.${home_episodes.id}_content .option`
        );
        var current = options.index(
          $(`.${home_episodes.id}.${home_episodes.id}_content .option.active`)
        );
        options.removeClass("active");
        options
          .eq(current < options.length - 1 ? current + 1 : current)
          .addClass("active");
        break;
      case tvKey.KEY_UP:
        var options = $(
          `.${home_episodes.id}.${home_episodes.id}_content .option`
        );
        var current = options.index(
          $(`.${home_episodes.id}.${home_episodes.id}_content .option.active`)
        );
        if (current > 0) {
          $(".episodes .episodes-list")[0].slick.prev();
        } else {
          options = $(`.seasons-list .season`);
          current = options.index($(`.seasons-list .season.selected`));
          options[0].style.marginTop = `${
            current < options.length - 3
              ? (current - 5) * -70 < 15
                ? (current - 5) * -70
                : 15
              : -1120
          }px`;
          options.removeClass("selected");
          var newCurrent = current > 0 ? current - 1 : current;
          options.eq(newCurrent).addClass("selected");
          home_episodes.load(home_episodes.data.seasons[newCurrent]);
        }
        break;
      case tvKey.KEY_DOWN:
        var options = $(
          `.${home_episodes.id}.${home_episodes.id}_content .option`
        );
        var current = options.index(
          $(`.${home_episodes.id}.${home_episodes.id}_content .option.active`)
        );
        if (current > 0) {
          $(".episodes .episodes-list")[0].slick.next();
        } else {
          options = $(`.seasons-list .season`);
          current = options.index($(`.seasons-list .season.selected`));
          options[0].style.marginTop = `${
            current - 3 > 0
              ? (current - 3) * -70 > -1120
                ? (current - 3) * -70
                : -1120
              : 15
          }px`;
          options.removeClass("selected");
          var newCurrent = current < options.length - 1 ? current + 1 : current;
          options.eq(newCurrent).addClass("selected");
          home_episodes.load(home_episodes.data.seasons[newCurrent]);
        }
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        var options = $(
          `.${home_episodes.id}.${home_episodes.id}_content .option`
        );
        var current = options.index(
          $(`.${home_episodes.id}.${home_episodes.id}_content .option.active`)
        );
        if (current > 0) {
          video.init(
            home_episodes.data.episodes[
              $(".episodes .episodes-list")[0].slick.currentSlide
            ]
          );
        }
        break;
    }
  },
};
