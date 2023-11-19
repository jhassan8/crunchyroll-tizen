window.changelog = {
  id: "changelog-modal",
  data: {
    version: "v1.1.3",
    changes: [
      {
        title: "feat: loading icon in video by @jhassan8",
        description: "loading icon on the video screen.",
      },
      {
        title: "feat: add keyboard characters by @jhassan8",
        description: "keyboard adjustments to add missing characters.",
      },
      {
        title: "feat: translate screens by @jhassan8",
        description: "now the application is multilingual.",
      },
      {
        title: "fix: languages and movies by @jhassan8",
        description: "language selection adjustments for audio and subtitles.",
      },
      {
        title: "feat: settings screen by @jhassan8",
        description: "the settings menu is available to adjust some parameters.",
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
          Crunchyroll updated to version ${changelog.data.version}
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
          <a class="button ${login.id}-option">OK</a>
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
