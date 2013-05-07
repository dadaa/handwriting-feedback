/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */


var PressureFeedback = function() {
}

PressureFeedback.prototype.start = function(canvasContext, x, y, radiusX, radiusY, force) {
  canvasContext.lineWidth = radiusX*force;
},

PressureFeedback.prototype.update = function(canvasContext, x, y, radiusX, radiusY, force) {
//  console.log(radiusX+" "+radiusY+" "+force);
  canvasContext.lineWidth = radiusX*force;
},
  
PressureFeedback.prototype.stop = function() {
}