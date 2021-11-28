var audio = {
  plugin: null,
};

audio.init = function () {
  var success = true;
  this.plugin = document.getElementById("pluginAudio");
  if (!this.plugin) success = false;
  audio.setMute(audio.getMute());
  return success;
};

audio.setRelativeVolume = function (delta) {
  this.plugin.SetVolumeWithKey(delta);
};

audio.getVolume = function () {
  return this.plugin.GetVolume();
};

audio.setMute = function (state) {
  this.plugin.SetUserMute(state);
};

audio.getMute = function () {
  return this.plugin.GetUserMute();
};
