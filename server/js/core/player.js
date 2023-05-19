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

  getVideo: function () {
    if (!player.video) {
      player.video = document.getElementById("videoplayer");
    }
    return player.video;
  },

  config: function (timeFunction, endFunction) {
    player.getVideo().addEventListener("timeupdate", timeFunction);
    player.getVideo().addEventListener("ended", endFunction);
  },

  getPlayed: function () {
    return player.getVideo().currentTime;
  },

  getDuration: function () {
    return player.getVideo().duration;
  },

  play: function (url, playhead) {
    if (Hls.isSupported()) {
      player.plugin = new Hls();
      player.plugin.loadSource(url);
      player.plugin.attachMedia(player.getVideo());

      // player.plugin.on(Hls.Events.MANIFEST_PARSED, function () {
      //   console.log("MANIFEST_PARSED");
      // });

      // player.plugin.on(Hls.Events.MEDIA_ATTACHING, function () {
      //   console.log("MEDIA_ATTACHING");
      // });
      // player.plugin.on(Hls.Events.MEDIA_ATTACHED, function () {
      //   console.log("MEDIA_ATTACHED");
      // });
      // player.plugin.on(Hls.Events.MEDIA_DETACHING, function () {
      //   console.log("MEDIA_DETACHING");
      // });
      // player.plugin.on(Hls.Events.MEDIA_DETACHED, function () {
      //   console.log("MEDIA_DETACHED");
      // });
      // player.plugin.on(Hls.Events.BUFFER_RESET, function () {
      //   console.log("BUFFER_RESET");
      // });
      // player.plugin.on(Hls.Events.BUFFER_CODECS, function () {
      //   console.log("BUFFER_CODECS");
      // });
      // player.plugin.on(Hls.Events.BUFFER_CREATED, function () {
      //   console.log("BUFFER_CREATED");
      // });
      // player.plugin.on(Hls.Events.BUFFER_APPENDING, function () {
      //   console.log("BUFFER_APPENDING");
      // });
      // player.plugin.on(Hls.Events.BUFFER_APPENDED, function () {
      //   console.log("BUFFER_APPENDED");
      // });
      // player.plugin.on(Hls.Events.BUFFER_EOS, function () {
      //   console.log("BUFFER_EOS");
      // });
      // player.plugin.on(Hls.Events.BUFFER_FLUSHING, function () {
      //   console.log("BUFFER_FLUSHING");
      // });
      // player.plugin.on(Hls.Events.BUFFER_FLUSHED, function () {
      //   console.log("BUFFER_FLUSHED");
      // });
      // player.plugin.on(Hls.Events.MANIFEST_LOADING, function () {
      //   console.log("MANIFEST_LOADING");
      // });
      // player.plugin.on(Hls.Events.MANIFEST_LOADED, function () {
      //   console.log("MANIFEST_LOADED");
      // });
      // player.plugin.on(Hls.Events.LEVEL_SWITCHING, function () {
      //   console.log("LEVEL_SWITCHING");
      // });
      // player.plugin.on(Hls.Events.LEVEL_SWITCHED, function () {
      //   console.log("LEVEL_SWITCHED");
      // });
      // player.plugin.on(Hls.Events.LEVEL_LOADING, function () {
      //   console.log("LEVEL_LOADING");
      // });
      // player.plugin.on(Hls.Events.LEVEL_LOADED, function () {
      //   console.log("LEVEL_LOADED");
      // });
      // player.plugin.on(Hls.Events.LEVEL_UPDATED, function () {
      //   console.log("LEVEL_UPDATED");
      // });
      // player.plugin.on(Hls.Events.LEVEL_PTS_UPDATED, function () {
      //   console.log("LEVEL_PTS_UPDATED");
      // });
      // player.plugin.on(Hls.Events.LEVELS_UPDATED, function () {
      //   console.log("LEVELS_UPDATED");
      // });
      // player.plugin.on(Hls.Events.AUDIO_TRACKS_UPDATED, function () {
      //   console.log("AUDIO_TRACKS_UPDATED");
      // });
      // player.plugin.on(Hls.Events.AUDIO_TRACK_SWITCHING, function () {
      //   console.log("AUDIO_TRACK_SWITCHING");
      // });
      // player.plugin.on(Hls.Events.AUDIO_TRACK_SWITCHED, function () {
      //   console.log("AUDIO_TRACK_SWITCHED");
      // });
      // player.plugin.on(Hls.Events.AUDIO_TRACK_LOADING, function () {
      //   console.log("AUDIO_TRACK_LOADING");
      // });
      // player.plugin.on(Hls.Events.AUDIO_TRACK_LOADED, function () {
      //   console.log("AUDIO_TRACK_LOADED");
      // });
      // player.plugin.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, function () {
      //   console.log("SUBTITLE_TRACKS_UPDATED");
      // });
      // player.plugin.on(Hls.Events.SUBTITLE_TRACKS_CLEARED, function () {
      //   console.log("SUBTITLE_TRACKS_CLEARED");
      // });
      // player.plugin.on(Hls.Events.SUBTITLE_TRACK_SWITCH, function () {
      //   console.log("SUBTITLE_TRACK_SWITCH");
      // });
      // player.plugin.on(Hls.Events.SUBTITLE_TRACK_LOADING, function () {
      //   console.log("SUBTITLE_TRACK_LOADING");
      // });
      // player.plugin.on(Hls.Events.SUBTITLE_TRACK_LOADED, function () {
      //   console.log("SUBTITLE_TRACK_LOADED");
      // });
      // player.plugin.on(Hls.Events.SUBTITLE_FRAG_PROCESSED, function () {
      //   console.log("SUBTITLE_FRAG_PROCESSED");
      // });
      // player.plugin.on(Hls.Events.CUES_PARSED, function () {
      //   console.log("CUES_PARSED");
      // });
      // player.plugin.on(Hls.Events.NON_NATIVE_TEXT_TRACKS_FOUND, function () {
      //   console.log("NON_NATIVE_TEXT_TRACKS_FOUND");
      // });
      // player.plugin.on(Hls.Events.INIT_PTS_FOUND, function () {
      //   console.log("INIT_PTS_FOUND");
      // });
      // player.plugin.on(Hls.Events.FRAG_LOADING, function () {
      //   console.log("FRAG_LOADING");
      // });
      // player.plugin.on(Hls.Events.FRAG_LOAD_EMERGENCY_ABORTED, function () {
      //   console.log("FRAG_LOAD_EMERGENCY_ABORTED");
      // });
      // player.plugin.on(Hls.Events.FRAG_LOADED, function () {
      //   console.log("FRAG_LOADED");
      // });
      // player.plugin.on(Hls.Events.FRAG_DECRYPTED, function () {
      //   console.log("FRAG_DECRYPTED");
      // });
      // player.plugin.on(Hls.Events.FRAG_PARSING_INIT_SEGMENT, function () {
      //   console.log("FRAG_PARSING_INIT_SEGMENT");
      // });
      // player.plugin.on(Hls.Events.FRAG_PARSING_USERDATA, function () {
      //   console.log("FRAG_PARSING_USERDATA");
      // });
      // player.plugin.on(Hls.Events.FRAG_PARSING_METADATA, function () {
      //   console.log("FRAG_PARSING_METADATA");
      // });
      // player.plugin.on(Hls.Events.FRAG_PARSED, function () {
      //   console.log("FRAG_PARSED");
      // });
      // player.plugin.on(Hls.Events.FRAG_BUFFERED, function () {
      //   console.log("FRAG_BUFFERED");
      // });
      // player.plugin.on(Hls.Events.FRAG_CHANGED, function () {
      //   console.log("FRAG_CHANGED");
      // });
      // player.plugin.on(Hls.Events.FPS_DROP, function () {
      //   console.log("FPS_DROP");
      // });
      // player.plugin.on(Hls.Events.FPS_DROP_LEVEL_CAPPING, function () {
      //   console.log("FPS_DROP_LEVEL_CAPPING");
      // });
      // player.plugin.on(Hls.Events.ERROR, function () {
      //   console.log("ERROR");
      // });
      // player.plugin.on(Hls.Events.DESTROYING, function () {
      //   console.log("DESTROYING");
      // });
      // player.plugin.on(Hls.Events.KEY_LOADING, function () {
      //   console.log("KEY_LOADING");
      // });
      // player.plugin.on(Hls.Events.KEY_LOADED, function () {
      //   console.log("KEY_LOADED");
      // });
      // player.plugin.on(Hls.Events.LIVE_BACK_BUFFER_REACHED, function () {
      //   console.log("LIVE_BACK_BUFFER_REACHED");
      // });
    } else if (player.getVideo().canPlayType("application/vnd.apple.mpegurl")) {
      player.getVideo().src = url;
    }
    if (playhead && playhead > 0) {
      player.getVideo().currentTime = playhead * 60;
    }
    player.getVideo().play();
    player.state = player.states.PLAYING;
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

  onbufferingprogress: function (percent) {
    video.showBTN("loading", `${percent} %`);
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
