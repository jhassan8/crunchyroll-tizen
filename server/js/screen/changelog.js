window.changelog = {
  id: "changelog-modal",
  data: {
    version: "v1.1.2",
    changes: [
      {
        title: "fix: crash when there is a movie in history by @jhassan8",
        description: "movies in history causing issues when starting the app.",
      },
      {
        title: "fix: exit and logout in loading screen by @jhassan8",
        description: "Logout and exit of the app when it doesn't start.",
      },
      {
        title: "fix: exit on the login screen by @hassan22l",
        description: "option to exit has been added on the login screen.",
      },
      {
        title: "fix: remove grid search and styles by @jhassan8",
        description: "solve search and styles for tizen version.",
      },
      {
        title: "feat: browse screen by @jhassan8 and @hassan22l",
        description: "The 'Browse' menu option has been enabled for easier anime discovery.",
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
