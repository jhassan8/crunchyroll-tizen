window.service = {
  api: {
    url: "https://beta-api.crunchyroll.com",
    //url: "http://localhost:3002",
    auth: "Basic aHJobzlxM2F3dnNrMjJ1LXRzNWE6cHROOURteXRBU2Z6QjZvbXVsSzh6cUxzYTczVE1TY1k=",
  },

  token: function (request) {
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
  },

  refresh: function (request) {
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
  },

  profile: function (request) {
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
  },

  cookies: function (request) {
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
  },

  home: function (request) {
    return session.refresh({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Authorization", `Bearer ${storage.access_token}`);
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        fetch(
          `${service.api.url}/content/v2/discover/${storage.id}/home_feed?start=0&n=100&preferred_audio_language=${storage.account.audio}&locale=${storage.language}`,
          {
            headers: headers,
          }
        )
          .then((response) => response.json())
          .then((json) => request.success(json))
          .catch((error) => request.error(error));
      },
    });
  },

  continue: function (request) {
    return session.refresh({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Authorization", `Bearer ${storage.access_token}`);
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        fetch(
          `${service.api.url}/content/v2/discover/up_next/${request.data.ids}?locale=${storage.language}&preferred_audio_language=${storage.account.audio}`,
          {
            headers: headers,
          }
        )
          .then((response) => response.json())
          .then((json) => request.success(json))
          .catch((error) => request.error(error));
      },
    });
  },

  playheads: function (request) {
    return session.refresh({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Authorization", `Bearer ${storage.access_token}`);
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        fetch(
          `${service.api.url}/content/v2/${storage.id}/playheads?content_ids=${request.data.ids}&preferred_audio_language=${storage.account.audio}&locale=${storage.language}`,
          {
            headers: headers,
          }
        )
          .then((response) => response.json())
          .then((json) => request.success(json))
          .catch((error) => request.error(error));
      },
    });
  },

  seasons: function (request) {
    return session.cookies({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        fetch(
          `${service.api.url}/cms/v2${storage.cookies.bucket}/seasons?series_id=${request.data.id}&preferred_audio_language=${storage.account.audio}&locale=${storage.language}&Signature=${storage.cookies.signature}&Policy=${storage.cookies.policy}&Key-Pair-Id=${storage.cookies.key_pair_id}`,
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
  },

  episodes: function (request) {
    return session.cookies({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        fetch(
          `${service.api.url}/cms/v2${storage.cookies.bucket}/episodes?season_id=${request.data.id}&preferred_audio_language=${storage.account.audio}&locale=${storage.language}&Signature=${storage.cookies.signature}&Policy=${storage.cookies.policy}&Key-Pair-Id=${storage.cookies.key_pair_id}`,
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
  },

  video: function (request) {
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
  },

  search: function (request) {
    return session.refresh({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Authorization", `Bearer ${storage.access_token}`);
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        fetch(
          `${service.api.url}/content/v2/discover/search?q=${request.data.query}&type=series,movie_listing&n=100&locale=${storage.language}`,
          {
            headers: headers,
          }
        )
          .then((response) => response.json())
          .then((json) => request.success(json))
          .catch((error) => request.error(error));
      },
    });
  },

  history: function (request) {
    return session.refresh({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Authorization", `Bearer ${storage.access_token}`);
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        fetch(
          `${service.api.url}/content/v2/${storage.id}/watch-history?page_size=100&preferred_audio_language=${storage.account.audio}&locale=${storage.language}`,
          {
            headers: headers,
          }
        )
          .then((response) => response.json())
          .then((json) => request.success(json))
          .catch((error) => request.error(error));
      },
    });
  },

  setHistory: function (request) {
    return session.refresh({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Authorization", `Bearer ${storage.access_token}`);
        headers.append("Content-Type", "application/json");
        fetch(
          `${service.api.url}/content/v2/${storage.id}/playheads?preferred_audio_language=${storage.account.audio}&locale=${storage.language}`,
          {
            method: "POST",
            headers: headers,
            body: JSON.stringify(request.data),
          }
        )
          .then((response) => response.text())
          .then((json) => request.success(json))
          .catch((error) => request.error(error));
      },
    });
  },

  languages: function (request) {
    fetch("https://static.crunchyroll.com/config/i18n/v3/audio_languages.json")
      .then((response) => response.json())
      .then((json) => request.success(json))
      .catch((error) => request.error(error));
  },

  intro: function (request) {
    fetch(
      `https://static.crunchyroll.com/datalab-intro-v2/${request.data.id}.json`
    )
      .then((response) => response.json())
      .then((json) => request.success(json))
      .catch((error) => request.error(error));
  },

  categories: function (request) {
    return session.refresh({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Authorization", `Bearer ${storage.access_token}`);
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        fetch(
          `${service.api.url}/content/v1/tenant_categories?include_subcategories=true&locale=${storage.language}`,
          {
            headers: headers,
          }
        )
          .then((response) => response.json())
          .then((json) => request.success(json))
          .catch((error) => request.error(error));
      },
    });
  },

  format: function (params) {
    return Object.keys(params)
      .map(function (k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
      })
      .join("&");
  },
};
