var main = {
  urls: {
    src: "server/img",
  },
  events: {},
  mac: null,
  token: null,
  state: null,
};

loggertest = function(text) {
  let timer = new Date();
  let linelog = document.createElement('p');
  linelog.innerText = timer.toLocaleTimeString() + '- ' + text;
  let consolelog = document.getElementById('console');
  consolelog.appendChild(linelog);
}

/* on init app */
main.init = function () {
  loggertest('init');
  player.init();

  //main.setToken('');
  // file.init(function() {
    loading.init();
    main.events.isLogged();
  // });
};

main.events.isLogged = function () {
  //session.get().then((token) => {
    //console.log("obtuvo token");
    //console.log(token);
    //if (token) {

      main.events.home();
    //} else {
    //  console.log("loading.destroy()");
    //  loading.destroy();
    //  login.init();
    //}
  //});
};

main.events.home = function () {
  service.list({
    data: {
      type: home.type,
      filter: home.filter,
    },
    success: function (response) {
      loading.destroy();
      home.data.series = response.data;
      home.init();
      //video.init()
    },
    error: function () {
      loading.destroy();
      login.init();
    },
  });
};

/* on exit app */
main.destroy = function () {
  player.deinit();
};

/* on key press */
main.keyDown = function (event) {
  if (event.keyCode == tvKey.KEY_EXIT && main.state != exit.id) {
    //widgetAPI.blockNavigation(event);
    exit.init();
  } else {
    switch (main.state) {
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
      case home.id:
        home.keyDown(event);
        break;
      case video.id:
        video.keyDown(event);
        break;
      default:
        console.log("keyboard action screen not defined.");
        break;
    }
  }
};

/* read token from file and set in app var */
main.getToken = function () {
  var res = [];
  res = main.readFile("token.dat");
  main.token = res.length > 0 ? res[0] : null;
  return main.token;
};

/* save file token and set in app var */
main.setToken = function (token) {
  main.token = token;
  main.writeFile([token], "token.dat");
};

main.writeFile = function (content, fileName) {
  var fileHandleWrite = tizen.filesystem.openFile(fileName, "w");
  console.log("File opened for writing");
  fileHandleWrite.writeStringNonBlocking(
    content,
    function (bytesCount) {
      console.log("Number of bytes written: " + bytesCount);
    },
    function (error) {
      console.log(error);
    }
  );
  fileHandleWrite.closeNonBlocking(
    function () {
      console.log("File handle closed");
    },
    function (error) {
      console.log(error);
    }
  );
};
