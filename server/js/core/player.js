window.player = {
  states: {
    STOPPED: 0,
    PLAYING: 1,
    PAUSED: 2,
    FORWARD: 3,
    REWIND: 4,
  },
  values: {
    forward_rewind: 0,
  },
  timers: {
    forward_rewind: NaN,
  },
  state: -1,
  plugin: NaN,
  video: NaN,
  duration: 0,
  levelId: -1,

  getVideo: function () {
    if (!player.video) {
      player.video = document.getElementById("videoplayer");
    }
    return player.video;
  },

  config: function (timeFunction, endFunction) {
    player.getVideo().addEventListener("timeupdate", timeFunction);
    player.getVideo().addEventListener("ended", endFunction);
    player.getVideo().addEventListener("waiting", player.onbufferingstart);
    player.getVideo().addEventListener("playing", player.onbufferingcomplete);
    //player.getVideo().addEventListener("play", player.onPlay);
  },

  getPlayed: function () {
    return player.getVideo().currentTime;
  },

  getDuration: function () {
    return player.getVideo().duration;
  },

  play: function (url, playhead, noplay) {
    if (Hls.isSupported()) {
      player.plugin = new Hls();
      player.plugin.loadSource(url);
      player.plugin.attachMedia(player.getVideo());

      player.plugin.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        player.levelId = player.getQuality(data);
        player.plugin.startLevel = player.levelId;
        player.plugin.startLoad();

        player.plugin.currentLevel = player.levelId;
        if (!noplay) {
          player.getVideo().play();
          player.state = player.states.PLAYING;
        }
      });
    } else if (player.getVideo().canPlayType("application/vnd.apple.mpegurl")) {
      player.getVideo().src = url;
      if (!noplay) {
        player.getVideo().play();
        player.state = player.states.PLAYING;
      }
    }
    if (playhead && playhead > 0) {
      player.getVideo().currentTime = playhead * 60;
    }
  },

  pause: function () {
    player.getVideo().pause();
    player.state = player.states.PAUSED;
    video.showBTN("pause");
  },

  resume: function () {
    player.getVideo().play();
    video.hideBTN();
    player.state = player.states.PLAYING;
  },

  playPause: function () {
    if (player.getVideo().paused) {
      player.resume();
    } else {
      player.pause();
    }
  },

  rewind: function (callback) {
    player.pause();
    clearTimeout(player.timers.forward_rewind);
    video.showBTN("rewind");
    player.values.forward_rewind -= player.getDuration() * 0.01;
    callback(player.values.forward_rewind);
    player.timers.forward_rewind = setTimeout(function () {
      player.getVideo().currentTime =
        player.values.forward_rewind + player.getPlayed() < 0
          ? 0
          : player.values.forward_rewind + player.getPlayed();
      player.values.forward_rewind = 0;
      player.resume();
    }, 500);
  },

  forward: function (callback) {
    player.state = player.states.FORWARD;
    player.pause();
    clearTimeout(player.timers.forward_rewind);
    video.showBTN("forward");
    player.values.forward_rewind += player.getDuration() * 0.01;
    callback(player.values.forward_rewind);
    player.timers.forward_rewind = setTimeout(function () {
      player.getVideo().currentTime =
        player.values.forward_rewind + player.getPlayed() >
        player.getDuration() - player.getDuration() * 0.02
          ? player.getPlayed()
          : player.values.forward_rewind + player.getPlayed();
      player.values.forward_rewind = 0;
      player.resume();
    }, 500);
  },

  forwardTo: function (seconds) {
    player.getVideo().currentTime = seconds;
  },

  getQuality: function (data) {
    var id = Object.keys(data.levels).find(
      (key) => data.levels[key].height === +session.storage.quality
    );
    return id !== undefined ? id : -1;
  },

  stop: function () {
    if (player.state != player.states.STOPPED) {
      player.plugin.stopLoad();
      player.pause();
      player.plugin.destroy();
      player.plugin = NaN;
      player.video = NaN;
      player.STOP_CALLBACK && player.STOP_CALLBACK();
      player.state = player.states.STOPPED;
    }
  },

  speed: function (rate) {
    player.getVideo().playbackRate = rate;
  },

  destroy: function () {
    player.stop();
  },

  onbufferingstart: function () {
    video.showBTN("loading");
  },

  onbufferingcomplete: function () {
    video.hideBTN();
  },

  oncurrentplaytime: function (currentTime) {
    video.setPlayingTime(currentTime);
  },

  onstreamcompleted: function () {
    console.log("onstreamcompleted");
    app.stop();
  },

  onevent: function (eventType, eventData) {
    console.log("onevent " + eventType + " - " + eventData);
  },

  onerror: function (eventType) {
    console.log("onerror " + eventType);
  },

  ondrmevent: function (drmEvent, drmData) {
    console.log("ondrmevent " + drmEvent + " - " + drmData);
  },

  onsubtitlechange: function (duration, text, type, attriCount, attributes) {
    console.log("onsubtitlechange");
  },
};
