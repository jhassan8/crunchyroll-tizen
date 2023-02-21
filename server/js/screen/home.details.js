home.details = {
  id: "home_details-screen",
  previus: NaN,
};

home.details.init = function () {
  var buttons = document.createElement("div");
  buttons.className = `${home.details.id} ${home.details.id}_buttons`;
  buttons.innerHTML = `
  <a class="selected">
    <i class="fa-solid fa-play"></i>
    Reproducir: T1 E1
  </a>
  <a>
    <i class="fa-solid fa-bookmark"></i>
    Añadir a mi lista
  </a>
  <a>
    <i class="fa-solid fa-list"></i>
    Episodios
  </a>
  <a>
    <i class="fa-solid fa-clone"></i>
    Contenido Relacionado
  </a>`;

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

  main.state = home.details.previus;
};

home.details.keyDown = function (event) {
  switch (event.keyCode) {
    case tvKey.KEY_BACK:
    case 27:
      home.details.destroy();
    case 27:
      break;
    case tvKey.KEY_NEXT:
      break;
    case tvKey.KEY_UP:
      var buttons = $(`.${home.details.id}.${home.details.id}_buttons a`);
      var current = buttons.index($(`.${home.details.id}.${home.details.id}_buttons a.selected`));
      buttons.removeClass("selected");
      buttons
        .eq(current > 0 ? current - 1 : current)
        .addClass("selected");
      break;
    case tvKey.KEY_DOWN:
      var buttons = $(`.${home.details.id}.${home.details.id}_buttons a`);
      var current = buttons.index($(`.${home.details.id}.${home.details.id}_buttons a.selected`));
      buttons.removeClass("selected");
      buttons
        .eq(current < buttons.length - 1 ? current + 1 : current)
        .addClass("selected");
      break;
    case tvKey.KEY_LEFT:
      break;
    case tvKey.KEY_RIGHT:
      break;
    case tvKey.KEY_ENTER:
    case tvKey.KEY_PANEL_ENTER:
      break;
  }
};
