/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */


var SoundFeedback = function() {
}

SoundFeedback.prototype.setAudioSource = function(source, loadedListener) {
  var self = this;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", source, true);
  xhr.responseType = "arraybuffer";
  xhr.onload = function() {
    var audioContext = window.webkitAudioContext ? new window.webkitAudioContext() : new AudioContext();
    audioContext.decodeAudioData(xhr.response, function onSuccess(result) {
      var gainControl = audioContext.createGain();
      var audioSource = audioContext.createBufferSource();

      audioSource.connect(gainControl);
      gainControl.connect(audioContext.destination);

      gainControl.gain.value = 0;
      audioSource.buffer = result;
      audioSource.loop = true;
      audioSource.start(0);
      
      self.audioContext = audioContext;
      self.gainControl = gainControl;
      if (loadedListener) {
        loadedListener(self);
      }
    });
  };
  xhr.send();
}

SoundFeedback.prototype.muteTimer = function() {
  clearTimeout(this.timer);
  var self = this;
  this.timer = setTimeout(function() {
    self.gainControl.gain.value = 0;
  }, 50);
  self.gainControl.gain.value = 1;
}
  
SoundFeedback.prototype.start = function(x, y) {
  this.gainControl.gain.value = 1;
  this.muteTimer();
},

SoundFeedback.prototype.update = function(x, y) {
  this.muteTimer();
},
  
SoundFeedback.prototype.stop = function(x, y) {
  this.gainControl.gain.value = 0;
}