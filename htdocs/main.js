/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

var MOUSE_RADIUS = 10;
var Main = {
  init: function() {
    var FEEDBACK_SOUND_SOURCE = "24dB.wav";
    //feedbacks 
    Main.soundFeedback = new SoundFeedback();
    Main.soundFeedback.setAudioSource(FEEDBACK_SOUND_SOURCE, function(control) {
    });
    Main.pressureFeedback = new PressureFeedback();
    
    Main.canvas = document.getElementById("handwriting-canvas");
    Main.canvasContext = Main.canvas.getContext("2d");
    
    //canvas size
    Main.resize();
    window.addEventListener("resize", Main.resize);
    
    //user's action
    Main.canvas.addEventListener("mousedown", Main.mouseDown, false);
    Main.canvas.addEventListener("mousemove", Main.mouseMove, false);
    Main.canvas.addEventListener("mouseup", Main.mouseUp, false);
    Main.canvas.addEventListener("touchstart", Main.touchStart,false);
    Main.canvas.addEventListener("touchmove", Main.touchMove, false);
    Main.canvas.addEventListener("touchend", Main.touchEnd, false);
  },
  
  resize: function(e) {
    var width = window.innerWidth;
    var height = window.innerHeight;
    Main.canvas.setAttribute("width", width);
    Main.canvas.setAttribute("height", height);
  },
  
  startWriting: function(x, y, radiusX, radiusY, force) {
    //line style 
    // https://developer.mozilla.org/ja/docs/HTML/Canvas/Tutorial/Applying_styles_and_colors?redirectlocale=ja&redirectslug=Canvas_tutorial%2FApplying_styles_and_colors
    Main.canvasContext.strokeStyle = "white";
    Main.canvasContext.lineCap = 'round';
    Main.canvasContext.lineJoin = 'round';

    //feedback
    Main.soundFeedback.start(x, y);
    //this feedback change the lineWidth
    Main.pressureFeedback.start(Main.canvasContext, x, y, radiusX, radiusY, force);
//    Main.canvasContext.lineWidth = 10;

    Main.canvasContext.beginPath();
    Main.canvasContext.moveTo(x, y);
  },
  
  updateWriting: function(x, y, radiusX, radiusY, force) {
    //feedback
    Main.soundFeedback.update(x, y);
    Main.pressureFeedback.update(Main.canvasContext, x, y, radiusX, radiusY, force);

    Main.canvasContext.lineTo(x, y);
    Main.canvasContext.stroke();
    Main.canvasContext.closePath();
    Main.canvasContext.beginPath();
    Main.canvasContext.moveTo(x, y);
  },
  
  stopWriting: function(x, y, radiusX, radiusY, force) {
    Main.canvasContext.closePath();
    //feedback
    Main.soundFeedback.stop();
    Main.pressureFeedback.stop();
  },
  
  mouseDown: function(e) {
    e.preventDefault();
    Main.isWriting = true;
    Main.startWriting(e.clientX, e.clientY, MOUSE_RADIUS, MOUSE_RADIUS, 1);
  },

  mouseMove: function(e) {
    e.preventDefault();
    if (!Main.isWriting) {
      return;
    }
    Main.updateWriting(e.clientX, e.clientY, MOUSE_RADIUS, MOUSE_RADIUS, 1);
  },

  mouseUp: function(e) {
    e.preventDefault();
    if (!Main.isWriting) {
      return;
    }
    Main.isWriting = false;
    Main.stopWriting(e.clientX, e.clientY, MOUSE_RADIUS, MOUSE_RADIUS, 1);
  },

  touchStart: function(e) {
    e.preventDefault();
    Main.isWriting = true;
    var first = e.changedTouches[0];
    Main.startWriting(first.clientX, first.clientY, first.radiusX, first.radiusY, first.force);
  },

  touchMove: function(e) {
    e.preventDefault();
    if (!Main.isWriting) {
      return;
    }
    var first = e.changedTouches[0];
    Main.updateWriting(first.clientX, first.clientY, first.radiusX, first.radiusY, first.force);
  },

  touchEnd: function(e) {
    e.preventDefault();
    if (!Main.isWriting) {
      return;
    }
    Main.isWriting = false;
    var first = e.changedTouches[0];
    Main.stopWriting(first.clientX, first.clientY, first.radiusX, first.radiusY, first.force);
  }
}

window.addEventListener("load", function(e) {
  Main.init();
}, false);