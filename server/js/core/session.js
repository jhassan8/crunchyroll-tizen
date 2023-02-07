var session = {
  info: {
    id: undefined,
    device: undefined,
    password: undefined,
    username: undefined,
    expires: undefined,
    premium: undefined,
    settings: {
      quality: "auto",
      subtitles: "N/A",
    },
  },
  storage: {
    account: {
      password: NaN,
      username: NaN,
      avatar: "0001-cr-white-orange.png",
      premium: false,
      language: NaN,
    },
    cookies: {
      bucket: NaN,
      policy: NaN,
      signature: NaN,
      key_pair_id: NaN,
      expires: NaN,
    },
    id: NaN,
    country: NaN,
    token_type: NaN,
    access_token: NaN,
    expires_in: NaN,
    refresh_token: NaN,
  },
};

session.init = function () {
  var storage = localStorage.getItem("session");
  if (storage) {
    try {
      storage = JSON.parse(storage);
      session.storage = storage || session.storage;
    } catch (error) {
      console.log("error parse session.");
    }
  }

  session.update();
};

session.start = function (username, password, callback) {
  service.token({
    data: {
      password: password,
      username: username,
    },
    success: function (response) {
      session.storage.expires_in = new Date().setSeconds(
        new Date().getSeconds() + response.expires_in
      );
      session.storage.id = response.account_id;
      session.storage.account.username = username;
      session.storage.account.password = password;
      session.storage.country = response.country;
      session.storage.token_type = response.token_type;
      session.storage.access_token = response.access_token;
      session.storage.refresh_token = response.refresh_token;

      //session.loadAccountInfo();
      return callback.success(session.update());
    },
    error: function () {
      session.clear();
      return callback.error();
    },
  });
};

session.refresh = function (callback) {
  if (session.isExpired()) {
    service.refresh({
      data: {
        refresh_token: session.storage.refresh_token,
      },
      success: function (response) {
        session.storage.expires_in = new Date().setSeconds(
          new Date().getSeconds() + response.expires_in
        );
        session.storage.id = response.account_id;
        session.storage.country = response.country;
        session.storage.token_type = response.token_type;
        session.storage.access_token = response.access_token;
        session.storage.refresh_token = response.refresh_token;

        callback.success(session.update());
      },
      error: function (error) {
        callback.error(error);
      },
    });
    return;
  }
  callback.success(session.storage);
};

// return session token, if expires refresh, if doesn't exist returns undefined
session.valid = function (callback) {
  if (session.storage && session.storage.access_token) {
    return session.refresh(callback);
  }
  return callback.error();
};

session.isExpired = function () {
  return !(
    session.storage.expires_in &&
    session.storage.expires_in >= new Date().getTime()
  );
};

session.update = function () {
  localStorage.setItem("session", JSON.stringify(session.storage));
  return session.storage;
};

session.clear = function () {
  session.storage = {
    account: {
      password: NaN,
      username: NaN,
      avatar: "0001-cr-white-orange.png",
      premium: false,
      language: NaN,
    },
    cookies: {
      bucket: NaN,
      policy: NaN,
      signature: NaN,
      key_pair_id: NaN,
      expires: NaN,
    },
    id: NaN,
    country: NaN,
    token_type: NaN,
    access_token: NaN,
    expires_in: NaN,
    refresh_token: NaN,
  };
  session.update();
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
  var id;
  try {
    id = webapis.network.getMac().replace(/:/g, "");
  } catch (error) {
    console.log("fail on get mac address");
    id = session.randomString(12);
  }
  return `difix-${id}`;
};
