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
      <div class="container-mid">
        <ul class="options" id="settings-menu">${profilesScreen.getOptions()}</ul>
      </div>
    </div>
    `;

    document.body.appendChild(profiles_element);
  },
  destroy() {
    document.body.removeChild(document.getElementById(profilesScreen.id));
  },
  getOptions: function () {
    const profiles = session.storage.profiles;

    return profiles.map((profile, idx) => {
      const { is_selected, profile_name, profile_id } = profile;

      return `<li class="${
        is_selected ? "selected active" : ""
      }" id="${profile_id}">
        ${profile_name?.trim().toUpperCase()}
        </li>`;
    });
  },

  keyDown(event) {
    switch (event.keyCode) {
      case tvKey.KEY_LEFT:
        menu.open();
        break;
      case tvKey.KEY_DOWN:
        var options = $(".options li");
        var current = options.index($(`.options li.selected`));
        options.removeClass("selected");

        var newCurrent = current < options.length - 1 ? current + 1 : current;
        options.eq(newCurrent).addClass("selected");
        break;
      case tvKey.KEY_UP:
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
              const { profile_id } = responseJson;
              options.removeClass("active");

              var option = $(`#${profile_id}`);

              option.addClass("active");
              menu.open();
            },
            error: console.error,
          },
          element.id
        );

        break;
    }
  },
};
