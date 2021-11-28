var player = {
  plugin: null,
  audio: null,
  state: -1,
  skipState: -1,
  stopCallback: null,
  originalSource: null,
  reload: true,
  STOPPED: 0,
  PLAYING: 1,
  PAUSED: 2,
  FORWARD: 3,
  REWIND: 4,
  TOTAL_BUFFER_SIZE_IN_BYTES: 100 * 1024 * 1024,
  INITIAL_BUFFERPER_CENT: 50,
  PENDING_BUFFER_PERCENT: 60,
  buff: 0,
};

player.init = function () {
  var success = true;
  this.state = this.STOPPED;
  this.plugin = document.getElementById("pluginPlayer");
  this.audio = document.getElementById("pluginAudio");
  if (!this.plugin) success = false;
  else {
    var mwPlugin = document.getElementById("pluginTVMW");
    if (!mwPlugin) success = false;
    else {
      try {
        this.originalSource = mwPlugin.GetSource();
      } catch (e) {
        alert("Error= " + e);
      }
      try {
        mwPlugin.SetMediaSource();
      } catch (e) {
        alert("Error= " + e);
      }
    }
  }
  this.setFullscreen();
  this.plugin.OnBufferingComplete = "player.onBufferingComplete";
  return success;
};

player.setRelativeVolume = function (value) {
  this.audio.SetVolumeWithKey(value);
};

player.getVolume = function () {
  return this.audio.GetVolume();
};

player.deinitialize = function () {
  var mwPlugin = document.getElementById("pluginTVMW");
  this.stopVideo();
  if (mwPlugin && this.originalSource !== null)
    mwPlugin.SetSource(this.originalSource);
};

player.setFullscreen = function () {
  try {
    this.plugin.SetDisplayArea(0, 0, 960, 540);
  } catch (e) {
    alert("Error= " + e);
  }
};

player.play = function (url) {
  if (this.url === null) alert("No videos to play");
  else {
    console.log(url);
    this.state = this.PLAYING;
    this.plugin.Play(url);
    this.audio.SetSystemMute(false);
  }
};

player.pause = function () {
  this.state = this.PAUSED;
  this.plugin.Pause();
};

player.stop = function () {
  if (this.state != this.STOPPED) {
    this.state = this.STOPPED;
    this.plugin.Stop();
  }
};

player.resume = function () {
  this.state = this.PLAYING;
  this.plugin.Resume();
};

player.onBufferingComplete = function () {
  document.getElementById("pluginPlayer").visibility == "visible";
  switch (this.skipState) {
    case this.FORWARD:
      break;
    case this.REWIND:
      break;
  }
};
