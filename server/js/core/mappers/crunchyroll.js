var crunchyroll = {
  loaded: 0,
};

crunchyroll.home = function (response, callback) {
  var lists = response.data.filter((element) =>
    [
      "recommendations",
      "history",
      "browse",
      "series",
      "because_you_watched",
    ].includes(element.response_type)
  );

  home.data.main = {
    banner: {
      id: response.data[1].panel.id,
      title: response.data[1].panel.title,
      description: response.data[1].panel.description,
      background: response.data[1].panel.images.poster_wide[0][4].source,
    },
    lists: lists.map((list) => ({
      title: list.title,
      items: [],
    })),
  };

  for (var index = 0; index < lists.length; index++) {
    crunchyroll.load(lists[index], index, {
      success: function (test, on) {
        home.data.main.lists[on].items = test.data.map((item) => {
          var title,
            description,
            background,
            poster,
            display,
            playhead,
            duration,
            type;
          if (item.panel || item.type === "episode") {
            type = item.__class__;
            display = "episode";
            id = item.panel ? item.panel.id : item.id;
            playhead = item.playhead ? Math.round(item.playhead / 60) : 0;
            duration = Math.round(
              (item.panel
                ? item.panel.episode_metadata.duration_ms
                : item.episode_metadata.duration_ms) / 60000
            );
            title = item.panel
              ? item.panel.episode_metadata.series_title
              : item.title;
            description = item.panel ? item.panel.title : item.description;
            background = item.panel
              ? item.panel.images.thumbnail[0][4].source
              : item.images.thumbnail[0][4].source;
          } else {
            type = item.__class__;
            display = "serie";
            id = item.id;
            title = item.title;
            description = item.description;
            background = item.images.poster_wide[0][5].source;
            poster = item.images.poster_tall[0][2].source;
          }

          return {
            id,
            type,
            display,
            title,
            description,
            background,
            poster,
            duration,
            playhead,
          };
        });
        crunchyroll.loaded++;
        crunchyroll.loaded === lists.length && callback.success();
      },
    });
  }
};

crunchyroll.load = (item, index, callback) => {
  var url;
  if (item.resource_type === "dynamic_collection") {
    url = item.link;
  } else {
    url = `/content/v2/cms/objects/${item.ids.join()}?locale=es-419`;
  }

  session.refresh({
    success: function (storage) {
      var headers = new Headers();
      headers.append("Authorization", `Bearer ${storage.access_token}`);
      headers.append("Content-Type", "application/x-www-form-urlencoded");

      return fetch(`${service.api.url}${url}`, { headers: headers })
        .then((response) => response.json())
        .then((json) => callback.success(json, index))
        .catch((error) => {
          console.log(error);
        });
    },
  });
};

crunchyroll.continue = function (response) {
  var item = response.data[0];
  return {
    stream: item.panel.streams_link.substr(
      item.panel.streams_link.indexOf("/videos/") + 8,
      9
    ),
    serie: item.panel.episode_metadata.series_title,
    episode: item.panel.title,
    season_number: item.panel.episode_metadata.season_number,
    episode_number: item.panel.episode_metadata.episode_number,
    description: item.panel.description,
    background: item.panel.images.thumbnail[0][4].source,
    watched: !item.never_watched,
    played:
      (item.playhead * 100) / (item.panel.episode_metadata.duration_ms / 1000),
  };
};

crunchyroll.seasons = function (response) {
  return response.items.map((season) => ({
    id: season.id,
    title: season.title,
    number: season.season_number,
  }));
};

crunchyroll.episodes = function (response, callback) {
  var episodes = response.items.map((episode) => ({
    id: episode.id,
    title: episode.title,
    episode: episode.title,
    serie: episode.series_title,
    description: episode.description,
    number: episode.episode_number,
    episode_number: episode.episode_number,
    background: episode.images.thumbnail ? episode.images.thumbnail[0][1].source : '',
    stream: episode.__links__.streams.href.substr(
      episode.__links__.streams.href.indexOf("/videos/") + 8,
      9
    ),
    duration: Math.round(episode.duration_ms / 60000),
    premium: episode.is_premium_only,
  }));

  crunchyroll.playheads(episodes, function (playheads) {
    episodes = episodes.map((e) => {
      var element = playheads.get(e.id);
      e.playhead = element
        ? element.fully_watched
          ? e.duration
          : Math.round(element.playhead / 60)
        : 0;
      return e;
    });
    callback && callback(episodes);
  });
};

crunchyroll.playheads = function (episodes, callback) {
  service.playheads({
    data: {
      ids: episodes.map((e) => e.id).join(),
    },
    success: function (response) {
      var playheads = new Map(response.data.map((obj) => [obj.content_id, obj]));
      callback && callback(playheads);
    },
    error: function (error) {
      console.log(error);
    },
  });
};

crunchyroll.search = function (response) {
  return response.data.reduce(
    (acum, elem) =>
      elem.type === "series" || elem.type === "movie_listing"
        ? [
            ...acum,
            ...elem.items.map((item) => ({
              display: "serie",
              type: item.type,
              id: item.id,
              title: item.title,
              description: item.description,
              background: item.images.poster_wide[0][5].source,
              poster: item.images.poster_tall[0][2].source,
            })),
          ]
        : acum,
    []
  );
};
