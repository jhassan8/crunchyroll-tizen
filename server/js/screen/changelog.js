window.changelog = {
  id: "changelog-modal",
  data: {
    version: "v1.1",
    changes: [
      {
        title: "feat: update changelogs",
        description: "You will now receive a report like this with each update.",
      },
      {
        title: "feat: skip intro beta version",
        description: "Anime without delays! Skip the intro with just one button. More action, less waiting.",
      },
      {
        title: "fix: solve error when video versions is null",
        description: "Playback issues have been resolved in certain anime titles, such as \"The Marginal Service\".",
      },
    ],
    extra: "If you have any issues or suggestions, you can report them on the GitHub jhassan8/crunchyroll-tizen.",
  },

  init: function () {
    if (session.storage.version !== changelog.data.version) {
      var changelog_element = document.createElement("div");
      changelog_element.id = changelog.id;

      changelog_element.innerHTML = `
      <div class="content">
        <div class="header">
          Crunchyroll ${changelog.data.version}
        </div>
        <div class="body">
          <ul class="changes">
            ${changelog.getChanges()}
          </ul>
          <div class="extra">
            ${changelog.data.extra}
          </div>
        </div>
        <div class="footer">
          <a class="button ${login.id}-option" translate>OK</a>
        </div>
      </div>`;

      session.storage.version = changelog.data.version;
      session.update();

      document.body.appendChild(changelog_element);
      main.state = changelog.id;
    }
  },

  destroy: function () {
    main.state = home.id;
    document.body.removeChild(document.getElementById(changelog.id));
  },

  getChanges: function (item) {
    var content_changes = "";
    changelog.data.changes.forEach((element) => {
      content_changes += `
      <li>
        <div class="change-title">
          ${element.title}
        </div>
        <div class="change-description">
          ${element.description} 
        </div>
      </li>`;
    });
    return content_changes;
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_PANEL_ENTER:
      case tvKey.KEY_ENTER:
      case tvKey.KEY_BACK:
      case 27:
        changelog.destroy();
        break;
    }
  },
};
