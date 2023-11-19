window.settings = {
  id: "settings-screen",
  isDetails: false,
  options: [
    {
      id: "applicationlang",
      label: "settings.menu.application_lang",
      type: "list",
    },
    {
      id: "audiolang",
      label: "settings.menu.audio_lang",
      type: "list",
    },
    {
      id: "subtitlelang",
      label: "settings.menu.subtitle_lang",
      type: "list",
    },
    {
      id: "videoquality",
      label: "settings.menu.video_quality",
      type: "list",
    },
    {
      id: "mature",
      label: "settings.menu.mature",
      type: "list",
    },
    {
      id: "about",
      label: "settings.menu.about",
      type: "html",
    },
  ],
  qualities: {
    auto: "Auto",
    240: "240p",
    360: "360p",
    480: "480p",
    720: "720p HD",
    1080: "1080p HD",
  },
  bool: {
    M2: "NO",
    M3: "YES",
  },
  previous: NaN,

  init: function () {
    var settings_element = document.createElement("div");
    settings_element.id = settings.id;

    settings_element.innerHTML = `
      <div class="content">
        <div class="container-mid">
          <ul class="options" id="settings-menu">${settings.generateMenu()}</ul>
        </div>
        <div class="container" id="settings-details"></div>
      </div>`;

    document.body.appendChild(settings_element);
    settings.details.show(settings.options[0]);
  },

  destroy: function () {
    settings.isDetails = false;
    document.body.removeChild(document.getElementById(settings.id));
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case tvKey.KEY_ESCAPE:
        menu.open();
        break;
      case tvKey.KEY_UP:
        if (settings.isDetails) {
          var options = $(`.options li`);
          var current = options.index($(`.options li.active`));
          settings.details[settings.options[current].type].move(-1);
        } else {
          var options = $(`.options li`);
          var current = options.index($(`.options li.selected`));

          options.removeClass("selected");
          var newCurrent = current > 0 ? current - 1 : current;
          options.eq(newCurrent).addClass("selected");
          settings.details.show(settings.options[newCurrent]);
        }
        break;
      case tvKey.KEY_DOWN:
        if (settings.isDetails) {
          var options = $(`.options li`);
          var current = options.index($(`.options li.active`));
          settings.details[settings.options[current].type].move(1);
        } else {
          var options = $(`.options li`);
          var current = options.index($(`.options li.selected`));

          options.removeClass("selected");
          var newCurrent = current < options.length - 1 ? current + 1 : current;
          options.eq(newCurrent).addClass("selected");
          settings.details.show(settings.options[newCurrent]);
        }
        break;
      case tvKey.KEY_LEFT:
        if (settings.isDetails) {
          var options = $(`.options li`);
          var current = options.index($(`.options li.active`));
          options.removeClass("active");
          options.eq(current).addClass("selected");
          settings.details[settings.options[current].type].move(false);
          settings.isDetails = false;
        } else {
          menu.open();
        }
        break;
      case tvKey.KEY_RIGHT:
        if (!settings.isDetails) {
          var options = $(`.options li`);
          var current = options.index($(`.options li.selected`));
          options.removeClass("selected");
          options.eq(current).addClass("active");

          settings.isDetails = true;
          settings.details[settings.options[current].type].move(0);
        }
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        if (settings.isDetails) {
          var options = $(`.options li`);
          var current = options.index($(`.options li.active`));

          var element = settings.options[current];
          settings.details[element.type].action(element.id);
        }
        break;
    }
  },

  generateMenu: function (index) {
    var className = index === undefined ? "selected" : "active";
    var selected = index === undefined ? 0 : index;
    return settings.options
      .map(
        (option, index) =>
          `<li class="${index === selected ? className : ""}">${translate.go(
            option.label
          )}</li>`
      )
      .join("");
  },

  resetLang: function () {
    var options = $(`.options li`);
    var current = options.index($(`.options li.active`));

    $("#settings-menu").html(settings.generateMenu(current));

    menu.destroy();
    menu.init(true);
  },

  details: {
    show: function (element) {
      $("#settings-details").html(
        settings.details[element.type].create(element.id)
      );
    },

    list: {
      create: function (id) {
        switch (id) {
          case "audiolang":
            var options = session.languages.audios;
            var active = session.storage.account.audio;
            break;
          case "applicationlang":
            var options = JSON.parse(
              JSON.stringify(session.languages.subtitles)
            );
            delete options[""];
            var active = session.storage.language;
            break;
          case "subtitlelang":
            var options = session.languages.subtitles;
            var active = session.storage.account.language;
            break;
          case "videoquality":
            var options = settings.qualities;
            var active = session.storage.quality || 'auto';
            break;
          case "mature":
            var options = settings.bool;
            var active = session.storage.account.mature;
            break;
        }

        return (
          '<ul class="list-active" id="list-details-offset">' +
          Object.keys(options)
            .map(
              (option) =>
                `<li class="${option === active ? "active" : ""}">${
                  options[option]
                }</li>`
            )
            .join("") +
          "</ul>"
        );
      },

      adjust: function (index, size, elementId) {
        var marginTop = 0;
        if (size > 6 && index > 5) {
          if (index > size - 2) {
            marginTop = -((size - 6) * 104);
          } else {
            marginTop = -((index - 5) * 104);
          }
        }

        document.getElementById(elementId).style.marginTop = `${marginTop}px`;
      },

      action: function (id) {
        var optionsMenu = $(`#settings-details li`);
        var index = optionsMenu.index($(`#settings-details li.selected`));

        console.log(id, index);
        switch (id) {
          case "audiolang":
            var options = session.languages.audios;
            var method = function (value) {
              service.setProfile({
                data: {
                  preferred_content_audio_language: value,
                },
                success: function (response) {
                  session.storage.account.audio = value;
                  session.update();
                },
                error: function (error) {
                  console.log(error);
                },
              });
            };
            break;
          case "applicationlang":
            var options = JSON.parse(
              JSON.stringify(session.languages.subtitles)
            );
            delete options[""];
            var method = function (value) {
              translate.updateLanguage(value);
              settings.resetLang();
            };
            break;
          case "subtitlelang":
            var options = session.languages.subtitles;
            var method = function (value) {
              service.setProfile({
                data: {
                  preferred_content_subtitle_language: value,
                },
                success: function (response) {
                  session.storage.account.language = value;
                  session.update();
                },
                error: function (error) {
                  console.log(error);
                },
              });
            };
            break;
          case "videoquality":
            var options = settings.qualities;
            var method = function (value) {
              session.storage.quality = value;
              session.update();
            };
            break;
          case "mature":
            var options = settings.bool;
            var method = function (value) {
              service.setProfile({
                data: {
                  maturity_rating: value,
                },
                success: function (response) {
                  session.storage.account.mature = value;
                  session.update();
                },
                error: function (error) {
                  console.log(error);
                },
              });
            };
            break;
        }
        method(Object.keys(options)[index]);
        optionsMenu.removeClass("active");
        optionsMenu.eq(index).addClass("active");
      },

      move: function (index) {
        var options = $(`#settings-details li`);
        if (index === false) {
          options.removeClass("selected");
          return;
        }
        var currentSelected = options.index($(`#settings-details li.selected`));
        var current =
          currentSelected >= 0
            ? currentSelected
            : options.index($(`#settings-details li.active`));

        options.removeClass("selected");
        if (index < 0) {
          var newCurrent = current > 0 ? current + index : current;
        } else {
          var newCurrent =
            current + index < options.length ? current + index : current;
        }

        options.eq(newCurrent).addClass("selected");
        settings.details.list.adjust(
          newCurrent,
          options.length,
          "list-details-offset"
        );
      },
    },

    html: {
      create: function (id) {
        return `
        <div style="color: #fff;font-size: 23px;line-height: 51px;text-align: right;padding: 38px 0;position: absolute;right: 0;bottom: 0;">
          <div>Crunchyroll unofficial app.</div>
          <div>Github: https://github.com/jhassan8/crunchyroll-tizen</div>
          <div>Contact: Github or jhassan8@outlook.com</div>
          <div>Version: ${session.storage.version}</div>
        </div>`;
      },

      move: function () {},
    },
  },
};
