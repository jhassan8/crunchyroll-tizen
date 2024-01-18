window.changelog = {
  id: "changelog-modal",
  data: {
    version: "v1.1.5",
    changes: [
      {
        title: "feat: watchlist workflow by @jhassan8",
        description: "lists and watchlist  section is enabled.",
      },
      {
        title: "feat: video playback speed by @jhassan8",
        description: "playback speed change option.",
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
      case tvKey.IS_KEY_BACK(event.keyCode):
        changelog.destroy();
        break;
    }
  },
};
