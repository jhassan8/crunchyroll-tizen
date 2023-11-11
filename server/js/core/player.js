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
  thumbnails: [],

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
    } else if (player.getVideo().canPlayType("application/vnd.apple.mpegurl")) {
      player.getVideo().src = url;
    }
    if (playhead && playhead > 0) {
      player.getVideo().currentTime = playhead * 60;
    }
    if (!noplay) {
      player.getVideo().play();
      player.state = player.states.PLAYING;
    }
    setTimeout(() => {
      player.preview.generate();
    }, 200);
  },

  preview: {
    generate: function () {
      player.thumbnails = [];
      var url = player.plugin.url;
      var videoHidden = document.getElementById("videohidden");
      var pluginHidden = new Hls();
      pluginHidden.loadSource(url);
      pluginHidden.attachMedia(videoHidden);
      pluginHidden.currentLevel = 0;
      videoHidden.pause();

      var thumbnailWidth = 158;
      var thumbnailHeight = 90;
      var canvas;

      function generateThumbnail(i, callback) {
        canvas = document.createElement("canvas");
        canvas.width = thumbnailWidth;
        canvas.height = thumbnailHeight;
        var context = canvas.getContext("2d");
        videoHidden.currentTime = i;

        var event = function () {
          context.drawImage(videoHidden, 0, 0, thumbnailWidth, thumbnailHeight);

          player.thumbnails.push({
            id: i,
            data: canvas.toDataURL("image/jpeg"),
          });

          videoHidden.removeEventListener("canplay", event);
          callback();
        };

        videoHidden.addEventListener("canplay", event);
      }

      function generateThumbnailsSequentially(i) {
        if (i <= player.getDuration()) {
          generateThumbnail(i, function () {
            generateThumbnailsSequentially(i + 10);
          });
        }
      }

      generateThumbnailsSequentially(0);
    },

    get: function (time) {
      for (var item of player.thumbnails) {
        if (time >= item.id && time < item.id + 10) {
          $("#preview").attr("src", item.data);
          return;
        }
      }
    },
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
    player.values.forward_rewind -= 10;
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
    player.values.forward_rewind += 10;
    callback(player.values.forward_rewind);
    player.timers.forward_rewind = setTimeout(function () {
      player.getVideo().currentTime =
        player.values.forward_rewind + player.getPlayed() >
        player.getDuration() - 10
          ? player.getPlayed()
          : player.values.forward_rewind + player.getPlayed();
      player.values.forward_rewind = 0;
      player.resume();
    }, 500);
  },

  forwardTo: function (seconds) {
    player.getVideo().currentTime = seconds;
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
