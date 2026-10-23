window.subtitleTranslate = {
  enabled: false,
  mode: "off",
  sourceLang: "ja",
  targetLang: "en",
  /**
   * Used only for OCR'd on-screen Japanese, not for official CR cues.
   * "mymemory" needs no key. "deepl" / "google" need apiKey.
   */
  provider: "mymemory",
  apiKey: "YOUR_API_KEY_HERE",
  ocrApiKey: "YOUR_OCR_API_KEY_HERE",
  cache: {},
  cues: [],
  cueIndex: 0,
  lastText: "",
  overlay: null,
  originalEl: null,
  translatedEl: null,
  nativeTracks: [],
  onCueChange: null,
  ocrBlocked: false,
  ocrTimer: NaN,
  lastOcrText: "",

  interceptSubtitleText: function (originalText) {
    var text = subtitleTranslate.cleanText(originalText);
    if (!text) {
      subtitleTranslate.hide();
      return Promise.resolve("");
    }
    if (text === subtitleTranslate.lastText) {
      return Promise.resolve(subtitleTranslate.cache[text] || text);
    }
    subtitleTranslate.lastText = text;
    if (subtitleTranslate.mode === "official-en") {
      subtitleTranslate.show(text, "");
      return Promise.resolve(text);
    }
    return subtitleTranslate.fetchTranslation(text).then(function (translated) {
      subtitleTranslate.show(translated, text);
      return translated;
    });
  },

  fetchTranslation: function (text) {
    if (subtitleTranslate.cache[text]) {
      return Promise.resolve(subtitleTranslate.cache[text]);
    }

    var request;
    if (subtitleTranslate.provider === "deepl") {
      request = fetch("https://api-free.deepl.com/v2/translate", {
        method: "POST",
        headers: {
          Authorization: "DeepL-Auth-Key " + subtitleTranslate.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: [text],
          source_lang: subtitleTranslate.sourceLang.toUpperCase(),
          target_lang: subtitleTranslate.targetLang.toUpperCase(),
        }),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (json) {
          return json.translations && json.translations[0]
            ? json.translations[0].text
            : text;
        });
    } else if (subtitleTranslate.provider === "google") {
      request = fetch(
        "https://translation.googleapis.com/language/translate/v2?key=" +
          encodeURIComponent(subtitleTranslate.apiKey),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: text,
            source: subtitleTranslate.sourceLang,
            target: subtitleTranslate.targetLang,
            format: "text",
          }),
        }
      )
        .then(function (res) {
          return res.json();
        })
        .then(function (json) {
          return json.data && json.data.translations && json.data.translations[0]
            ? json.data.translations[0].translatedText
            : text;
        });
    } else {
      request = fetch(
        "https://api.mymemory.translated.net/get?langpair=" +
          encodeURIComponent(
            subtitleTranslate.sourceLang + "|" + subtitleTranslate.targetLang
          ) +
          "&q=" +
          encodeURIComponent(text)
      )
        .then(function (res) {
          return res.json();
        })
        .then(function (json) {
          return json.responseData && json.responseData.translatedText
            ? json.responseData.translatedText
            : text;
        });
    }

    return request
      .then(function (translated) {
        subtitleTranslate.cache[text] = translated;
        return translated;
      })
      .catch(function (error) {
        console.log("subtitle translate failed", error);
        return text;
      });
  },

  ensureOverlay: function () {
    subtitleTranslate.overlay = document.getElementById("subtitle-overlay");
    if (!subtitleTranslate.overlay) {
      return;
    }
    subtitleTranslate.translatedEl = document.getElementById(
      "subtitle-overlay-en"
    );
    subtitleTranslate.originalEl = document.getElementById(
      "subtitle-overlay-ja"
    );
  },

  show: function (translated, original) {
    subtitleTranslate.ensureOverlay();
    if (!subtitleTranslate.overlay) {
      return;
    }
    subtitleTranslate.translatedEl.textContent = translated || "";
    subtitleTranslate.originalEl.textContent = original || "";
    subtitleTranslate.overlay.style.display = "flex";
  },

  hide: function () {
    subtitleTranslate.ensureOverlay();
    subtitleTranslate.lastText = "";
    if (!subtitleTranslate.overlay) {
      return;
    }
    subtitleTranslate.translatedEl.textContent = "";
    subtitleTranslate.originalEl.textContent = "";
    subtitleTranslate.overlay.style.display = "none";
  },

  start: function (options) {
    options = options || {};
    subtitleTranslate.stop();
    subtitleTranslate.enabled = true;
    subtitleTranslate.mode = options.mode || "official-en";
    subtitleTranslate.ocrBlocked = false;
    subtitleTranslate.ensureOverlay();
    subtitleTranslate.resolveSoftUrl(options, function (url) {
      if (url) {
        subtitleTranslate.loadSoftTrack(url);
      }
    });
    if (subtitleTranslate.mode === "signs") {
      subtitleTranslate.startOcrWatch();
    }
  },

  stop: function () {
    subtitleTranslate.enabled = false;
    subtitleTranslate.mode = "off";
    subtitleTranslate.cues = [];
    subtitleTranslate.cueIndex = 0;
    subtitleTranslate.lastOcrText = "";
    clearInterval(subtitleTranslate.ocrTimer);
    subtitleTranslate.detachNativeTracks();
    subtitleTranslate.hide();
  },

  resolveSoftUrl: function (options, done) {
    var fromPayload = subtitleTranslate.pickEnglishSoftUrl(options.playData);
    if (fromPayload) {
      done(fromPayload);
      return;
    }
    if (options.softUrl) {
      done(options.softUrl);
      return;
    }
    var versions = options.versions || [];
    var jp = null;
    for (var i = 0; i < versions.length; i++) {
      if (String(versions[i].name || "").indexOf("ja") === 0) {
        jp = versions[i];
        break;
      }
    }
    if (!jp || !jp.id || jp.id === options.episodeId) {
      done(null);
      return;
    }
    service.video_v2({
      data: { id: jp.id },
      success: function (jpData) {
        done(subtitleTranslate.pickEnglishSoftUrl(jpData));
      },
      error: function () {
        done(null);
      },
    });
  },

  loadSoftTrack: function (url) {
    fetch(url)
      .then(function (res) {
        return res.text();
      })
      .then(function (body) {
        if (!subtitleTranslate.enabled) {
          return;
        }
        subtitleTranslate.cues = subtitleTranslate.parseSubtitleFile(body);
      })
      .catch(function (error) {
        console.log("soft subtitle load failed", error);
      });
  },

  parseSubtitleFile: function (body) {
    if (!body) {
      return [];
    }
    var trimmed = body.replace(/^\uFEFF/, "");
    if (trimmed.indexOf("WEBVTT") === 0) {
      return subtitleTranslate.parseVtt(trimmed);
    }
    if (trimmed.indexOf("[Events]") >= 0 || trimmed.indexOf("Dialogue:") >= 0) {
      return subtitleTranslate.parseAss(trimmed);
    }
    return subtitleTranslate.parseSrt(trimmed);
  },

  parseVtt: function (body) {
    var blocks = body.replace(/\r/g, "").split("\n\n");
    var cues = [];
    for (var i = 0; i < blocks.length; i++) {
      var lines = blocks[i].split("\n").filter(function (line) {
        return line && line.indexOf("WEBVTT") !== 0 && line.indexOf("NOTE") !== 0;
      });
      var timeLine = lines.filter(function (line) {
        return line.indexOf("-->") >= 0;
      })[0];
      if (!timeLine) {
        continue;
      }
      var times = timeLine.split("-->");
      var text = lines
        .filter(function (line) {
          return line.indexOf("-->") < 0 && !/^\d+$/.test(line);
        })
        .join("\n");
      var cleaned = subtitleTranslate.cleanText(text);
      cues.push({
        start: subtitleTranslate.parseTimestamp(times[0]),
        end: subtitleTranslate.parseTimestamp(times[1]),
        text: cleaned,
        isSign: subtitleTranslate.isSignCue("", cleaned),
      });
    }
    return cues.filter(function (cue) {
      return cue.text;
    });
  },

  parseSrt: function (body) {
    return subtitleTranslate.parseVtt("WEBVTT\n\n" + body.replace(/,/g, "."));
  },

  parseAss: function (body) {
    var lines = body.replace(/\r/g, "").split("\n");
    var cues = [];
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].indexOf("Dialogue:") !== 0) {
        continue;
      }
      var payload = lines[i].slice("Dialogue:".length);
      var parts = payload.split(",");
      if (parts.length < 10) {
        continue;
      }
      var style = parts[3] || "";
      var text = subtitleTranslate.cleanText(parts.slice(9).join(","));
      cues.push({
        start: subtitleTranslate.parseTimestamp(parts[1]),
        end: subtitleTranslate.parseTimestamp(parts[2]),
        style: style,
        text: text,
        isSign: subtitleTranslate.isSignCue(style, text),
      });
    }
    return cues;
  },

  isSignCue: function (style, text) {
    var styleName = String(style || "").toLowerCase();
    if (
      /sign|caption|screen|title|onscreen|overlap|note|song/.test(styleName)
    ) {
      return true;
    }
    return /[\u3040-\u30ff\u4e00-\u9faf]/.test(text || "");
  },

  parseTimestamp: function (value) {
    var cleaned = (value || "").trim().split(" ")[0].replace(",", ".");
    var pieces = cleaned.split(":");
    if (pieces.length < 2) {
      return 0;
    }
    var hours = pieces.length === 3 ? Number(pieces[0]) : 0;
    var minutes = Number(pieces[pieces.length === 3 ? 1 : 0]);
    var seconds = Number(pieces[pieces.length === 3 ? 2 : 1]);
    return hours * 3600 + minutes * 60 + seconds;
  },

  cleanText: function (value) {
    return String(value || "")
      .replace(/\{\\[^}]*\}/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\\N/g, "\n")
      .replace(/\\n/g, "\n")
      .replace(/\\h/g, " ")
      .replace(/\s+\n/g, "\n")
      .trim();
  },

  sync: function (time) {
    if (!subtitleTranslate.enabled) {
      return;
    }
    var cues = subtitleTranslate.cues;
    if (!cues.length) {
      return;
    }
    var active = subtitleTranslate.activeCue(time);
    if (active) {
      subtitleTranslate.interceptSubtitleText(active.text);
    } else if (subtitleTranslate.mode !== "signs" && subtitleTranslate.lastText) {
      subtitleTranslate.hide();
    }
  },

  activeCue: function (time) {
    var cues = subtitleTranslate.cues;
    var matchMode = function (cue) {
      return subtitleTranslate.mode === "signs" ? cue.isSign : true;
    };
    var index = subtitleTranslate.cueIndex;
    if (
      cues[index] &&
      matchMode(cues[index]) &&
      time >= cues[index].start &&
      time <= cues[index].end
    ) {
      return cues[index];
    }
    for (var i = 0; i < cues.length; i++) {
      if (matchMode(cues[i]) && time >= cues[i].start && time <= cues[i].end) {
        subtitleTranslate.cueIndex = i;
        return cues[i];
      }
    }
    return null;
  },

  startOcrWatch: function () {
    clearInterval(subtitleTranslate.ocrTimer);
    subtitleTranslate.ocrTimer = setInterval(function () {
      if (!subtitleTranslate.enabled || subtitleTranslate.mode !== "signs") {
        return;
      }
      if (subtitleTranslate.ocrBlocked) {
        return;
      }
      var time = player.getPlayed && player.getPlayed();
      if (subtitleTranslate.activeCue(time)) {
        return;
      }
      subtitleTranslate.captureOnscreenText();
    }, 2500);
  },

  captureOnscreenText: function () {
    var videoEl = player.getVideo && player.getVideo();
    if (!videoEl || videoEl.readyState < 2) {
      return;
    }
    var canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 360;
    try {
      var ctx = canvas.getContext("2d");
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      var dataUrl = canvas.toDataURL("image/jpeg", 0.6);
      subtitleTranslate.sendOcr(dataUrl);
    } catch (error) {
      subtitleTranslate.ocrBlocked = true;
      console.log(
        "On-screen OCR cannot read this Widevine video frame (canvas is tainted)."
      );
    }
  },

  sendOcr: function (dataUrl) {
    if (
      !subtitleTranslate.ocrApiKey ||
      subtitleTranslate.ocrApiKey.indexOf("YOUR_") === 0
    ) {
      return;
    }
    var payload = new FormData();
    payload.append("base64Image", dataUrl);
    payload.append("language", "jpn");
    payload.append("isOverlayRequired", "false");
    payload.append("OCREngine", "2");
    payload.append("apikey", subtitleTranslate.ocrApiKey);

    fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: payload,
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (json) {
        var parsed =
          json.ParsedResults &&
          json.ParsedResults[0] &&
          json.ParsedResults[0].ParsedText;
        var text = subtitleTranslate.cleanText(parsed);
        if (!text || !/[\u3040-\u30ff\u4e00-\u9faf]/.test(text)) {
          if (!subtitleTranslate.activeCue(player.getPlayed())) {
            subtitleTranslate.hide();
          }
          return;
        }
        if (text === subtitleTranslate.lastOcrText) {
          return;
        }
        subtitleTranslate.lastOcrText = text;
        subtitleTranslate.interceptSubtitleText(text);
      })
      .catch(function (error) {
        console.log("ocr failed", error);
      });
  },

  attachPlayer: function (mediaPlayer, videoEl) {
    if (!subtitleTranslate.enabled || !mediaPlayer) {
      return;
    }
    try {
      mediaPlayer.updateSettings({
        streaming: {
          text: {
            defaultEnabled: true,
          },
        },
      });
    } catch (error) {}

    var onCue = function (event) {
      var text =
        (event && event.cue && (event.cue.text || event.cue.payload)) ||
        (event && event.text) ||
        "";
      subtitleTranslate.interceptSubtitleText(text);
    };
    try {
      mediaPlayer.on("cueEnter", onCue);
    } catch (error) {}

    subtitleTranslate.bindNativeTracks(videoEl);
  },

  bindNativeTracks: function (videoEl) {
    subtitleTranslate.detachNativeTracks();
    if (!videoEl || !videoEl.textTracks) {
      return;
    }
    subtitleTranslate.onCueChange = function (event) {
      var track = event.target;
      var active = track.activeCues && track.activeCues[0];
      subtitleTranslate.interceptSubtitleText(active ? active.text : "");
    };
    for (var i = 0; i < videoEl.textTracks.length; i++) {
      var track = videoEl.textTracks[i];
      track.mode = "hidden";
      track.addEventListener("cuechange", subtitleTranslate.onCueChange);
      subtitleTranslate.nativeTracks.push(track);
    }
    videoEl.addEventListener("addtrack", function () {
      subtitleTranslate.bindNativeTracks(videoEl);
    });
  },

  detachNativeTracks: function () {
    if (!subtitleTranslate.onCueChange) {
      subtitleTranslate.nativeTracks = [];
      return;
    }
    for (var i = 0; i < subtitleTranslate.nativeTracks.length; i++) {
      subtitleTranslate.nativeTracks[i].removeEventListener(
        "cuechange",
        subtitleTranslate.onCueChange
      );
    }
    subtitleTranslate.nativeTracks = [];
  },

  pickEnglishSoftUrl: function (data) {
    if (!data) {
      return null;
    }
    var groups = [data.subtitles, data.captions, data.softSubs];
    for (var g = 0; g < groups.length; g++) {
      var group = groups[g];
      if (!group) {
        continue;
      }
      var preferred = group["en-US"] || group["en"] || group.enUS;
      if (preferred && preferred.url) {
        return preferred.url;
      }
      var keys = Object.keys(group);
      for (var i = 0; i < keys.length; i++) {
        if (keys[i].indexOf("en") === 0 && group[keys[i]].url) {
          return group[keys[i]].url;
        }
      }
    }
    return null;
  },

  pickJapaneseSoftUrl: function (data) {
    var groups = [data.subtitles, data.captions, data.softSubs];
    for (var g = 0; g < groups.length; g++) {
      var group = groups[g];
      if (!group) {
        continue;
      }
      var preferred = group["ja-JP"] || group["ja"] || group.jaJP;
      if (preferred && preferred.url) {
        return preferred.url;
      }
      var keys = Object.keys(group);
      for (var i = 0; i < keys.length; i++) {
        if (keys[i].indexOf("ja") === 0 && group[keys[i]].url) {
          return group[keys[i]].url;
        }
      }
    }
    return null;
  },
};
