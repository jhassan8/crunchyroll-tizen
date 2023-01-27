var service = {
  api: {
    url: "https://api.crunchyroll.com/",
    device_type: "com.crunchyroll.windows.desktop",
    access_token: "LNDJgOit5yaRIWN",
  },
  requests: {
    list: null,
  },
};

service.device = function (request) {
  var params = `device_id=${request.data.device_id}&device_type=${service.api.device_type}&access_token=${service.api.access_token}`;
  var http = new XMLHttpRequest();
  http.open("GET", this.api.url + `start_session.0.json?${params}`, true);

  http.onload = function () {
    if (http.readyState == 4) {
      if (http.status == 200) {
        var response = new Function("return " + http.responseText + ";")();
        if (response.error) {
          request.error();
        } else {
          request.success(response);
        }
      } else {
        request.error();
      }
    }
  };

  http.send();
};

service.login = function (request) {
  var params = `session_id=${request.data.session_id}&password=${request.data.password}&account=${request.data.account}`;

  var http = new XMLHttpRequest();
  http.open("POST", this.api.url + "login.0.json", true);

  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  http.onload = function () {
    if (http.readyState == 4) {
      if (http.status == 200) {
        var response = new Function("return " + http.responseText + ";")();
        if (response.error) {
          request.error();
        } else {
          request.success(response);
        }
      } else {
        request.error();
      }
    }
  };

  http.send(params);
};

service.list = function (request) {
  service.abort(service.requests.list);
  var params = `locale=${session.info.settings.subtitles}&session_id=${session.info.id}&media_type=${request.data.type}&filter=${request.data.filter}&limit=100000&fields=series.name,series.description,series.series_id,series.portrait_image,image.thumb_url`;

  service.requests.list = new XMLHttpRequest();
  service.requests.list.open("POST", this.api.url + "list_series.0.json", true);
  service.requests.list.setRequestHeader(
    "Content-type",
    "application/x-www-form-urlencoded"
  );

  service.requests.list.onreadystatechange = function () {
    if (service.requests.list.readyState == 4) {
      if (service.requests.list.status == 200) {
        var response = new Function(
          "return " + service.requests.list.responseText + ";"
        )();
        if (response.error) {
          request.error();
        } else {
          request.success(response);
        }
      } else {
        request.error();
      }
    }
  };

  service.requests.list.send(params);
};

service.season = function (request) {
  var params = `locale=${session.info.settings.subtitles}&session_id=${session.info.id}&series_id=${request.data.series_id}&limit=100000&fields=collection.collection_id,collection.season,collection.name,collection.description,collection.media_count,collection.portrait_image,image.thumb_url`;

  var http = new XMLHttpRequest();
  http.open("POST", this.api.url + "list_collections.0.json", true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  http.onreadystatechange = function () {
    if (http.readyState == 4) {
      if (http.status == 200) {
        var response = new Function("return " + http.responseText + ";")();
        if (response.error) {
          request.error();
        } else {
          request.success(response);
        }
      } else {
        request.error();
      }
    }
  };

  http.send(params);
};

service.episode = function (request) {
  var params = `locale=${session.info.settings.subtitles}&session_id=${session.info.id}&collection_id=${request.data.collection_id}&limit=100000&fields=media.media_id,media.episode_number,media.name,media.description,media.screenshot_image,image.fwide_url,image.fwidestar_url,media.available,media.free_available`;

  var http = new XMLHttpRequest();
  http.open("POST", this.api.url + "list_media.0.json", true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  http.onreadystatechange = function () {
    if (http.readyState == 4) {
      if (http.status == 200) {
        var response = new Function("return " + http.responseText + ";")();
        if (response.error) {
          request.error();
        } else {
          request.success(response);
        }
      } else {
        request.error();
      }
    }
  };

  http.send(params);
};

service.video = function (request) {
  var params = `locale=${session.info.settings.subtitles}&session_id=${session.info.id}&media_id=${request.data.media_id}&limit=100000&fields=media.stream_data,media.name,media.episode_number`;

  var http = new XMLHttpRequest();
  http.open("POST", this.api.url + "info.0.json", true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  http.onreadystatechange = function () {
    if (http.readyState == 4) {
      if (http.status == 200) {
        var response = new Function("return " + http.responseText + ";")();
        if (response.error) {
          request.error();
        } else {
          request.success(response);
        }
      } else {
        request.error();
      }
    }
  };

  http.send(params);
};

service.abort = function (request) {
  if (request) {
    request.abort();
  }
};
