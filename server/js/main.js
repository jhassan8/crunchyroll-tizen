window.main = {
  urls: {
    src: "server/img",
  },
  events: {},
  mac: null,
  token: null,
  state: null,

  /* on init app */
  init: function () {
    loading.init();
    session.init();
    translate.init();
    main.events.login();

    // TODO: temporal config for LG
    tvKey.IS_KEY_BACK = function (keyCode) {
      return [10009, 27, 461].includes(keyCode) ? keyCode : -1;
    };
  },

  events: {
    logout: function () {
      if (document.getElementById(menu.id) != null) menu.destroy();

      var current_id = main.state.replace("-screen", "");
      if (window[current_id] === undefined) {
        console.log("Failed to find ID of current screen");
        menu.init();
        return;
      }
      if (document.getElementById(main.state) != null)
        window[current_id].destroy();
      session.clear();
      login.init();
    },

    login: function () {
      session.valid({
        success: function () {
          session.load_account({
            success: function () {
              main.events.home();
            },
            error: function (error) {
              console.log("load_account", error);
            },
          });
        },
        error: function (error) {
          console.log(error);
          loading.destroy();
          login.init();
        },
      });
    },

    home: function () {
      service.home({
        success: function (response) {
          mapper.home(response, {
            success: function () {
              loading.destroy();
              home.init();
              menu.init();
            },
          });
        },
        error: function (error) {
          console.log(error);
          loading.destroy();
          login.init();
        },
      });
    },
  },

  /* on exit app */
  destroy: function () {
    player.destroy();
  },

  log: function (text) {
    $("#console").html($("#console").html() + `${text}<br/>`);
    $("#console").scrollTop(3000000);
  },

  /* on key press */
  keyDown: function (event) {
    //('#console').html($('#console').html() + `code: ${event.keyCode}<br/>`);
    //$('#console').scrollTop(3000000);
    if (loading.active) {
      if (tvKey.IS_KEY_BACK(event.keyCode)) {
        loading.end();
      }
    } else {
      if (event.keyCode == tvKey.KEY_EXIT && main.state != exit.id) {
        exit.init();
      } else {
        console.log(event.keyCode);
        switch (main.state) {
          case changelog.id:
            changelog.keyDown(event);
            break;
          case loading.id:
            loading.keyDown(event);
            break;
          case exit.id:
            exit.keyDown(event);
            break;
          case login.id:
            login.keyDown(event);
            break;
          case keyboard.id:
            keyboard.keyDown(event);
            break;
          case menu.id:
            menu.keyDown(event);
            break;
          case mylist.id:
            mylist.keyDown(event);
            break;
          case search.id:
            search.keyDown(event);
            break;
          case historyScreen.id:
            historyScreen.keyDown(event);
            break;
          case browse.id:
            browse.keyDown(event);
            break;
          case home.id:
            home.keyDown(event);
            break;
          case home_details.id:
            home_details.keyDown(event);
            break;
          case home_episodes.id:
            home_episodes.keyDown(event);
            break;
          case video.id:
            video.keyDown(event);
            break;
          case settings.id:
            settings.keyDown(event);
            break;
          default:
            console.log("keyboard action screen not defined.");
            break;
        }
      }
    }
  },
};
