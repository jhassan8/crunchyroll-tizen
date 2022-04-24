var service = {
  api: {
    // url: "https://api.crunchyroll.com",
    url: "127.0.0.1:3001",
    device_id: "SI30Gv4YwPEW3m8NBAUE0EfJyFteHMW9",
    device_type: "com.crunchyroll.windows.desktop",
    access_token: "LNDJgOit5yaRIWN",
  },
};

service.device = function (request) {
  var params = `device_id=${this.device_id}&device_type=${this.device_type}&access_token=${this.access_token}`;
  var http = new XMLHttpRequest();
  http.open("GET", this.api.url + `start_session.0.json?${params}`, true);

  http.onload = function () {
    if (http.readyState == 4) {
      if (http.status == 200) {
        request.success(new Function("return " + http.responseText + ";")());
      } else {
        request.error();
      }
    }
  };

  http.send();
};

service.login = function (request) {
  var params = `session_id=${request.session_id}&password=${request.password}&account=${request.account}`;

  var http = new XMLHttpRequest();
  http.open("POST", this.api.url + "login.0.json", true);

  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  http.onload = function () {
    if (http.readyState == 4) {
      if (http.status == 200) {
        request.success(new Function("return " + http.responseText + ";")());
      } else {
        request.error();
      }
    }
  };

  http.send(params);
};

service.video = function (request) {
  var params =
    "mac=" +
    request.data.mac +
    "&token=" +
    request.data.token +
    "&id=" +
    request.data.id;

  var http = new XMLHttpRequest();
  http.open("GET", main.urls.api + "crunchyroll/video?" + params, true);

  http.onreadystatechange = function () {
    if (http.readyState == 4) {
      if (http.status == 200) {
        request.success(new Function("return " + http.responseText + ";")());
      } else {
        request.error();
      }
    }
  };

  http.send();
};

service.episode = function (request) {
  var params =
    "mac=" +
    request.data.mac +
    "&token=" +
    request.data.token +
    "&id=" +
    request.data.id;

  var http = new XMLHttpRequest();
  http.open("GET", main.urls.api + "crunchyroll/episode?" + params, true);

  http.onreadystatechange = function () {
    if (http.readyState == 4) {
      if (http.status == 200) {
        request.success(new Function("return " + http.responseText + ";")());
      } else {
        request.error();
      }
    }
  };

  http.send();
};

service.season = function (request) {
  var params =
    "mac=" +
    request.data.mac +
    "&token=" +
    request.data.token +
    "&id=" +
    request.data.id;

  var http = new XMLHttpRequest();
  http.open("GET", main.urls.api + "crunchyroll/season?" + params, true);

  http.onreadystatechange = function () {
    if (http.readyState == 4) {
      if (http.status == 200) {
        request.success(new Function("return " + http.responseText + ";")());
      } else {
        request.error();
      }
    }
  };

  http.send();
};

service.list = function (request) {
  var params =
    "mac=" +
    request.data.mac +
    "&token=" +
    request.data.token +
    "&type=" +
    request.data.type +
    "&filter=" +
    request.data.filter;

  var http = new XMLHttpRequest();
  http.open("GET", main.urls.api + "crunchyroll/list?" + params, true);

  http.onreadystatechange = function () {
    if (http.readyState == 4) {
      if (http.status == 200) {
        request.success(new Function("return " + http.responseText + ";")());
      } else {
        request.error();
      }
    }
  };

  http.send();
};
