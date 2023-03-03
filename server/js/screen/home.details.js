home.details = {
  id: "home_details-screen",
  previus: NaN,
  data: {
    this: NaN,
    continue: NaN,
  },
};

home.details.init = function (item) {  
  var buttons = document.createElement("div");
  buttons.className = `${home.details.id} ${home.details.id}_buttons`;
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

  home.details.data.this = item;
  service.continue({
    data: {
      ids: item.id,
    },
    success: function (response) {
      home.details.data.continue = mapper.continue(response);
      $(`.${home.details.id}.${home.details.id}_buttons a`)
        .eq(0)
        .addClass(`${home.details.data.continue.played > 0 ? "played" : ""}`)
        .attr("percent", home.details.data.continue.played);
      $(`.${home.details.id}.${home.details.id}_buttons a p`)
        .eq(0)
        .text(
          `${
            home.details.data.continue.played > 0 ? "Continue" : "Play"
          }: T${home.details.data.continue.season_number} E${
            home.details.data.continue.episode_number
          }`
        );
      $(`.${home.details.id}.${home.details.id}_buttons a span`)
        .eq(0)
        .width(home.details.data.continue.played + "%");
    },
    error: function (error) {
      console.log(error);
    },
  });

  $(`#${home.id} .details .info`).append(buttons);
  $(`#${home.id} .details`).addClass("full");
  $(`body`).addClass(`${home.details.id}`);

  home.details.previus = main.state;
  main.state = home.details.id;
};

home.details.destroy = function () {
  $(`body`).removeClass(`${home.details.id}`);
  $(`#${home.id} .details.full`).removeClass("full");
  $(`.${home.details.id}`).remove();
  home.details.data.continue = NaN;
  home.details.data.this = NaN;

  main.state = home.details.previus;
};

home.details.keyDown = function (event) {
  switch (event.keyCode) {
    case tvKey.KEY_BACK:
    case 27:
      home.details.destroy();
      break;
    case tvKey.KEY_UP:
      var buttons = $(`.${home.details.id}.${home.details.id}_buttons a`);
      var current = buttons.index(
        $(`.${home.details.id}.${home.details.id}_buttons a.selected`)
      );
      buttons.removeClass("selected");
      buttons.eq(current > 0 ? current - 1 : current).addClass("selected");
      break;
    case tvKey.KEY_DOWN:
      var buttons = $(`.${home.details.id}.${home.details.id}_buttons a`);
      var current = buttons.index(
        $(`.${home.details.id}.${home.details.id}_buttons a.selected`)
      );
      buttons.removeClass("selected");
      buttons
        .eq(current < buttons.length - 1 ? current + 1 : current)
        .addClass("selected");
      break;
    case tvKey.KEY_ENTER:
    case tvKey.KEY_PANEL_ENTER:
      var buttons = $(`.${home.details.id}.${home.details.id}_buttons a`);
      var current = buttons.index(
        $(`.${home.details.id}.${home.details.id}_buttons a.selected`)
      );

      switch (current) {
        case 0:
          video.init(home.details.data.continue);
          break;
        case 1:
          console.log("add list");
          break;
        case 2:
          home.episodes.init(home.details.data.this);
          break;
        case 3:
          console.log("related");
          break;
      }
      break;
  }
};
