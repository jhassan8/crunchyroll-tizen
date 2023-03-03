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

session.cookies = function (callback) {
  if (session.isExpired(true)) {
    service.cookies({
      success: function (response) {
        session.storage.cookies.bucket = response.cms.bucket;
        session.storage.account.premium =
          session.storage.cookies.bucket.includes("crunchyroll");
        session.storage.cookies.policy = response.cms.policy;
        session.storage.cookies.signature = response.cms.signature;
        session.storage.cookies.key_pair_id = response.cms.key_pair_id;
        session.storage.cookies.expires = new Date(
          response.cms.expires
        ).getTime();

        callback.success(session.update());
      },
      error: function (error) {
        callback.error(error);
      },
    });
  } else {
    callback.success(session.storage);
  }
};

session.load_account = function () {
  service.profile({
    success: function (response) {
      session.storage.account.language =
        response.preferred_content_subtitle_language;
      session.storage.account.avatar = response.avatar;
      session.update();
    },
  });

  session.cookies({
    success: function (response) {},
    error: function (error) {},
  });
};

// return session token, if expires refresh, if doesn't exist returns undefined
session.valid = function (callback) {
  if (session.storage && session.storage.access_token) {
    return session.refresh(callback);
  }
  return callback.error();
};

session.isExpired = function (coockie_type) {
  var expire_date = coockie_type
    ? session.storage.cookies.expires
    : session.storage.expires_in;
  return !(expire_date && expire_date >= new Date().getTime());
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
