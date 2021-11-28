var service = {
  api: {
    url: "https://api.crunchyroll.com",
    device_id: "SI30Gv4YwPEW3m8NBAUE0EfJyFteHMW9",
    device_type: "com.crunchyroll.windows.desktop",
    access_token: "LNDJgOit5yaRIWN",
  },
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

service.login = function (request) {
  var http = new XMLHttpRequest();
  http.open("POST", main.urls.api + "session/login", true);

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

  http.send(
    "username=" +
      request.data.username +
      "&password=" +
      request.data.password +
      "&mac=" +
      request.data.mac
  );
};
