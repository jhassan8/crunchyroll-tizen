var session = {
  info: {
    id: undefined,
    device: undefined,
    password: undefined,
    username: undefined,
    expires: undefined,
    premium: undefined,
  },
};

session.start = function (username, password) {
  if (!this.info.device) {
    this.info.device = this.generateDevice();
    service.device({
      data: {
        device_id: this.info.device,
      },
      success: function (response) {
        session.info.expires = response.data.expires;
        session.info.id = response.data.session_id;
        session.set(session.info).then((status) => {
          console.log("guardo o no " + status);
          main.events.isLogged();
        });
      },
      error: function () {
        main.events.isLogged();
      },
    });
  }

  this.info.username = username;
  this.info.password = password;

  service.login({
    data: {
      session_id: this.info.id,
      password: this.info.password,
      account: this.info.username,
    },
    success: function (response) {
      session.info.expires = response.data.expires;
      session.info.premium = response.data.user.premium;
      session.set(session.info);
      main.events.isLogged();
    },
    error: function () {
      main.events.isLogged();
    },
  });

  console.log("username: " + username);
  console.log("password: " + password);
};

// return session token, if expires refresh, if doesn't exist returns undefined
session.get = async function () {
  let info = await file.read("crunchyroll");
  if (!info) {
    return;
  }

  this.info = JSON.parse(info);
  if (this.isExpired(new Date(session.info.expires))) {
    this.start(this.info.username, this.info.password);
  }

  return this.info.id;
};

session.isExpired = function (date) {
  date.setDate(date.getDate() - 1);
  return date.getTime() <= new Date().getTime();
};

session.set = async function (data) {
  var dataString = JSON.stringify(data);
  console.log(dataString);
  var status = await file.write("crunchyroll", dataString);
  if (status) {
    console.log("error save file");
  }
  return status;
};

session.generateDevice = function () {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};
