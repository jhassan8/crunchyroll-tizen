var session = {
  info: {
    id: undefined,
    device: undefined,
    password: undefined,
    username: undefined,
    expires: undefined,
    premium: undefined,
    settings: {
      quality: 'auto',
      subtitles: 'EN',
    }
  },
};

session.init = function () {
  loggertest("session.init");
  let info = localStorage.getItem("session");
  if (info) {
    try {
      info = JSON.parse(info);
      session.info = info || session.info;
    } catch (error) {
      console.log("error parse session.");
    }
  }

  if (!session.info.device) {
    session.info.device = session.generateDevice();
  }

  session.update();
};

session.start = function (username, password, callback) {
  service.device({
    data: {
      device_id: session.info.device,
    },
    success: function (responseSession) {
      service.login({
        data: {
          session_id: responseSession.data.session_id,
          password: password,
          account: username,
        },
        success: function (response) {
          loggertest("service.login OK");
          session.info.expires = response.data.expires;
          session.info.id = responseSession.data.session_id;
          session.info.premium = response.data.user.premium;
          session.info.username = username;
          session.info.password = password;

          session.update();
          return callback.success();
        },
        error: function () {
          session.clear();
          return callback.error();
        },
      });
    },
    error: function () {
      session.clear();
      return callback.error();
    },
  });
};

// return session token, if expires refresh, if doesn't exist returns undefined
session.valid = function (callback) {
  if (session.info && session.info.id) {
    if (session.isExpired(new Date(session.info.expires))) {
      session.start(session.info.username, session.info.password, callback);
    }
    return callback.success();
  }
  return callback.error();
};

session.isExpired = function (date) {
  date.setDate(date.getDate() - 1);
  return date.getTime() <= new Date().getTime();
};

session.update = function () {
  localStorage.setItem("session", JSON.stringify(session.info));
};

session.clear = function () {
  session.info.expires = undefined;
  session.info.id = undefined;
  session.info.premium = undefined;
  session.info.username = undefined;
  session.info.password = undefined;
  localStorage.setItem("session", JSON.stringify(session.info));
};

session.randomString = function (lenght) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < lenght; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

session.generateDevice = function () {
  let id;
  try {
    id = webapis.network.getMac().replace(/:/g, "");
  } catch (error) {
    console.log("fail on get mac address");
    id = session.randomString(12);
  }
  return `difix-${id}`;
};
