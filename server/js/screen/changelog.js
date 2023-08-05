window.changelog = {
  id: "changelog-modal",
  data: {
    version: "v1.1.1",
    changes: [
      {
        title: "fix: home feed locale by @Shyked",
        description: "Resolved language issues on home screen.",
      },
      {
        title: "feat: update search screen by @GnarLito",
        description: "Improved search display by adding names to identify anime.",
      },
      {
        title: "feat: logout button by @GnarLito",
        description: "If you want, you can now log out of the application.",
      },
      {
        title: "feat: video option next episode",
        description: "next episode option on the video screen.",
      },
      {
        title: "feat: video option aspect ratio",
        description: "In some animes, you can customize the video's aspect ratio.",
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
