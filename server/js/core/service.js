var service = {
  api: {
    url: "https://beta-api.crunchyroll.com",
    //url: "http://localhost:3002",
    auth: "Basic aHJobzlxM2F3dnNrMjJ1LXRzNWE6cHROOURteXRBU2Z6QjZvbXVsSzh6cUxzYTczVE1TY1k=",
  },
};

service.token = function (request) {
  var headers = new Headers();
  headers.append("Authorization", service.api.auth);
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  var params = service.format({
    username: request.data.username,
    password: request.data.password,
    grant_type: "password",
    scope: "offline_access",
  });

  fetch(`${service.api.url}/auth/v1/token`, {
    method: "POST",
    headers: headers,
    body: params,
  })
    .then((response) => response.json())
    .then((json) => request.success && request.success(json))
    .catch((error) => {
      console.log(error);
      request.error && request.error(error);
    });
};

service.refresh = function (request) {
  var headers = new Headers();
  headers.append("Authorization", service.api.auth);
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  var params = service.format({
    refresh_token: session.storage.refresh_token,
    grant_type: "refresh_token",
    scope: "offline_access",
  });

  fetch(`${service.api.url}/auth/v1/token`, {
    method: "POST",
    headers: headers,
    body: params,
  })
    .then((response) => response.json())
    .then((json) => request.success(json))
    .catch((error) => request.error(error));
};

service.profile = function (request) {
  return session.refresh({
    success: function (storage) {
      var headers = new Headers();
      headers.append("Authorization", `Bearer ${storage.access_token}`);
      headers.append("Content-Type", "application/x-www-form-urlencoded");

      fetch(`${service.api.url}/accounts/v1/me/profile`, {
        headers: headers,
      })
        .then((response) => response.json())
        .then((json) => request.success(json))
        .catch((error) => request.error(error));
    },
  });
};

service.cookies = function (request) {
  return session.refresh({
    success: function (storage) {
      var headers = new Headers();
      headers.append("Authorization", `Bearer ${storage.access_token}`);
      headers.append("Content-Type", "application/x-www-form-urlencoded");

      fetch(`${service.api.url}/index/v2`, {
        headers: headers,
      })
        .then((response) => response.json())
        .then((json) => request.success(json))
        .catch((error) => request.error(error));
    },
  });
};

service.home = function (request) {
  return session.refresh({
    success: function (storage) {
      var headers = new Headers();
      headers.append("Authorization", `Bearer ${storage.access_token}`);
      headers.append("Content-Type", "application/x-www-form-urlencoded");

      fetch(
        `${service.api.url}/content/v2/discover/${storage.id}/home_feed?start=0&n=100&locale=${storage.account.language}`,
        {
          headers: headers,
        }
      )
        .then((response) => response.json())
        .then((json) => request.success(json))
        .catch((error) => request.error(error));
    },
  });
};

service.continue = function (request) {
  return session.refresh({
    success: function (storage) {
      var headers = new Headers();
      headers.append("Authorization", `Bearer ${storage.access_token}`);
      headers.append("Content-Type", "application/x-www-form-urlencoded");

      fetch(
        `${service.api.url}/content/v2/discover/up_next/${request.data.ids}?locale=${storage.account.language}`,
        {
          headers: headers,
        }
      )
        .then((response) => response.json())
        .then((json) => request.success(json))
        .catch((error) => request.error(error));
    },
  });
};

service.seasons = function (request) {
  return session.cookies({
    success: function (storage) {
      var headers = new Headers();
      headers.append("Content-Type", "application/x-www-form-urlencoded");

      fetch(
        `${service.api.url}/cms/v2${storage.cookies.bucket}/seasons?series_id=${request.data.id}&locale=${storage.account.language}&Signature=${storage.cookies.signature}&Policy=${storage.cookies.policy}&Key-Pair-Id=${storage.cookies.key_pair_id}`,
        {
          headers: headers,
        }
      )
        .then((response) => response.json())
        .then((json) => request.success(json))
        .catch((error) => request.error(error));
    },
    error: function (error) {
      request.error(error);
    },
  });
};

service.episodes = function (request) {
  return session.cookies({
    success: function (storage) {
      var headers = new Headers();
      headers.append("Content-Type", "application/x-www-form-urlencoded");

      fetch(
        `${service.api.url}/cms/v2${storage.cookies.bucket}/episodes?season_id=${request.data.id}&locale=${storage.account.language}&Signature=${storage.cookies.signature}&Policy=${storage.cookies.policy}&Key-Pair-Id=${storage.cookies.key_pair_id}`,
        {
          headers: headers,
        }
      )
        .then((response) => response.json())
        .then((json) => request.success(json))
        .catch((error) => request.error(error));
    },
    error: function (error) {
      request.error(error);
    },
  });
};

service.video = function (request) {
  return session.cookies({
    success: function (storage) {
      var headers = new Headers();
      headers.append("Content-Type", "application/x-www-form-urlencoded");

      fetch(
        `${service.api.url}/cms/v2${storage.cookies.bucket}/videos/${request.data.id}/streams?Signature=${storage.cookies.signature}&Policy=${storage.cookies.policy}&Key-Pair-Id=${storage.cookies.key_pair_id}`,
        {
          headers: headers,
        }
      )
        .then((response) => response.json())
        .then((json) => request.success(json))
        .catch((error) => request.error(error));
    },
    error: function (error) {
      request.error(error);
    },
  });
};

service.search = function (request) {
  return session.refresh({
    success: function (storage) {
      var headers = new Headers();
      headers.append("Authorization", `Bearer ${storage.access_token}`);
      headers.append("Content-Type", "application/x-www-form-urlencoded");
      fetch(
        `${service.api.url}/content/v2/search?q=${request.data.query}&type=series&n=100&locale=${storage.account.language}`,
        {
          headers: headers,
        }
      )
        .then((response) => response.json())
        .then((json) => request.success(json))
        .catch((error) => request.error(error));
    },
  });
};

service.format = function (params) {
  return Object.keys(params)
    .map(function (k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
    })
    .join("&");
};
