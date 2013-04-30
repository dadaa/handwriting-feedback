/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */


var Main = {
  init: function() {
    var FEEDBACK_SOUND_SOURCE = "24dBshort.wav";
    Main.feedbackControls = new HandwritingFeedback();
    Main.feedbackControls.setAudioSource(FEEDBACK_SOUND_SOURCE, function(control) {
//      Main.feedbackControls.start();
    });
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
  
  startWriting: function(x, y) {
    //feedback
    Main.feedbackControls.start(x, y);

    //line style 
    // https://developer.mozilla.org/ja/docs/HTML/Canvas/Tutorial/Applying_styles_and_colors?redirectlocale=ja&redirectslug=Canvas_tutorial%2FApplying_styles_and_colors
    Main.canvasContext.strokeStyle = "white";
    Main.canvasContext.lineWidth = 10;
    Main.canvasContext.lineCap = 'round';
    Main.canvasContext.lineJoin = 'round';
    
    Main.canvasContext.beginPath();
    Main.canvasContext.moveTo(x, y);
  },
  
  updateWriting: function(x, y) {
    //feedback
    Main.feedbackControls.update(x, y);

    Main.canvasContext.lineTo(x, y);
    Main.canvasContext.stroke();
  },
  
  stopWriting: function(x, y) {
    Main.canvasContext.closePath();
    //feedback
    Main.feedbackControls.stop();
  },
  
  mouseDown: function(e) {
    e.preventDefault();
    Main.isWriting = true;
    Main.startWriting(e.clientX, e.clientY);
  },

  mouseMove: function(e) {
    e.preventDefault();
    if (!Main.isWriting) {
      return;
    }
    Main.updateWriting(e.clientX, e.clientY);
  },

  mouseUp: function(e) {
    e.preventDefault();
    if (!Main.isWriting) {
      return;
    }
    Main.isWriting = false;
    Main.stopWriting(e.clientX, e.clientY);
  },

  touchStart: function(e) {
    e.preventDefault();
    Main.isWriting = true;
    var first = e.changedTouches[0];
    Main.startWriting(first.clientX, first.clientY);
  },

  touchMove: function(e) {
    e.preventDefault();
    if (!Main.isWriting) {
      return;
    }
    var first = e.changedTouches[0];
    Main.updateWriting(first.clientX, first.clientY);
  },

  touchEnd: function(e) {
    e.preventDefault();
    if (!Main.isWriting) {
      return;
    }
    Main.isWriting = false;
    var first = evt.changedTouches[0];
    Main.stopWriting(first.clientX, first.clientY);
  }
}

window.addEventListener("load", function(e) {
  Main.init();
}, false);