var player = {
  states: {
    STOPPED: 0,
    PLAYING: 1,
    PAUSED: 2,
    FORWARD: 3,
    REWIND: 4,
  },
  state: -1,
  plugin: null,
  duration: 0
};

player.init = function () {
  player.state = this.STOPPED;
  player.plugin = document.getElementById('videoplayer');

  webapis.avplay.setListener({
    onbufferingstart: player.onbufferingstart,
    onbufferingprogress: player.onbufferingprogress,
    onbufferingcomplete: player.onbufferingcomplete,
    oncurrentplaytime: player.oncurrentplaytime,
    onstreamcompleted: player.onstreamcompleted,
    onevent: player.onevent,
    onerror: player.onerror,
    ondrmevent: player.ondrmevent,
    onsubtitlechange: player.onsubtitlechange
  });
};

player.setFullscreen = function () {
  try {
    webapis.avplay.setDisplayRect(0, 0, 1920, 1080);
  } catch (e) {
    console.log(e);
  }
};

player.play = function (url) {
  webapis.avplay.open(url);
  player.setFullscreen();

  webapis.avplay.prepareAsync(() => {
    player.state = player.states.PLAYING;
    player.duration = webapis.avplay.getDuration();
    webapis.avplay.play();
  }, (error) => {
    loggertest('PrepareErrorCallback ' + error);
  });
  video.hideBTN();
};

player.pause = function () {
  player.state = player.states.PAUSED;
  webapis.avplay.pause();
  video.showBTN('pause');
};

player.resume = function () {
  player.state = player.states.PLAYING;
  webapis.avplay.play();
  video.hideBTN();
};

player.stop = function () {
  if (player.state != player.states.STOPPED) {
    player.state = player.states.STOPPED;
    webapis.avplay.stop();
  }
  video.hideBTN();
};

player.getDuration = function() {
  return player.duration;
}

player.destroy = function () {
  player.stop();
};

player.onbufferingstart = function () {
  video.showBTN('loading');
}

player.onbufferingprogress = function (percent) {
  video.showBTN('loading', `${percent} %`);
}

player.onbufferingcomplete = function () {
  video.hideBTN()
}

player.oncurrentplaytime = function (currentTime) {
  video.setPlayingTime(currentTime);
}

player.onstreamcompleted = function () {
  loggertest('onstreamcompleted');
  app.stop();
}

player.onevent = function (eventType, eventData) {
  loggertest('onevent ' + eventType + ' - ' + eventData);
  console.log("eventType: " + eventType + ", " + eventData);
}

player.onerror = function (eventType) {
  loggertest('onerror ' + eventType);
}

player.ondrmevent = function (drmEvent, drmData) {
  loggertest('ondrmevent ' + drmEvent + ' - ' + drmData);
}

player.onsubtitlechange = function (duration, text, type, attriCount, attributes) {
  loggertest('onsubtitlechange');
}