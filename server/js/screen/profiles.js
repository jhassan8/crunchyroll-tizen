// GET /accounts/v1/me/multiprofile

// # Request Headers
// Authorization: Bearer ${TOKEN}

window.profilesScreen = {
  id: "profiles-screen",

  init: function () {
    var profiles_element = document.createElement("div");

    profiles_element.id = profilesScreen.id;

    profiles_element.innerHTML = `
    <div class="content">
      <div class="container">
        <div class="legend">${translate.go("profiles.label")}</div>
        <ul class="options" id="settings-menu">${profilesScreen.getOptions()}</ul>
      </div>
    </div>
    `;

    menu.destroy();
    document.body.appendChild(profiles_element);
    main.state = profilesScreen.id;
  },

  destroy() {
    document.body.removeChild(document.getElementById(profilesScreen.id));
  },

  getOptions: function () {
    const profiles = session.storage.profiles;

    return profiles.map((profile) => {
      const { is_selected, profile_name, profile_id, avatar } = profile;

      return `<li class="${
        is_selected ? "selected active" : ""
      }" id="${profile_id}">
        <img src="https://static.crunchyroll.com/assets/avatar/170x170/${
          avatar || "0001-cr-white-orange.png"
        }"/>
        <span>${profile_name.trim().toUpperCase()}</span>
      </li>`;
    });
  },

  keyDown(event) {
    switch (event.keyCode) {
      case tvKey.KEY_RIGHT:
        var options = $(".options li");
        var current = options.index($(`.options li.selected`));
        options.removeClass("selected");

        var newCurrent = current < options.length - 1 ? current + 1 : current;
        options.eq(newCurrent).addClass("selected");
        break;
      case tvKey.KEY_LEFT:
        var options = $(`.options li`);
        var current = options.index($(`.options li.selected`));
        options.removeClass("selected");

        var newCurrent = current > 0 ? current - 1 : current;
        options.eq(newCurrent).addClass("selected");
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        var options = $(`.options li`);
        var current = options.index($(`.options li.selected`));

        var element = options[current];

        session.switch_profile(
          {
            success: (responseJson) => {
              profilesScreen.destroy();
              menu.init();
              home.restart();
            },
            error: console.error,
          },
          element.id
        );

        break;
    }
  },
};
