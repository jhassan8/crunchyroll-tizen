window.home_details = {
  id: "home_details-screen",
  previous: NaN,
  data: {
    this: NaN,
    continue: NaN,
  },
  callbacks: {
    init: NaN,
    destroy: NaN,
  },

  init: function (item, init, destroy) {
    home_details.callbacks.init = init;
    home_details.callbacks.destroy = destroy;
    home_details.callbacks.init && home_details.callbacks.init(item);
    var buttons = document.createElement("div");
    buttons.className = `${home_details.id} ${home_details.id}_buttons`;
    buttons.innerHTML = `
    <a class="selected">
      <i class="fa-solid fa-play"></i>
      <p>Play: S1 E1</p>
      <span></span>
    </a>
    <a>
      <i class="fa-solid fa-bookmark"></i>
      <p>Add to my list</p>
    </a>
    <a>
      <i class="fa-solid fa-list"></i>
      <p>Episodes</p>
    </a>
    <a>
      <i class="fa-solid fa-clone"></i>
      <p>Related content</p>
    </a>`;

    home_details.data.this = item;
    loading.start();
    service.continue({
      data: {
        ids: item.id,
      },
      success: function (response) {
        loading.end();
        home_details.data.continue = mapper.continue(response);
        $(`.${home_details.id}.${home_details.id}_buttons a`)
          .eq(0)
          .addClass(`${home_details.data.continue.played > 0 ? "played" : ""}`)
          .attr("percent", home_details.data.continue.played);
        $(`.${home_details.id}.${home_details.id}_buttons a p`)
          .eq(0)
          .text(
            `${home_details.data.continue.played > 0 ? "Continue" : "Play"}: T${
              home_details.data.continue.season_number
            } E${home_details.data.continue.episode_number}`
          );
        $(`.${home_details.id}.${home_details.id}_buttons a span`)
          .eq(0)
          .width(home_details.data.continue.played + "%");
      },
      error: function (error) {
        loading.end();
        console.log(error);
      },
    });

    $(`#${home.id} .details .info`).append(buttons);
    $(`#${home.id} .details`).addClass("full");
    $(`body`).addClass(`${home_details.id}`);

    home_details.previous = main.state;
    main.state = home_details.id;
  },

  destroy: function () {
    $(`body`).removeClass(`${home_details.id}`);
    $(`#${home.id} .details.full`).removeClass("full");
    $(`.${home_details.id}`).remove();
    home_details.data.continue = NaN;
    home_details.data.this = NaN;

    main.state = home_details.previous;
    home_details.callbacks.destroy && home_details.callbacks.destroy();
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        home_details.destroy();
        break;
      case tvKey.KEY_UP:
        var buttons = $(`.${home_details.id}.${home_details.id}_buttons a`);
        var current = buttons.index(
          $(`.${home_details.id}.${home_details.id}_buttons a.selected`)
        );
        buttons.removeClass("selected");
        buttons.eq(current > 0 ? current - 1 : current).addClass("selected");
        break;
      case tvKey.KEY_DOWN:
        var buttons = $(`.${home_details.id}.${home_details.id}_buttons a`);
        var current = buttons.index(
          $(`.${home_details.id}.${home_details.id}_buttons a.selected`)
        );
        buttons.removeClass("selected");
        buttons
          .eq(current < buttons.length - 1 ? current + 1 : current)
          .addClass("selected");
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        var buttons = $(`.${home_details.id}.${home_details.id}_buttons a`);
        var current = buttons.index(
          $(`.${home_details.id}.${home_details.id}_buttons a.selected`)
        );

        switch (current) {
          case 0:
            video.init(home_details.data.continue);
            break;
          case 1:
            console.log("add list");
            break;
          case 2:
            home_episodes.init(home_details.data.this);
            break;
          case 3:
            console.log("related");
            break;
        }
        break;
    }
  },
};
